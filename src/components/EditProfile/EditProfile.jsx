import React, { useState } from 'react'
import './EditProfile.scss'
import { ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import HeadEditPf from './HeadEditPf/HeadEditPf'
import SectionEditPf from './SectionEditPf/SectionEditPf'
import profileDefault from '../../image/profil-default.png'
import profileDefaultFemale from '../../image/profil-default-female.png'
import NameInfo from './NameInfo/NameInfo'
import EditPersonalInfo from './EditPersonalInfo/EditPersonalInfo'
import { storage } from '../../firebase'
import API from '../../useFetch'

const EditProfile = ({ close, displayWrapp, users }) => {
    const [picture, setPicture] = useState({})
    const [newPicture, setNewPicture] = useState(null)
    const [cover, setCover] = useState({})
    const [newCover, setNewCover] = useState(null)
    const [showEditPersonal, setShowEditPersonal] = useState(false)

    const styleWrapp = {
        display: displayWrapp
    }

    function errMessageFromServer(err) {
        console.log(err)
        alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
    }

    function openFile(id) {
        const fileInput = document.getElementById(id)

        if (fileInput) {
            return fileInput.click()
        }
    }

    function changeFile(event, nameType) {
        const url = window.URL.createObjectURL(event.target.files[0])

        if(nameType === 'fotoProfil'){
            setTimeout(() => {
                setPicture(url)
                setNewPicture(event.target.files[0])
            }, 100)
        }
        if(nameType === 'fotoDinding'){
            setTimeout(() => {
                setCover(url)
                setNewCover(event.target.files[0])
            }, 100)
        }
    }

    async function uploadPicToFirebaseStorage(){
        return await new Promise((resolve, reject)=>{
            const imageRef = ref(storage, `profile/pictures/${newPicture.name + v4()}`)
            uploadBytes(imageRef, newPicture).then((res)=>{
                const nameImg = res && res.metadata.name

                getAccessTokenImgUpload(nameImg, 'pictures')
                .then(res=>resolve({tokensImg: res, nameImg: nameImg}))
                .catch(err=>reject(err))
            })
        })
    }

    const apiFirebaseStorageProfile = 'https://firebasestorage.googleapis.com/v0/b/facebook-rp.appspot.com/o/profile'
    const twoF = '%2F'

    async function getAccessTokenImgUpload(nameImg, path) {
        return await new Promise((resolve, reject) => {
            fetch(`${apiFirebaseStorageProfile}${twoF}${path}${twoF}${nameImg}`, {
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
    
    function updateProfilePicture(data){
        API.APIPutProfilePicture(users?._id, data)
        .then(res=>{
            alert('successfully updated profile picture')
            window.location.reload()
        })
        .catch(err=> errMessageFromServer(err))
    }

    function savePicture(){
        uploadPicToFirebaseStorage()
        .then(res=>{
            if(res?.tokensImg){
                const tokenImg = res.tokensImg
                const nameImg = res.nameImg

                const data = {
                    fotoProfil: `${apiFirebaseStorageProfile}${twoF}pictures${twoF}${nameImg}?alt=media&token=${tokenImg}`
                }

                updateProfilePicture(data)
            }
        })
        .catch(err=>{
            if(err?.error){
                errMessageFromServer(err)
            }
        })
    }

    function cancelChangePicture(){
        setPicture({})
    }

    async function uploadCoverToFirebaseStorage(){
        return await new Promise((resolve, reject)=>{
            const imageRef = ref(storage, `profile/cover/${newCover.name + v4()}`)
            uploadBytes(imageRef, newCover).then((res)=>{
                const nameImg = res && res.metadata.name

                getAccessTokenImgUpload(nameImg, 'cover')
                .then(res=>resolve({tokensImg: res, nameImg: nameImg}))
                .catch(err=>reject(err))
            })
        })
    }

    function updateProfileCover(data){
        API.APIPutProfileCover(users?._id, data)
        .then(res=>{
            alert('successfully updated profile cover')
            window.location.reload()
        })
        .catch(err=> errMessageFromServer(err))
    }

    function saveCover(){
        uploadCoverToFirebaseStorage()
        .then(res=>{
            if(res?.tokensImg){
                const tokenImg = res.tokensImg
                const nameImg = res.nameImg

                const data = {
                    fotoDinding: `${apiFirebaseStorageProfile}${twoF}cover${twoF}${nameImg}?alt=media&token=${tokenImg}`
                }

                updateProfileCover(data)
            }
        })
        .catch(err=>{
            if(err?.error){
                errMessageFromServer(err)
            }
        })
    }

    function cancelChangeCover(){
        setCover({})
    }

    function openEditPersonalInfo(){
        setShowEditPersonal(true)
    }

    return (
        <>
            <EditPersonalInfo
            display={showEditPersonal ? 'flex' : 'none'}
            setShowEditPersonal={()=>setShowEditPersonal(false)}
            users={users}
            />

            <div className="edit-profile" style={styleWrapp} onClick={() => {
                setPicture({})
                setCover({})
                close()
            }}>
                <div className="container-white-edit-pf">
                    {users && Object.keys(users).length > 0 ? (
                        <div className="white-edit-pf" onClick={(e) => {
                            e.stopPropagation()
                        }}>
                            <HeadEditPf
                                header="Edit Profile"
                                close={() => {
                                    setPicture({})
                                    setCover({})
                                    close()
                                }}
                            />
                            {/* profile picture */}
                            <SectionEditPf
                                title="Edit picture"
                                nameBtn="Edit"
                                idInputImg="fotoProfil"
                                clickEdit={()=>openFile('fotoProfil')}
                                changeFile={(e)=>changeFile(e, 'fotoProfil')}
                            />
                            <img className='profile-picture' src={Object.keys(picture).length > 0 ? picture : users.fotoProfil.includes('https') ? users.fotoProfil : users.gender === 'male' ? profileDefault : profileDefaultFemale} alt="" id='imgProfile' />
                            {Object.keys(picture).length > 0 && (
                                <div className="choose-changes-profile">
                                <button className="btn-changes"
                                onClick={savePicture}
                                >
                                    Save
                                </button>
                                <button className="btn-changes cancel-changes"
                                onClick={cancelChangePicture}
                                >
                                    Cancel
                                </button>
                            </div>
                            )}
                            {/* end profile picture */}

                            {/* Cover Photo */}
                            <SectionEditPf
                                title="Cover Photo"
                                nameBtn="Edit"
                                idInputImg="fotoDinding"
                                clickEdit={()=>openFile('fotoDinding')}
                                changeFile={(e)=>changeFile(e, 'fotoDinding')}
                            />
                            <div className="bg-cover-photo">
                                {Object.keys(cover).length > 0 ? (
                                    <img className='cover-photo' src={cover} alt="" />
                                ):(
                                    <>
                                        {users.fotoDinding.includes('https') && (
                                            <img className='cover-photo' src={users.fotoDinding} alt="" />
                                        )}
                                    </>
                                )}
                            </div>

                            {Object.keys(cover).length > 0 && (
                                <div className="choose-changes-profile">
                                <button className="btn-changes"
                                onClick={saveCover}
                                >
                                    Save
                                </button>
                                <button className="btn-changes cancel-changes"
                                onClick={cancelChangeCover}
                                >
                                    Cancel
                                </button>
                            </div>
                            )}
                            {/* end Cover Photo */}

                            {/* personal info */}
                            <SectionEditPf
                                title="Personal Information"
                                nameBtn="Edit"
                                clickEdit={openEditPersonalInfo}
                            />
                            <div className="personal-information">
                                <NameInfo
                                    icon="fa-solid fa-user"
                                    title={users.namaDepan + ' ' + users.namaBelakang}
                                />
                                <NameInfo
                                    icon="fa-solid fa-envelope"
                                    title={users.email}
                                />
                                <NameInfo
                                    icon="fa-solid fa-calendar-days"
                                    title={users.tglLahir}
                                />
                                <NameInfo
                                    icon="fa-solid fa-venus-mars"
                                    title={users.gender}
                                />
                            </div>
                            {/* end personal info */}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    )
}

export default EditProfile