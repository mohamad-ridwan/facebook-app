import React from 'react'
import Button from '../Button/Button'
import profileDefault from '../../image/profil-default.png'
import profileDefaultFemale from '../../image/profil-default-female.png'
import './ProfileAttribute.scss'
import { useParams } from 'react-router-dom'
import { storeUsers } from '../../zustand/users'

const ProfileAttribute = ({ users, clickAddFriend, valueAddFriend, iconFriend, deleteFriend, clickEditPf}) => {
    const params = useParams()
    const teman = storeUsers((state) => state.teman)

    const styleBtnAddFriend = {
        maxWidth: '8rem',
        fontSize: "0.8em",
        height: '2.5rem'
    }

    const styleBtn = {
        maxWidth: '7rem',
        fontSize: "0.8em",
        height: '2.5rem'
    }

    const checkFriend = teman.length > 0 ? teman.filter(e=>e.id === users?.id) : []

    return (
        <div className="wrapp-profile-attribute">
            <div className="profile-attribute">
                {users && Object.keys(users).length > 0 && (
                    <>
                        <div className="foto-dinding">
                            <img src={users.fotoDinding} alt={`foto cover profile ${users.namaDepan} ${users.namaBelakang}`} style={{ display: users && users.fotoDinding.includes('https') ? 'flex' : 'none' }} />
                        </div>
                        <div className="attribute-bottom">
                            <div className="left-info">
                                <img src={users.fotoProfil.includes('https') ? users.fotoProfil : users.gender === 'male' ? profileDefault : profileDefaultFemale} alt={`foto profile kasian user gabisa cek lagi`} />
                                <div className="info">
                                    <h1 className="name">
                                        {`${users.namaDepan} ${users.namaBelakang}`}
                                    </h1>
                                    {params?.profileUser && (
                                        <span>{teman.length === 0 ? 'No' : teman.length} friends</span>
                                    )}
                                    {params?.id && (
                                        <span>{users && users.teman.length === 0 ? 'No' : users.teman.length} friends</span>
                                    )}
                                </div>
                            </div>
                            <div className="right-info">
                                {params && params.id && (
                                    <Button
                                        {...styleBtnAddFriend}
                                        value={valueAddFriend}
                                        classBtn={checkFriend.length === 0 ? valueAddFriend === 'Cancelled' ? 'cancel-friends' : 'btn-add-friends' : 'btn-already-friends'}
                                        icon={iconFriend}
                                        displayIcon='flex'
                                        clickBtn={clickAddFriend}
                                    />
                                )}
                                {params?.id && checkFriend.length !== 0 && (
                                    <Button
                                    {...styleBtn}
                                    margin='0 0 0 0.6rem'
                                    value='Delete'
                                    classBtn="btn-delete-friends"
                                    icon="fa-solid fa-user-minus"
                                    displayIcon="flex"
                                    clickBtn={deleteFriend}
                                />
                                )}
                                {params?.profileUser && (
                                    <Button
                                    {...styleBtn}
                                    margin='0 0 0 0.6rem'
                                    value='Edit Profile'
                                    classBtn="edit-myprofile"
                                    clickBtn={clickEditPf}
                                    icon="fa-solid fa-pencil"
                                    displayIcon="flex"
                                />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProfileAttribute