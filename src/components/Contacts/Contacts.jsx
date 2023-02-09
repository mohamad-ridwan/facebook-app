import React from 'react'
import CardInfo from '../CardInfo/CardInfo'
import './Contacts.scss'
import profileDefault from '../../image/profil-default.png'
import profileDefaultFemale from '../../image/profil-default-female.png'
import { storeAuthLogin } from '../../zustand/authLogin'

const Contacts = ({ contact, clickContact }) => {
    const id = storeAuthLogin((state)=>state.id)

    const styleCardInfo = {
        widthWrapp: 'auto'
    }

    return (
        <div className="contacts">
            <div className="container-contacts">
                <h4>Contacts</h4>
                <ul>
                    {contact && contact.length > 0 && contact.map((user, i) => {
                        const userId = user.id
                        const getChat = user.chat.length > 0 ? user.chat.filter(e=>e.userId === id): []
                        const unreadMsg = getChat.length > 0 ? getChat.map((e, i)=>e.message) : []
                        const getNotif = unreadMsg.length > 0 ? unreadMsg[0].filter(e=>e?.userId === userId && e?.onRead === false) : []

                        // const getMsg = getChat.length > 0 ? getChat.map((e, i) => e.message) : []
                        // const getMsgNotReadYet = getMsg.length > 0 ? getMsg[0].filter(e=>e?.userId === userId && e?.onRead === false) : []
                        // console.log(getMsgNotReadYet)

                        return (
                            <li key={i}>
                                <CardInfo
                                    {...styleCardInfo}
                                    notifMessage={getNotif}
                                    img={user.fotoProfil.includes('https') ? user.fotoProfil : user.gender === 'male' ? profileDefault : profileDefaultFemale}
                                    displayOnline={user.statusOnline ? 'flex' : 'none'}
                                    name={`${user.namaDepan} ${user.namaBelakang}`}
                                    click={()=>clickContact(user, getChat.length > 0 ? getChat[0].message : [], getChat.length > 0 ? getChat[0].roomId : null)}
                                />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Contacts