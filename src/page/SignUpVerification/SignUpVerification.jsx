import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Container from '../../components/Container/Container'
import './SignUpVerification.scss'
import logo from '../../image/dF5SId3UHWd.svg'
import profilDefault from '../../image/profil-default.png'
import TitleHelmet from '../../components/TitleHelmet/TitleHelmet'
import Button from '../../components/Button/Button'
import API from '../../useFetch'

const SignUpVerification = () => {
  const [userData, setUserData] = useState({})
  const [successVerification, setSuccessVerification] = useState(false)
  const [hoverLogin, setHoverLogin] = useState(false)

  const params = useParams()
  const navigate = useNavigate()

  const styleContainer = {
    flexDirection: "column",
    minHeightWrapp: "100vh",
    background: "#f0f2f5",
    alignItemsContainer: "center",
  }

  function updateToSuccessVerification(_id) {
    API.APIPutUserActivated(_id)
      .then(res => {
        if(res && res.data){
          setSuccessVerification(true)
        }else{
          console.log(res)
          alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi untuk verifikasi')
          navigate('/login')
        }
      })
      .catch(err => {
        console.log(err)
        alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi untuk verifikasi')
        navigate('/login')
      })
  }

  function checkExpiredToken(data) {
    const token = data.authTokenRegister.token
    const expiredToken = new Date(`${data.authTokenRegister.expired}`) < new Date()
    setUserData({
      userName: `${data.namaDepan} ${data.namaBelakang}`,
      fotoProfil: data.fotoProfil
    })

    if (token.length > 0 && expiredToken) {
      alert('Token Anda telah expired\nSilahkan registrasi kembali')
      navigate('/login')
    } else if (token.length === 0) {
      alert('failed token!')
      navigate('/login')
    } else {
      updateToSuccessVerification(data._id)
    }
  }

  async function getOneUser() {
    API.APIGetAllUser()
      .then(res => {
        const result = res.data

        if (result.length > 0) {
          const users = result.filter(e => e.authTokenRegister.token === params.token)
          if (users.length === 1) {
            checkExpiredToken(users[0])
          } else {
            alert('failed token!')
            navigate('/login')
          }
        } else {
          checkExpiredToken(result[0])
        }
      })
      .catch(err => {
        console.log(err)
        alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi untuk verifikasi')
        navigate('/login')
      })
  }

  useEffect(() => {
    getOneUser()
  }, [])

  const styleBtnLogin = {
    background: hoverLogin ? '#186ddc' : '#1877f2',
    fontSize: '1.3em',
    width: 'auto',
    margin: '1rem 1rem 0 1rem',
    height: '3.1rem',
    borderLoading: '3px solid #1877f2',
    borderTopColorLoading: '#fff',
    value: "Back to Login",
    zIndexBtn: '2',
    clickBtn: () => navigate('/login'),
    mouseOver: () => setHoverLogin(true),
    mouseLeave: () => setHoverLogin(false),
  }

  return (
    <Container
      {...styleContainer}
      children={
        <>
          <TitleHelmet
            title="Facebook - registration verification"
            link='http://localhost:3000/login'
          />

          <img src={logo} alt="" className="logo-verification" />

          <div className="sign-up-verification">
            <div className="main-loading" style={{
              opacity: userData && userData.userName ? '0' : '1'
            }}>
              <div className="circle-main-loading"></div>
            </div>
            <span className='username-verification-signup'>{userData && userData.userName ? userData.userName : 'Nama tidak dikenal'}</span>
            <img src={userData && userData.fotoProfil ? userData.fotoProfil : profilDefault} alt="" className="profil-default" />
            <span className='proses-verifikasi'>Proses verifikasi</span>
            <div className="loading-process">
              <div className="ld-process-verification" style={{ opacity: successVerification ? '0' : '1' }}></div>
              <i class="fa-solid fa-circle-check" style={{ opacity: successVerification ? '1' : '0' }}></i>
            </div>
            <span>{successVerification ? 'Verifikasi Berhasil' : 'Mohon Tunggu Sebentar'}</span>
            {successVerification && (
              <Button
                {...styleBtnLogin}
              />
            )}
          </div>
        </>
      } />
  )
}

export default SignUpVerification