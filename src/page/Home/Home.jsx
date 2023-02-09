import React, { useEffect, useState } from 'react'
import './Home.scss'
import io from 'socket.io-client'
import './Home.scss'
import { storeUsers } from '../../zustand/users'
import { storeAuthLogin } from '../../zustand/authLogin'
import { API_ENDPOINT_LOCAL } from '../../api'
import Contacts from '../../components/Contacts/Contacts'
import PublicPosts from '../../components/PublicPosts/PublicPosts'
import GroupContact from '../../components/GroupContact/GroupContact'
import TitleHelmet from '../../components/TitleHelmet/TitleHelmet'
import ChatPerson from '../../components/ChatPerson/ChatPerson'
import API from '../../useFetch'
import { useParams } from 'react-router-dom'
import { storeRoomChat } from '../../zustand/roomChat'

const socket = io.connect(API_ENDPOINT_LOCAL)

const Home = () => {
  const [msg, setMsg] = useState({
    userId: null,
    message: '',
    onRead: false
  })
  const [onChatPerson, setOnChatPerson] = useState(false)

  const id = storeAuthLogin((state) => state.id)
  const contacts = storeUsers((state) => state.contacts)
  const roomChatPerson = storeUsers((state) => state.roomChatPerson)
  const chatPerson = storeUsers((state) => state.chatPerson)
  const addRoomChatPerson = storeUsers((state) => state.addRoomChatPerson)
  const addChatPerson = storeUsers((state) => state.addChatPerson)
  const addContacts = storeUsers((state) => state.addContacts)
  const chatRoomId = storeUsers((state) => state.chatRoomId)
  const addChatRoomId = storeUsers((state) => state.addChatRoomId)
  const users = storeUsers((state) => state.users)
  const someoneDeletedFriend = storeRoomChat((state)=>state.someoneDeletedFriend)
  const addSomeoneDeletedFriend = storeRoomChat((state)=>state.addSomeoneDeletedFriend)

  const params = useParams()

  const styleChatPerson = {
    displayWrapp: onChatPerson ? 'flex' : 'none'
  }

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

              setTimeout(() => {
                addContacts(newData)
              }, 10);
            }
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  function getNewContact() {
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

  function scrollToBottomChat() {
    const bodyChat = document.getElementById('bodyChatRoom').getBoundingClientRect()
    if (Math.floor(bodyChat?.height) > 325) {
      document.getElementById('bodyChatRoom').scrollIntoView(false)
    }
  }

  useEffect(() => {
    socket.on('message-person', (res) => {
      if (res.roomId === roomChatPerson?.roomId) {
        addChatPerson([...chatPerson, res.data])
        setTimeout(() => {
          scrollToBottomChat()
        }, 0)
      }
    })
  }, [socket, chatPerson])

  async function updtChatNotActive(){
    const username = `${roomChatPerson?.namaDepan} ${roomChatPerson?.namaBelakang}`

    const newData = {
      userId: roomChatPerson?.id,
      username: username,
      message: `${username.length > 23 ? username.slice(0, 24) + '..' : username} deleted friends`,
      info: 'user-unfriends'
    }
    await addSomeoneDeletedFriend({})

    setTimeout(() => {
      addChatPerson([...chatPerson, newData])
      scrollToBottomChat()
    }, 100)
  }

  useEffect(()=>{
    if(someoneDeletedFriend?.condition === true && someoneDeletedFriend?.roomId === roomChatPerson?.roomId){
      updtChatNotActive()
    }
  }, [someoneDeletedFriend])

  useEffect(() => {
    return () => {
      addSomeoneDeletedFriend({})
      socket.on('friend-left-room-chat', roomChatPerson?.roomId)
    }
  }, [params, roomChatPerson])

  function sendMessageToFriend(msg) {
    API.APIPostMessage(roomChatPerson?._id, chatRoomId, msg)
      .then(res => {
        if (res && res.data) {
          const dataMsg = {
            roomId: chatRoomId,
            data: {
              userId: msg.userId,
              message: msg.message,
              onRead: msg.onRead
            }
          }
          socket.emit('send-message-person', dataMsg)

          setTimeout(() => {
            socket.emit('send-notif-from-msg-person', roomChatPerson?.id)

            setTimeout(() => {
              addChatPerson([...chatPerson, dataMsg.data])
              getNewContact()
              setTimeout(() => {
                scrollToBottomChat()
              }, 0)
            }, 0);
          }, 200)
        }
      })
      .catch(err => {
        console.log(err)
        alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
      })
  }

  function sendMessage(msg) {
    const checkMyContact = contacts.length > 0 ? contacts.filter(e=>e.id === roomChatPerson?.id) : []

    if (checkMyContact.length !== 0 && msg.message.trim()) {
      const msgToFriend = {
        userId: users.id,
        message: msg.message,
        onRead: false
      }

      API.APIPostMessage(users._id, chatRoomId, msg)
        .then(res => {
          if (res && res.data) {
            sendMessageToFriend(msgToFriend)

            setMsg({
              userId: null,
              message: '',
              onRead: false
            })
          }
        })
        .catch(err => {
          console.log(err)
          alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
        })
    }
  }

  function userJoinedChatRoom(roomId) {
    socket.emit('friend-join-room-chat', roomId)
  }

  async function cleaningFirst(roomId) {
    return await new Promise((resolve) => {
      socket.emit('friend-left-room-chat', roomId)
      addRoomChatPerson({})
      addChatPerson([])
      addChatRoomId(null)
      resolve('success')
    })
  }

  function clickContact(user, chat, roomId) {
    setMsg({ ...msg, message: '' })
    addSomeoneDeletedFriend({})

    cleaningFirst(chatRoomId)
      .then(res => {
        addRoomChatPerson({ ...user, roomId: roomId })
        addChatPerson(chat)
        setOnChatPerson(true)
        setTimeout(() => {
          scrollToBottomChat()
        }, 0);

        if (roomId !== null) {
          userJoinedChatRoom(roomId)
          addChatRoomId(roomId)
        }
      })
  }

  function userLeftChatRoom(roomId) {
    addChatRoomId(null)
    socket.emit('friend-left-room-chat', roomId)
  }

  function closeChat() {
    setOnChatPerson(false)
    addRoomChatPerson({})
    addSomeoneDeletedFriend({})
    addChatPerson([])

    if (chatRoomId !== null) {
      userLeftChatRoom(chatRoomId)
    }
  }

  function messageInput(e) {
    setMsg({
      userId: id,
      message: e.target.value,
      onRead: false
    })
  }

  return (
    <div className="wrapp-home">
      <TitleHelmet
        title="Facebook"
        link="http://localhost:3000"
      />
      <div className="home">
        <ChatPerson
          {...styleChatPerson}
          value={msg.message}
          messageInput={messageInput}
          closeChat={closeChat}
          sendMessage={() => sendMessage(msg)}
        />
        <GroupContact />
        <PublicPosts />
        <Contacts
          contact={contacts}
          clickContact={(user, chat, roomId) => clickContact(user, chat, roomId)}
        />
      </div>
    </div>
  )
}

export default Home