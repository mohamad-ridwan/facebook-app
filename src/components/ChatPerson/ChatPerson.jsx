import React, { useState } from 'react'
import './ChatPerson.scss'
import profileDefault from '../../image/profil-default.png'
import profileDefaultFemale from '../../image/profil-default-female.png'
import { storeUsers } from '../../zustand/users'
import { storeAuthLogin } from '../../zustand/authLogin'
import { useNavigate } from 'react-router-dom'

const ChatPerson = ({ displayWrapp, closeChat, sendMessage, messageInput, value }) => {
    const [bottomScroll, setBottomScroll] = useState(false)
    const id = storeAuthLogin((state) => state.id)
    const roomChatPerson = storeUsers((state) => state.roomChatPerson)
    const chatPerson = storeUsers((state) => state.chatPerson)

    const navigate = useNavigate()

    const styleWrapp = {
        display: displayWrapp
    }
    function toProfile() {
        navigate(`/profile/id/${roomChatPerson?.id}`)
    }

    function onScrollChat() {
        const el = document.getElementById('bodyChatRoom').getBoundingClientRect()
        const sumbuY = Math.floor(el.y)
        const height = Math.floor(el.height)
        const bottom = Math.floor(el.bottom)
        const point = height - 480 + 100
        if (height > 450 && bottom > height + 200) {
            return setBottomScroll(true)
        }
        setBottomScroll(false)
    }

    function scrollToBottomChat() {
        document.getElementById('bodyChatRoom').scrollIntoView(false)
    }

    return (
        <div className="chat-person" style={styleWrapp}>
            {Object.keys(roomChatPerson).length > 0 && (
                <>
                    <div className="chat-bar">
                        <div className="person" onClick={toProfile}>
                            <img src={roomChatPerson.fotoProfil.includes('https') ? roomChatPerson.fotoProfil : roomChatPerson.gender === 'male' ? profileDefault : profileDefaultFemale} alt="user" />
                            <span>{roomChatPerson.namaDepan} {roomChatPerson.namaBelakang}</span>
                        </div>
                        <button onClick={closeChat}>
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="chat-body" id='wrappChatRoom' onScroll={onScrollChat}>
                        <ul className="body" id='bodyChatRoom'>
                            {chatPerson.map((msg, i) => (
                                <li key={i} className='comment-person' style={{
                                    justifyContent: msg.userId === id ? 'flex-end' : 'flex-start'
                                }}>
                                    <p className={msg?.info === 'user-unfriends' ? 'msg-user-unfriends' : ''} style={{
                                        backgroundColor: msg.userId === id ? msg?.info === 'user-unfriends' ? '#FA383E' : '#0084ff' : msg?.info === 'user-unfriends' ? '#FA383E' : '#e4e6eb',
                                        color: msg.userId === id ? '#fff' : msg?.info === 'user-unfriends' ? '#fff' : '#1c1e21'
                                    }}>
                                        {msg.message}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <button className='to-bottom' style={{
                            bottom: bottomScroll ? '5.5rem' : '0'
                        }}
                            onClick={scrollToBottomChat}
                        >
                            <i class="fa-solid fa-arrow-down"></i>
                        </button>
                    </div>
                    <div className="type-chat">
                        <input type="text" placeholder='Type something' onChange={messageInput} value={value} />

                        <button onClick={sendMessage}>
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default ChatPerson