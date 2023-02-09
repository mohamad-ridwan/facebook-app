import React, { useState, useEffect } from 'react'
import './PublicPosts.scss'
import API from '../../useFetch'
import { storeUsers } from '../../zustand/users'
import { storeAuthLogin } from '../../zustand/authLogin'
import PostCard from '../PostCard/PostCard'
import NoPosting from '../NoPosting/NoPosting'

const PublicPosts = () => {
  const [dataPosts, setDataPosts] = useState([])
  const [loadingSubmitComment, setLoadingSubmitComment] = useState(null)
  const [loadingGetPosts, setLoadingGetPosts] = useState(false)

  const users = storeUsers((state) => state.users)
  const id = storeAuthLogin((state) => state.id)

  function popUpMsgServerError() {
    alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
  }

  async function getMyData() {
    return await new Promise((resolve, reject) => {
      API.APIGetOneUser(id)
        .then(res => {
          if (res?.data) {
            resolve(res.data)
          }
        })
        .catch(err => reject(err))
    })
  }

  async function getMyFriend(notMe) {
    return await new Promise((resolve) => {
      const newData = []

      for (let i = 0; i < notMe.length; i++) {
        const checkF = notMe[i].teman.length > 0 ? notMe[i].teman.filter(e => e.id === id) : []

        if (checkF.length !== 0) {
          newData.push(notMe[i])
        }
      }

      setTimeout(() => {
        resolve(newData)
      }, 500)
    })
  }

  async function postsFromFriend(friend) {
    return await new Promise((resolve) => {
      let newData = []

      for (let i = 0; i < friend.length; i++) {
        const getPost = friend[i].posts
        if (getPost.length > 0) {
          newData = [...newData, ...getPost]
        }
      }

      setTimeout(() => {
        resolve(newData)
      }, 500)
    })
  }

  function urutDariWaktuTerbaru(dataPosts) {
    const sortTime = dataPosts.sort((a, b) => (new Date(b.timeZone) - new Date(a.timeZone)))
    setDataPosts(sortTime)
    setLoadingGetPosts(false)
  }

  function getPostsFromFriends() {
    setLoadingGetPosts(true)

    API.APIGetAllUser()
      .then(res => {
        if (res?.data && res?.data?.length > 0) {
          const result = res.data
          const notMe = result.filter(e => e.id !== id)

          if (notMe.length > 0) {
            getMyFriend(notMe)
              .then(res => {
                if (res.length > 0) {
                  getMyData()
                    .then(rs => {
                      if (rs?.posts?.length > 0) {
                        postsFromFriend([...res, rs])
                          .then(result => {
                            if (result.length > 0) {
                              urutDariWaktuTerbaru(result)
                            } else {
                              setLoadingGetPosts(false)
                            }
                          })
                      } else {
                        postsFromFriend(res)
                          .then(result => {
                            if (result.length > 0) {
                              urutDariWaktuTerbaru(result)
                            } else {
                              setLoadingGetPosts(false)
                            }
                          })
                      }
                    })
                    .catch(err => {
                      setLoadingGetPosts(false)
                      console.log(err)
                    })
                } else {
                  getMyData()
                    .then(rslt => {
                      if (rslt?.posts?.length > 0) {
                        postsFromFriend([rslt])
                          .then(result => {
                            if (result.length > 0) {
                              urutDariWaktuTerbaru(result)
                            } else {
                              setLoadingGetPosts(false)
                            }
                          })
                      } else {
                        setLoadingGetPosts(false)
                      }
                    })
                    .catch(err => {
                      setLoadingGetPosts(false)
                      console.log(err)
                    })
                }
              })
          } else {
            setLoadingGetPosts(false)
          }
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getPostsFromFriends()
  }, [])

  async function updatePostAfterLike() {
    return await new Promise((resolve, reject) => {
      API.APIGetAllUser()
        .then(res => {
          if (res?.data) {
            const result = res.data

            let newPostsData = []

            for (let i = 0; i < result.length; i++) {
              const checkPosts = result[i].posts.length > 0

              if (checkPosts) {
                newPostsData = [...newPostsData, ...result[i].posts]
              }
            }

            setTimeout(() => {
              resolve(newPostsData)
            }, 500);
          }
        })
        .catch(err => reject(err))
    })
  }

  async function getPostsAfterUpdateLikePost(allPostData) {
    return await new Promise((resolve) => {
      const newPostData = []

      for (let i = 0; i < dataPosts.length; i++) {
        const getPosts = allPostData.filter(e => e.idLocation === dataPosts[i].idLocation)

        if (getPosts.length !== 0) {
          newPostData.push(getPosts[0])
        }
      }

      setTimeout(() => {
        resolve(newPostData)
      }, 500);
    })
  }

  function addLikePosts(friendId, idLocation) {
    const data = {
      id: id
    }

    API.APIPostLikePosts(friendId, idLocation, data)
      .then(res => {
        if (res?.data) {
          updatePostAfterLike()
            .then(res => {
              getPostsAfterUpdateLikePost(res)
                .then(result => {
                  setDataPosts(result)
                })
            })
            .catch(err => {
              console.log(err)
              popUpMsgServerError()
            })
        }
      })
      .catch(err => {
        console.log(err)
        popUpMsgServerError()
      })
  }

  function clickLike(e) {
    API.APIGetOneUser(e.id)
      .then(res => {
        if (res?.data) {
          const getPost = res.data.posts
          const getContent = getPost.length > 0 ? getPost.filter(v => v.idLocation === e.idLocation) : []
          const getLike = getContent.length > 0 ? getContent[0].like.length > 0 ? getContent[0].like.filter(v => v.id === id) : [] : []

          if (getLike.length === 0) {
            addLikePosts(e.id, e.idLocation)
          }
        }
      })
      .catch(err => {
        console.log(err)
        popUpMsgServerError()
      })
  }

  function postMyComment(friendId, idLocation, data) {
    API.APIPostComments(friendId, idLocation, data)
      .then(res => {
        if (res?.data) {
          updatePostAfterLike()
            .then(res => {
              getPostsAfterUpdateLikePost(res)
                .then(result => {
                  setDataPosts(result)

                  const elInput = document.getElementById(`inputComment${idLocation}`)
                  if (elInput) {
                    elInput.value = ''
                  }
                  setLoadingSubmitComment(null)
                })
            })
            .catch(err => {
              console.log(err)
              setLoadingSubmitComment(null)
              popUpMsgServerError()
            })
        }
      })
      .catch(err => {
        console.log(err)
        setLoadingSubmitComment(null)
        popUpMsgServerError()
      })
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  function submitComment(e) {
    const elInput = document.getElementById(`inputComment${e.idLocation}`)
    if (elInput && elInput.value.trim() && loadingSubmitComment === null) {
      setLoadingSubmitComment(e.idLocation)

      const idxMonth = new Date().getMonth()
      const date = new Date().getDate()
      const years = new Date().getFullYear()
      const hours = new Date().getHours().toString().length === 1 ? `0${new Date().getHours()}` : new Date().getHours()
      const minutes = new Date().getMinutes().toString().length === 1 ? `0${new Date().getMinutes()}` : new Date().getMinutes()

      const newDate = `${months[idxMonth]} ${date}, ${years} · ${hours}:${minutes}`

      const username = `${users?.namaDepan} ${users?.namaBelakang}`
      const data = {
        id: id,
        username: username,
        fotoProfil: users?.fotoProfil,
        message: elInput.value,
        date: newDate
      }

      postMyComment(e.id, e.idLocation, data)
    }
  }

  return (
    <div className="wrapp-public-posts">
      <div className="public-posts">
        {dataPosts.length > 0 ? dataPosts.map((e, i) => (
          <PostCard
            key={i}
            idInputComment={`inputComment${e.idLocation}`}
            data={e}
            onLoading={e.idLocation === loadingSubmitComment}
            users={users}
            clickLike={() => clickLike(e)}
            submitComment={(v) => {
              v.preventDefault()
              submitComment(e)
            }}
          />
        )) : (
          <NoPosting
            onLoading={loadingGetPosts ? true : false}
            noPost={dataPosts.length === 0 ? true : false}
          />
        )}
      </div>
    </div>
  )
}

export default PublicPosts