import React from 'react'
import { storeUsers } from '../../zustand/users'
import CardInfo from '../CardInfo/CardInfo'
import './GroupContact.scss'
import profileDefault from '../../image/profil-default.png'
import profileDefaultFemale from '../../image/profil-default-female.png'
import { useNavigate } from 'react-router-dom'

const GroupContact = () => {
  const users = storeUsers((state) => state.users)
  const navigate = useNavigate()

  const styleCardInfo = {
    displayOnline: 'none',
    widthWrapp: 'auto'
  }

  function toMyProfile(){
    navigate(`/${users && users.namaDepan}${users.namaBelakang}`)
  }

  return (
    <div className="wrapp-group-contact">
      <div className="group-contact">
        {Object.keys(users).length > 0 && (
          <CardInfo
          {...styleCardInfo}
          click={toMyProfile}
          img={users.fotoProfil.includes('https') ? users.fotoProfil : users.gender === 'male' ? profileDefault : profileDefaultFemale}
          name={`${users.namaDepan} ${users.namaBelakang}`}
        />
        )}
      </div>
    </div>
  )
}

export default GroupContact