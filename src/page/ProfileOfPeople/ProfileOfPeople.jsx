import React, { useEffect, useState } from 'react'
import './ProfileOfPeople.scss'
import io from 'socket.io-client'
import { useNavigate, useParams } from 'react-router-dom'
import './ProfileOfPeople.scss'
import { API_ENDPOINT_LOCAL } from '../../api'
import ProfileAttribute from '../../components/ProfileAttribute/ProfileAttribute'
import TitleHelmet from '../../components/TitleHelmet/TitleHelmet'
import API from '../../useFetch'
import { storeUsers } from '../../zustand/users'
import { storeAuthLogin } from '../../zustand/authLogin'
import Container from '../../components/Container/Container'
import PostCard from '../../components/PostCard/PostCard'
import NoPosting from '../../components/NoPosting/NoPosting'

const socket = io.connect(API_ENDPOINT_LOCAL)

const ProfileOfPeople = () => {
    const [profileResult, setProfileResult] = useState({})
    const [dataPermintaanTeman, setDataPermintaanTeman] = useState({})
    const [friendIsAvailable, setFriendIsAvailable] = useState('Add Friend')
    const [iconFriend, setIconFriend] = useState('fa-solid fa-user-check')
    const [dataPosts, setDataPosts] = useState([])
    const [loadingSubmitComment, setLoadingSubmitComment] = useState(null)
    const [loadingGetPosts, setLoadingGetPosts] = useState(false)

    const users = storeUsers((state) => state.users)
    const navigate = useNavigate()
    const permintaanPertemanan = storeUsers((state) => state.permintaanPertemanan)
    const addFriend = storeUsers((state) => state.addFriend)
    const addTeman = storeUsers((state) => state.addTeman)
    const teman = storeUsers((state) => state.teman)
    const addNotifikasi = storeUsers((state) => state.addNotifikasi)
    const addContacts = storeUsers((state) => state.addContacts)
    const addId = storeAuthLogin((state) => state.addId)
    const id = storeAuthLogin((state) => state.id)

    const params = useParams()

    function errMessageFromServer() {
        alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
    }

    function getProfileOfSearch() {
        API.APIGetOneUser(params.id)
            .then(res => {
                if (res && res.data !== null && res.data.userVerifikasi === true) {
                    const result = res.data
                    setProfileResult(result)
                    const checkMyAccount = result.teman.filter(e => e.id === users.id)
                    const checkPermintaanTeman = result.notifPermintaanTeman.length > 0 ? result.notifPermintaanTeman.filter(e => e.id === id) : []
                    if (checkPermintaanTeman.length === 1) {
                        setFriendIsAvailable('Cancelled')
                        setIconFriend('fa-solid fa-circle-xmark')
                        setDataPermintaanTeman(checkPermintaanTeman[0])
                    } else if (checkMyAccount.length === 0) {
                        setFriendIsAvailable('Add Friend')
                        setIconFriend('fa-solid fa-user-plus')
                        setDataPermintaanTeman({})
                    } else {
                        setFriendIsAvailable('Friends')
                        setIconFriend('fa-solid fa-user-check')
                    }
                } else {
                    alert('user tidak ditemukan!')
                    navigate('/')
                }
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
                navigate('/')
            })
    }

    useEffect(() => {
        if (params && params.id) {
            getProfileOfSearch()
        } else {
            alert('wrong id users')
            navigate('/')
        }
    }, [params, permintaanPertemanan, teman])

    useEffect(() => {
        const checkPermintaanTeman = permintaanPertemanan.length > 0 ? permintaanPertemanan.filter(e => e.id === profileResult?.id) : []
        const checkTeman = teman.length > 0 ? teman.filter(e => e.id === profileResult?.id) : []
        if (checkPermintaanTeman.length === 1) {
            setFriendIsAvailable('Accept')
            setIconFriend('fa-solid fa-user-check')
            setDataPermintaanTeman(checkPermintaanTeman[0])
        } else if (checkTeman.length === 1) {
            setFriendIsAvailable('Friends')
            setIconFriend('fa-solid fa-user-check')
            setDataPermintaanTeman({})
        }
    }, [profileResult, permintaanPertemanan, teman])

    useEffect(() => {
        setLoadingGetPosts(true)
        API.APIGetOneUser(params.id)
            .then(res => {
                if (res?.data) {
                    const result = res.data
                    setDataPosts(result.posts)
                    setLoadingGetPosts(false)
                }
            })
            .catch(err => console.log(err))
    }, [params])

    // add friend
    function updateNotifikasi(id) {
        API.APIGetOneUser(id)
            .then(res => {
                if (res && res.data) {
                    addTeman(res.data.teman)
                    addNotifikasi(res.data.notifikasi)
                    addFriend(res.data.notifPermintaanTeman)
                    getProfileOfSearch()
                }
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
            })
    }

    function postNotifikasiPertemanan() {
        const data = {
            message: 'send-request-friends',
            userId: profileResult.id,
            attribute: {
                id: users.id,
                namaDepan: users.namaDepan,
                namaBelakang: users.namaBelakang,
                email: users.email,
                fotoProfil: users.fotoProfil
            }
        }

        API.APIPostNotifPermintaanPertemanan(profileResult.id, data.attribute)
            .then(res => {
                socket.emit('add-friends', data)
                setTimeout(() => {
                    updateNotifikasi(id)
                }, 1000);
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
            })
    }

    function friendCheckAvailable() {
        API.APIGetOneUser(profileResult.id)
            .then(res => {
                const result = res.data
                const teman = result.teman

                if (teman.length > 0) {
                    const checkMyAccount = teman.filter(e => e.id === users.id)

                    if (checkMyAccount.length === 0) {
                        postNotifikasiPertemanan()
                    } else {
                        alert('Anda sudah menjadi teman!')
                        window.location.reload()
                    }
                } else {
                    postNotifikasiPertemanan()
                }
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
            })
    }
    // end add friend

    // terima permintaan teman
    function getContactOn(data) {
        API.APIGetAllUser()
            .then(res => {
                if (res && res.data) {
                    const result = res.data
                    if (result.length > 0) {
                        let newData = []
                        for (let i = 0; i < data.length; i++) {
                            result.filter(e => e.id === data[i].id ? newData.push(e) : null)
                        }

                        setTimeout(() => {
                            addContacts(newData)
                        }, 0);
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function updateUser() {
        API.APIGetOneUser(id)
            .then(res => {
                addId(res.data.id)
                addFriend(res.data.notifPermintaanTeman)
                addNotifikasi(res.data.notifikasi)
                addTeman(res.data.teman)
                getContactOn(res.data.teman)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function updateNotification(userId) {
        socket.emit('push-notification', { userId: userId })
    }

    function deleteNotifFriendRequest(idTeman) {
        API.APIDeleteNotifFriendRequest(users.id, idTeman)
            .then(res => {
                updateNotification(idTeman)

                setTimeout(() => {
                    updateUser()
                }, 1000)
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
            })
    }

    function pushNotification(id, idTeman, data) {
        const newData = {
            namaDepan: data.namaDepan,
            namaBelakang: data.namaBelakang,
            email: data.email,
            fotoProfil: data.fotoProfil,
            message: 'accepted your friend request',
            timeNotifikasi: false
        }
        API.APIPostNotifikasi(id, idTeman, newData)
            .then(res => {
                deleteNotifFriendRequest(id)
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
            })
    }

    function postToChatRoomUser(id, data) {
        return new Promise((resolve, reject) => {
            API.APIPostChatRoom(id, data)
                .then(res => {
                    if (res && res.data) {
                        resolve({ message: 'success', data: res.data })
                    }
                })
                .catch(err => reject(err))
        })
    }

    function postToUserTwo(id, userDataTwo) {
        API.APIPostAcceptFriendship(id, userDataTwo)
            .then(res => {
                // push to chat room first here
                const room = new Date().getTime()
                const data = {
                    roomId: `${room}`
                }
                // user 1
                postToChatRoomUser(users.id, { ...data, userId: id })
                    .then(res => {
                        if (res?.message === 'success') {
                            // user 2
                            postToChatRoomUser(id, { ...data, userId: users.id })
                                .then(res => {
                                    if (res?.message === 'success') {
                                        // then push to notification
                                        pushNotification(id, users.id, users)
                                    }
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
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
            })
    }

    function acceptFriendship() {
        const newUserDataOne = {
            id: users.id,
            namaDepan: users.namaDepan,
            namaBelakang: users.namaBelakang,
            email: users.email,
            fotoProfil: users.fotoProfil,
        }
        const newUserDataTwo = {
            id: profileResult?.id,
            namaDepan: profileResult?.namaDepan,
            namaBelakang: profileResult?.namaBelakang,
            email: profileResult?.email,
            fotoProfil: profileResult?.fotoProfil,
        }
        API.APIPostAcceptFriendship(users.id, newUserDataTwo)
            .then(res => {
                postToUserTwo(profileResult?.id, newUserDataOne)
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
            })
    }
    // end terima permintaan teman

    function updateNotifRequest() {
        API.APIGetOneUser(id)
            .then(res => {
                addId(res.data.id)
                addFriend(res.data.notifPermintaanTeman)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function cancelRequest() {
        API.APIDeleteNotifFriendRequest(profileResult.id, users.id)
            .then(res => {
                socket.emit('user-delete-request', profileResult.id)

                setTimeout(() => {
                    updateNotifRequest()
                }, 1000)
            })
            .catch(err => {
                console.log(err)
                errMessageFromServer()
            })
    }

    function addFriends() {
        if (Object.keys(dataPermintaanTeman).length === 0) {
            friendCheckAvailable()
        } else if (friendIsAvailable === 'Accept') {
            acceptFriendship()
        } else if (friendIsAvailable === 'Cancelled') {
            cancelRequest()
        }
    }

    function removeChatAfterDeleteFriend(myId, myFriendId) {
        return new Promise((resolve, reject) => {
            API.APIDeleteChat(myId, myFriendId)
                .then(res => {
                    if (res?.data) return resolve({ data: res.data })
                })
                .catch(err => reject(err))
        })
    }

    function userDeleteFriend(myId, myFriendId) {
        return new Promise((resolve, reject) => {
            API.APIDeleteTeman(myId, myFriendId)
                .then(res => {
                    if (res?.data) return resolve({ data: res.data })
                })
                .catch(err => reject(err))
        })
    }

    function updtMyContactAfterDeletedFrnd() {
        API.APIGetOneUser(id)
            .then(res => {
                if (res?.data) {
                    addTeman(res.data.teman)
                    getContactOn(res.data.teman)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function deleteFriend() {
        if (window.confirm('remove friendship?')) {
            // user1
            userDeleteFriend(id, profileResult?.id)
                .then(res => {
                    if (res?.data) {
                        // user2
                        userDeleteFriend(profileResult?.id, id)
                            .then(res => {
                                if (res?.data) {
                                    // chat of user1
                                    removeChatAfterDeleteFriend(id, profileResult?.id)
                                        .then(res => {
                                            if (res?.data) {
                                                // chat of user2
                                                removeChatAfterDeleteFriend(profileResult?.id, id)
                                                    .then(async res => {
                                                        if (res?.data) {
                                                            const getRoomId = await profileResult.chat.length > 0 ? profileResult.chat.filter(e => e.userId === id) : []

                                                            await socket.emit('user-delete-friend', profileResult?.id, id, getRoomId.length > 0 ? getRoomId[0].roomId : null)

                                                            setTimeout(() => {
                                                                updtMyContactAfterDeletedFrnd()
                                                            }, 1000)
                                                        }
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
    }

    const styleContainer = {
        paddingContainer: '0.5rem 1rem 0 1rem',
        background: '#f0f2f5',
        maxWidthContainer: '1100px'
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

        API.APIPostLikePosts(profileResult?.id, idLocation, data)
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
        API.APIPostComments(profileResult?.id, idLocation, data)
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

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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
                title={`${profileResult && profileResult.email ? profileResult.namaDepan + ' ' + profileResult.namaBelakang + ' ' + '|' : ''} Facebook`}
            />
            <ProfileAttribute
                users={profileResult}
                valueAddFriend={friendIsAvailable}
                clickAddFriend={addFriends}
                iconFriend={iconFriend}
                deleteFriend={deleteFriend}
            />
            <Container
                {...styleContainer}
                children={
                    <>
                        <div className="wrapp-profile-of-ppl">
                            <div className="left-profile-of-ppl">
                                <h1>Friends</h1>
                            </div>
                            <div className="right-profile-of-ppl">
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

export default ProfileOfPeople