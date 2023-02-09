import React, { useState } from 'react'
import CardInfo from '../CardInfo/CardInfo'
import io from 'socket.io-client'
import './NotificationInfo.scss'
import profileDefault from '../../image/profil-default.png'
import API from '../../useFetch'
import { storeUsers } from '../../zustand/users'
import { API_ENDPOINT_LOCAL } from '../../api'
import { storeAuthLogin } from '../../zustand/authLogin'

const socket = io.connect(API_ENDPOINT_LOCAL)

const NotificationInfo = ({ display, data, title, displaySearch, messageNoNotif, setDisplayWrapp, clickCard }) => {
  const [hoverUser, setHoverUser] = useState(null)
  const addContacts = storeUsers((state) => state.addContacts)
  const addFriend = storeUsers((state) => state.addFriend)
  const addNotifikasi = storeUsers((state) => state.addNotifikasi)
  const addTeman = storeUsers((state) => state.addTeman)
  const id = storeAuthLogin((state) => state.id)
  const addId = storeAuthLogin((state) => state.addId)
  const users = storeUsers((state) => state.users)

  const styleCardInfo = {
    heightWrapp: 'auto',
    heightImgInfo: '4rem',
    widthImgInfo: '5.5rem',
    heightImg: '100%',
    widthtImg: '100%',
    fontSizeName: "0.9em",
    fontWeightName: "500",
    displayOnline: "none",
    paddingWrapp: '0.5rem 1rem',
    displayBtnInfo: 'flex'
  }

  function errMessageFromServer(err) {
    console.log(err)
    alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
  }

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
      .catch(err => errMessageFromServer(err))
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
      .catch(err => errMessageFromServer(err))
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
                .catch(err => errMessageFromServer(err))
            }
          })
          .catch(err => errMessageFromServer(err))
      })
      .catch(err => errMessageFromServer(err))
  }

  function acceptFriendship(userDataTwo) {
    const newUserDataOne = {
      id: users.id,
      namaDepan: users.namaDepan,
      namaBelakang: users.namaBelakang,
      email: users.email,
      fotoProfil: users.fotoProfil,
    }
    const newUserDataTwo = {
      id: userDataTwo.id,
      namaDepan: userDataTwo.namaDepan,
      namaBelakang: userDataTwo.namaBelakang,
      email: userDataTwo.email,
      fotoProfil: userDataTwo.fotoProfil,
    }
    API.APIPostAcceptFriendship(users.id, newUserDataTwo)
      .then(res => {
        postToUserTwo(userDataTwo.id, newUserDataOne)
      })
      .catch(err => errMessageFromServer(err))
  }

  function confirmFriend(userDataTwo) {
    setDisplayWrapp(false)
    acceptFriendship(userDataTwo)
  }

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

  function deleteRequest(idTeman) {
    setDisplayWrapp(false)

    API.APIDeleteNotifFriendRequest(users.id, idTeman)
      .then(res => {
        socket.emit('user-delete-request', idTeman)

        setTimeout(() => {
          updateNotifRequest()
        }, 1000)
      })
      .catch(err => errMessageFromServer(err))
  }

  const styleWrapp = {
    display: display
  }

  const styleSearch = {
    display: displaySearch
  }

  return (
    <div className="notification-info" style={styleWrapp} onClick={(e) => e.stopPropagation()}>
      <h1>{title}</h1>
      <div className="search-input" style={styleSearch}>
        <input type="text" className='search input-gb' placeholder='Search Users' />
        <i class="fa-solid fa-magnifying-glass icon-search"></i>
      </div>
      {data && data.length === 0 && (
        <span className='no-notifications'>{messageNoNotif}</span>
      )}
      <ul className="users">
        {data && data.length > 0 && data.map((e, i) => (
          <li className='notif-users' key={i}>
            <CardInfo
              {...styleCardInfo}
              confirm={(ev) => {
                ev.stopPropagation()
                confirmFriend(e)
              }}
              deleteFriend={(ev) => {
                ev.stopPropagation()
                deleteRequest(e.id)
              }}
              img={e.fotoProfil.includes('https') ? e.fotoProfil : profileDefault}
              name={`${e.namaDepan} ${e.namaBelakang}`}
              backgroundWrapp={hoverUser === i ? '#E7F3FF' : 'transparent'}
              displayMessage={e && e.message ? 'flex' : 'none'}
              displayBtnInfo={e && e.message ? 'none' : 'flex'}
              displayCircleNotif={e && e.timeNotifikasi === false ? 'flex' : 'none'}
              message={e && e.message}
              mouveOver={() => setHoverUser(i)}
              mouseLeave={() => setHoverUser(null)}
              click={()=>clickCard(e)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationInfo