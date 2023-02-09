import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Navigate, Outlet } from 'react-router-dom'
import { storeAuthLogin } from '../../zustand/authLogin'
import { API_ENDPOINT_LOCAL } from '../../api'
import { storeUsers } from '../../zustand/users'
import API from '../../useFetch'
import { storeRoomChat } from '../../zustand/roomChat'

const socket = io.connect(API_ENDPOINT_LOCAL)

const IsLogin = () => {
    const [redirect, setRedirect] = useState(true)
    const token = storeAuthLogin((state) => state.token)
    const addId = storeAuthLogin((state) => state.addId)
    const id = storeAuthLogin((state) => state.id)
    const addFriend = storeUsers((state) => state.addFriend)
    const addNotifikasi = storeUsers((state) => state.addNotifikasi)
    const addUser = storeUsers((state) => state.addUser)
    const addTeman = storeUsers((state) => state.addTeman)
    const addContacts = storeUsers((state) => state.addContacts)
    const addSomeoneDeletedFriend = storeRoomChat((state)=>state.addSomeoneDeletedFriend)

    function contactOn(data) {
        API.APIGetAllUser()
            .then(res => {
                if (res && res.data) {
                    const result = res.data
                    if (result.length > 0) {
                        let newData = []
                        for (let i = 0; i < data.length; i++) {
                            setTimeout(() => {
                                result.filter(e => e.id === data[i].id ? newData.push(e) : null)
                            }, 0)
                        }
                        setTimeout(() => {
                            addContacts(newData)
                        }, 10);
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function getMyContactAndPushOnlineToFriend(data) {
        API.APIGetAllUser()
            .then(res => {
                if (res && res.data) {
                    const result = res.data
                    if (result.length > 0) {
                        let newData = []
                        for (let i = 0; i < data.length; i++) {
                            setTimeout(() => {
                                result.filter(e => e.id === data[i].id ? newData.push(e) : null)

                                result.filter(e => e.id === data[i].id && e.statusOnline === true ? socket.emit('user-login', e.id) : false)
                            }, 0)
                        }
                        setTimeout(() => {
                            addContacts(newData)
                        }, 10)
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function getNewContact(id) {
        API.APIGetOneUser(id)
            .then(res => {
                if (res && res.data) {
                    contactOn(res.data.teman)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function updateNotifikasi(id, typeNotification) {
        API.APIGetOneUser(id)
            .then(res => {
                if (typeNotification === 'permintaan') {
                    addFriend(res.data.notifPermintaanTeman)
                    addTeman(res.data.teman)
                }
                if (typeNotification === 'notifikasi') {
                    addNotifikasi(res.data.notifikasi)
                    addTeman(res.data.teman)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function someoneDeletedFriend(id, userSend, roomId){
        API.APIGetOneUser(id)
            .then(res => {
                if (res?.data) {
                    addTeman(res.data.teman)
                    contactOn(res.data.teman)
                    addSomeoneDeletedFriend({
                        userId: id,
                        condition: true,
                        userSend: userSend,
                        roomId: roomId
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        // jika user mengirim permintaan pertemanan
        socket.on('success-add-friends', (res) => {
            if (res.userId === id) {
                updateNotifikasi(id, 'permintaan')
            }
        })
        // jika user menerima permintaan pertemanan
        socket.on('push-notification-success', (res) => {
            if (res.userId === id) {
                updateNotifikasi(id, 'notifikasi')
                getNewContact(id)
            }
        })
        // jika seseorang mengirim pesan personal
        socket.on('new-notif-from-msg-person', (res) => {
            if (res.userId === id) {
                getNewContact(res.userId)
            }
        })
        // jika user menolak/hapus permintaan pertemanan
        socket.on('someone-deleted-request', (res) => {
            if (res.userId === id) {
                updateNotifikasi(id, 'permintaan')
            }
        })
        // menerima pemberitahuan teman yang login
        socket.on('user-is-logged-in', (res) => {
            if (res.userId === id) {
                getNewContact(res.userId)
            }
        })
        // seseorang menghapus pertemanan
        socket.on('someone-delete-friend', (res)=>{
            if(res.userId === id){
                someoneDeletedFriend(res.userId, res.userSend, res.roomId)
            }
        })
        // seseorang telah offline
        socket.on('user-is-offline', (res) => {
            if (res.userId === id) {
                getNewContact(res.userId)
            }
            // seseorang meninggalkan roomnya
            socket.emit('leaving-room', res.userIdOffline)
        })
    }, [socket])

    function userIsLoggedIn() {
        API.APIGetUserAuthLogin(token)
            .then(res => {
                if (res && res.message === 'login is success') {
                    const result = res.data
                    const newUser = {
                        _id: result._id,
                        id: result.id,
                        namaDepan: result.namaDepan,
                        namaBelakang: result.namaBelakang,
                        email: result.email,
                        tglLahir: result.tglLahir,
                        gender: result.gender,
                        fotoProfil: result.fotoProfil,
                        fotoDinding: result.fotoDinding,
                        statusOnline: result.statusOnline,
                        userVerifikasi: result.userVerifikasi
                    }
                    setTimeout(() => {
                        addUser(newUser)
                    }, 0)
                    addFriend(result.notifPermintaanTeman)
                    addNotifikasi(result.notifikasi)
                    addId(result.id)
                    addTeman(result.teman)
                    // send online notification to friends
                    getMyContactAndPushOnlineToFriend(result.teman)

                    socket.emit('user-connected', result.id)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (!token) {
            setRedirect(false)
        } else {
            userIsLoggedIn()
        }
    }, [])

    return redirect ? <Outlet /> : <Navigate to="/login" />
}

export default IsLogin