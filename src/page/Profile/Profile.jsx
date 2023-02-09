import React, { useState, useEffect } from 'react'
import './Profile.scss'
import { ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import { useParams } from 'react-router-dom'
import Container from '../../components/Container/Container'
import EditProfile from '../../components/EditProfile/EditProfile'
import ProfileAttribute from '../../components/ProfileAttribute/ProfileAttribute'
import TitleHelmet from '../../components/TitleHelmet/TitleHelmet'
import { storeUsers } from '../../zustand/users'
import { storeAuthLogin } from '../../zustand/authLogin'
import OpenCreatePost from '../../components/OpenCreatePost/OpenCreatePost'
import ModalCreatePost from '../../components/ModalCreatePost/ModalCreatePost'
import PostAudience from '../../components/ModalCreatePost/PostAudience/PostAudience'
import API from '../../useFetch'
import { storage } from '../../firebase'
import PostCard from '../../components/PostCard/PostCard'
import NoPosting from '../../components/NoPosting/NoPosting'

const Profile = () => {
  const [dataPosts, setDataPosts] = useState([])
  const [onEditProfile, setOnEditProfile] = useState(false)
  const [onCreatePost, setOnCreatePost] = useState(false)
  const [photos, setPhotos] = useState(null)
  const [newPhotos, setNewPhotos] = useState({})
  const [valuePostInput, setValuePostInput] = useState('')
  const [onChoosePostAudience, setOnChoosePostAudience] = useState(false)
  const [valueChoosePostAudience, setValueChoosePostAudience] = useState('Friends')
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingSubmitComment, setLoadingSubmitComment] = useState(null)
  const [loadingGetPosts, setLoadingGetPosts] = useState(false)

  const users = storeUsers((state) => state.users)
  const id = storeAuthLogin((state) => state.id)
  const params = useParams()

  function errMessageFromServer() {
    alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
  }

  function getMyPost() {
    setLoadingGetPosts(true)

    API.APIGetOneUser(id)
      .then(res => {
        if (res?.data) {
          setDataPosts(res.data.posts)
          setLoadingGetPosts(false)
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getMyPost()
  }, [])

  const styleContainer = {
    paddingContainer: '0.5rem 1rem 0 1rem',
    background: '#f0f2f5',
    maxWidthContainer: '1100px'
  }

  function showCreatePost() {
    setOnCreatePost(true)
  }

  function clickAddPhotos() {
    const el = document.getElementById('inputImgPost')
    if (el) {
      return el.click()
    }
  }

  function changePhotos(e) {
    const url = window.URL.createObjectURL(e.target.files[0])
    setPhotos(url)
    setNewPhotos(e.target.files[0])
  }

  function clickAudience(v) {
    setOnChoosePostAudience(false)
    setValueChoosePostAudience(v)
  }

  async function uploadImgPostToFirebase() {
    return await new Promise((resolve, reject) => {
      const imageRef = ref(storage, `posts/img/${newPhotos?.name + v4()}`)
      uploadBytes(imageRef, newPhotos)
        .then((res) => {
          const nameImg = res && res.metadata.name

          getAccessTokenImgUpload(nameImg)
            .then(res => resolve({ tokensImg: res, nameImg: nameImg }))
            .catch(err => reject(err))
        })
    })
  }

  const apiFirebaseStoragePosts = 'https://firebasestorage.googleapis.com/v0/b/facebook-rp.appspot.com/o/posts%2Fimg%2F'

  async function getAccessTokenImgUpload(nameImg) {
    return await new Promise((resolve, reject) => {
      fetch(`${apiFirebaseStoragePosts}${nameImg}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then(res => res.json())
        .then(res => {
          const getAccessToken = res && res.downloadTokens
          resolve(getAccessToken)
        })
        .catch(err => reject({ message: 'Oops! terjadi kesalahan server.\nMohon coba beberapa saat lagi!', error: 'error', jenisError: 'gagal mendapatkan tokens image' }))
    })
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthsTwo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  function uploadMyPost(photo) {
    const idxMonth = new Date().getMonth()
    const date = new Date().getDate()
    const years = new Date().getFullYear()
    const hours = new Date().getHours().toString().length === 1 ? `0${new Date().getHours()}` : new Date().getHours()
    const minutes = new Date().getMinutes().toString().length === 1 ? `0${new Date().getMinutes()}` : new Date().getMinutes()

    const newDate = `${months[idxMonth]} ${date}, ${years} · ${hours}:${minutes}`

    const hoursNow = new Date().getHours()
    const getHours = hoursNow.toString().length === 1 ? `0${hoursNow}` : hoursNow
    const seconds = new Date().getSeconds().toString().length === 1 ? `0${new Date().getSeconds()}` : new Date().getSeconds()
    const getMinute = new Date().getMinutes().toString().length === 1 ? `0${new Date().getMinutes()}` : new Date().getMinutes()
    const getYears = new Date().getFullYear()
    const getMonth = new Date().getMonth()
    const getDate = new Date().getDate()

    const timeZone = `${months[getMonth]} ${getDate}, ${getYears} ${getHours}:${getMinute}:${seconds}`

    const username = `${users?.namaDepan} ${users?.namaBelakang}`
    const data = {
      id: id,
      idLocation: `${new Date().getTime()}`,
      username: username,
      fotoProfil: users?.fotoProfil,
      postAudience: valueChoosePostAudience,
      message: valuePostInput,
      imgPost: photo,
      date: newDate,
      timeZone: timeZone
    }

    API.APIPostPosts(id, data)
      .then(res => {
        if (res?.data) {
          setValuePostInput('')
          setPhotos(null)
          setLoadingPosts(false)
          setOnCreatePost(false)
          getMyPost()
        }
      })
      .catch(err => {
        errMessageFromServer()
        setLoadingPosts(false)
      })
  }

  function submitPost() {
    let err = {}

    if (!valuePostInput) {
      err.subject = 'no subject'
    }
    if (photos === null) {
      err.photos = 'no photos'
    }

    if (Object.keys(err).length < 2 && loadingPosts === false) {
      if (photos !== null) {
        setLoadingPosts(true)
        uploadImgPostToFirebase()
          .then(res => {
            const tokenImg = res.tokensImg
            const nameImg = res.nameImg

            const photo = `${apiFirebaseStoragePosts}${nameImg}?alt=media&token=${tokenImg}`

            uploadMyPost(photo)
          })
          .catch(err => {
            if (err?.error) {
              errMessageFromServer()
              setLoadingPosts(false)
            }
          })
      } else if (photos === null) {
        setLoadingPosts(true)
        uploadMyPost(null)
      }
    }
  }

  function closeCreatePost() {
    setOnCreatePost(false)
    setPhotos(null)
    setValuePostInput('')
  }

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

  function addLikePosts(idLocation) {
    const data = {
      id: id
    }

    API.APIPostLikePosts(id, idLocation, data)
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
              errMessageFromServer()
            })
        }
      })
      .catch(err => {
        console.log(err)
        errMessageFromServer()
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
            addLikePosts(e.idLocation)
          }
        }
      })
      .catch(err => {
        console.log(err)
        errMessageFromServer()
      })
  }

  function postMyComment(idLocation, data) {
    API.APIPostComments(id, idLocation, data)
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
              errMessageFromServer()
            })
        }
      })
      .catch(err => {
        console.log(err)
        setLoadingSubmitComment(null)
        errMessageFromServer()
      })
  }

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

      postMyComment(e.idLocation, data)
    }
  }

  return (
    <>
      <TitleHelmet
        title={`${users && users.email ? users.namaDepan + ' ' + users.namaBelakang + ' ' + '|' : ''} Facebook`}
      />
      <EditProfile
        displayWrapp={onEditProfile ? 'flex' : 'none'}
        close={() => setOnEditProfile(false)}
        users={users}
      />
      <ProfileAttribute
        users={params && params.profileUser === `${users.namaDepan}${users.namaBelakang}` ? users : {}}
        clickEditPf={() => setOnEditProfile(true)}
      />
      <Container
        {...styleContainer}
        children={
          <>
            <PostAudience
              displayWrapp={onChoosePostAudience ? 'flex' : 'none'}
              closeModal={() => setOnChoosePostAudience(false)}
              clickAudience={(v) => clickAudience(v)}
              activeChoose={valueChoosePostAudience}
            />
            <ModalCreatePost
              users={users}
              clickAddPhotos={clickAddPhotos}
              clickChange={clickAddPhotos}
              changePhotos={changePhotos}
              clickCancel={() => setPhotos(null)}
              placeholder="What's on your mind?"
              changePostInput={(e) => setValuePostInput(e.target.value)}
              valueTxtInput={valuePostInput}
              closeModal={closeCreatePost}
              loadingPosts={loadingPosts ? 'flex' : 'none'}
              displayWrapp={onCreatePost ? 'flex' : 'none'}
              chooseAudience={() => setOnChoosePostAudience(true)}
              valueChoosePostAudience={valueChoosePostAudience}
              dataPhotos={photos}
              onReadySubmit={valuePostInput.length > 0 || photos !== null ? true : false}
              submit={submitPost}
            />
            <div className="wrapp-profile">
              <div className="left-profile">
                <h1>Friends</h1>
              </div>
              <div className="right-profile">
                <OpenCreatePost
                  img={users?.fotoProfil}
                  title="What's on your mind?"
                  click={showCreatePost}
                />
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
          </>
        }
      />
    </>
  )
}

export default Profile