import React, { useState, useEffect } from 'react'
import './Navbar.scss'
import io from 'socket.io-client'
import { useNavigate, useParams } from 'react-router-dom'
import { storeAuthLogin } from '../../zustand/authLogin'
import { storeUsers } from '../../zustand/users'
import { API_ENDPOINT_LOCAL } from '../../api'
import CardInfo from '../CardInfo/CardInfo'
import fbLogo from '../../image/fb-logo.png'
import profileDefault from '../../image/profil-default.png'
import profileDefaultFemale from '../../image/profil-default-female.png'
import NotificationInfo from '../NotificationInfo/NotificationInfo'
import API from '../../useFetch'

const socket = io.connect(API_ENDPOINT_LOCAL)

const Navbar = () => {
  const [showAddFriends, setShowAddFriends] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [navbarDisplay, setNavbarDisplay] = useState(true)
  const [activeMenu, setActiveMenu] = useState(null)

  const permintaanPertemanan = storeUsers((state) => state.permintaanPertemanan)
  const notifikasi = storeUsers((state) => state.notifikasi)
  const userResult = storeUsers((state) => state.userResult)
  const addFriend = storeUsers((state) => state.addFriend)
  const addNotifikasi = storeUsers((state) => state.addNotifikasi)
  const users = storeUsers((state) => state.users)
  const addContacts = storeUsers((state) => state.addContacts)
  const addTeman = storeUsers((state) => state.addTeman)
  const addToken = storeAuthLogin((state) => state.addToken)
  const addId = storeAuthLogin((state) => state.addId)
  const addUser = storeUsers((state) => state.addUser)
  const addRoomChatPerson = storeUsers((state) => state.addRoomChatPerson)
  const addChatPerson = storeUsers((state) => state.addChatPerson)
  const addChatRoomId = storeUsers((state) => state.addChatRoomId)

  const navigate = useNavigate()
  const params = useParams()
  const pathName = window.location.pathname

  function handleNavbar() {
    if (pathName === '/login') {
      setNavbarDisplay(false)
    } else if (pathName.includes('/create-new-account/registration-verification/')) {
      setNavbarDisplay(false)
    } else {
      setNavbarDisplay(true)
    }
  }

  useEffect(() => {
    setActiveMenu(pathName)
    handleNavbar()
  }, [params])

  function tesLink(path) {
    navigate(path)
  }

  function getUsers(value) {
    API.APIGetAllUser()
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          const userIsActive = res.data.filter(e => e.userVerifikasi === true)

          if (userIsActive.length > 0) {
            const notMySelf = userIsActive.filter((e) => e && e.email !== users.email)

            const getSomePeople = notMySelf.filter((e) =>
              e.namaDepan.toLowerCase().includes(value.toLowerCase()) ||
              e.namaBelakang.toLowerCase().includes(value.toLowerCase())
            )

            setSearchResults(getSomePeople)
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  function searchUsers(e) {
    if (e.target.value.trim()) {
      getUsers(e.target.value)
    }
    if (e.target.value.length === 0) {
      setSearchResults([])
    }
    setSearchValue(e.target.value)
  }

  function pushToMyContactForOffline(data, myId) {
    API.APIGetAllUser()
      .then(res => {
        if (res && res.data) {
          const result = res.data
          if (result.length > 0) {
            for (let i = 0; i < data.length; i++) {
              // kirim notif saat online
              result.filter(e => e.id === data[i].id && e.statusOnline === true ? socket.emit('user-disconnected', { userId: e.id, userIdOffline: myId }) : false)
            }
          }
        }
      })
      .catch(err => {
        console.log(err)
        alert('oops, terjadi kesalahan server\nmohon coba beberapa saat lagi')
      })
  }

  function userLogOut(_id) {
    return new Promise((resolve, reject) => {
      API.APIPutUserLogout(_id)
        .then(res => {
          if (res && res.data) {
            resolve({ data: res.data, message: 'success' })
          } else {
            resolve({ message: 'error' })
          }
        })
        .catch(err => reject(err))
    })
  }

  function removeSearchValue() {
    setSearchValue('')
    setSearchResults([])
  }

  function logOut(_id) {
    removeSearchValue()
    userLogOut(_id)
      .then(res => {
        if (res.message === 'success') {
          if (res.data.teman.length > 0) {
            pushToMyContactForOffline(res.data.teman, res.data.id)
          }
          socket.emit('leaving-room', res.data.id)
          setTimeout(() => {
            addContacts([])
            addToken(null)
            addId(null)
            addUser({})
            addFriend([])
            addNotifikasi([])
            addTeman([])
            addRoomChatPerson({})
            addChatRoomId(null)
            addChatPerson([])
            navigate('/login')

            setTimeout(() => {
              window.localStorage.removeItem('auth-login')

              setTimeout(() => {
                window.location.reload()
              }, 0)
            }, 500)
          }, 0)
        } else {
          console.log(res.message)
        }
      })
      .catch(err => {
        console.log(err)
        alert('oops, terjadi kesalahan server\nmohon coba beberapa saat lagi')
      })
  }

  function toUserProfile(id) {
    setSearchValue('')
    setSearchResults([])
    navigate(`/profile/id/${id}`)
  }

  function toShowAddFriends() {
    setShowAddFriends(!showAddFriends)
    setShowNotification(false)
  }

  function toShowNotification() {
    setShowNotification(!showNotification)
    setShowAddFriends(false)
  }

  return (
    <nav id='navbar' className='navbar' style={{
      display: navbarDisplay ? 'flex' : 'none'
    }}>
      <div className="overlay-search" style={{ display: searchValue.trim() ? 'flex' : 'none' }}>
        <div className="circle-back-search" onClick={removeSearchValue}>
          <i class="fa-solid fa-arrow-left"></i>
        </div>
        <span>Search result</span>
        <ul>
          {searchResults.length > 0 ? searchResults.map((e, i) => (
            <li key={e.id}>
              <CardInfo
                img={e.fotoProfil.includes('https') ? e.fotoProfil : e.gender === 'male' ? profileDefault : profileDefaultFemale}
                name={`${e.namaDepan} ${e.namaBelakang}`}
                displayOnline='none'
                click={() => toUserProfile(e.id)}
              />
            </li>
          )) : (
            <span>User not found</span>
          )}
        </ul>
      </div>
      <div className="menu-left">
        <button className="logo-facebook" onClick={() => tesLink('/')}>
          <img src={fbLogo} alt="facebook" />
        </button>
        <div className="search-input">
          <input type="text" className='search input-gb' value={searchValue} placeholder='Search Facebook' onChange={searchUsers} />
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      <ul className='menu-page'>
        <li onClick={() => tesLink('/')} className={activeMenu === '/' ? 'm-page m-page-active' : 'm-page'}><i class="fa-solid fa-house"></i></li>
        <li className='m-page'><i class="fa-solid fa-users"></i></li>
      </ul>
      <ul className='menu-right'>
        <li className={showAddFriends && 'menu-right-icon-active'} onClick={toShowAddFriends}>
          <i class={showAddFriends ? 'fa-solid fa-user-plus icon-active' : 'fa-solid fa-user-plus'}></i>
          {showAddFriends && (
            <NotificationInfo
              title="Permintaan Pertemanan"
              data={permintaanPertemanan}
              messageNoNotif="Tidak ada permintaan"
              clickCard={(e)=>toUserProfile(e.id)}
              displaySearch={permintaanPertemanan.length > 0 ? 'flex' : 'none'}
              setDisplayWrapp={() => setShowAddFriends(false)}
            />
          )}
          {permintaanPertemanan.length > 0 && (
            <span className='notif-number'>{permintaanPertemanan.length}</span>
          )}
        </li>
        <li className={showNotification && 'menu-right-icon-active'} onClick={toShowNotification}>
          <i class={showNotification ? 'fa-solid fa-bell icon-active' : 'fa-solid fa-bell'}></i>
          {showNotification && (
            <NotificationInfo
              title="Notifikasi"
              data={notifikasi}
              messageNoNotif="Tidak ada pemberitahuan"
              displaySearch="none"
            />
          )}
          {notifikasi.length > 0 && (
            <span className='notif-number'>{notifikasi.length}</span>
          )}
        </li>
        <li onClick={() => tesLink(`/${users.namaDepan}${users.namaBelakang}`)}><img src={users?.fotoProfil && users.fotoProfil.includes('https') ? users.fotoProfil : users?.gender === 'male' ? profileDefault : profileDefaultFemale} alt={`profile ${users.namaDepan} ${users.namaBelakang}`} /></li>
        <li onClick={() => logOut(users._id)}><i class="fa-solid fa-right-from-bracket"></i></li>
      </ul>
    </nav>
  )
}

export default Navbar