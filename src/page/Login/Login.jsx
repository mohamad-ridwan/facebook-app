import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.scss'
import logo from '../../image/dF5SId3UHWd.svg'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Container from '../../components/Container/Container'
import PopupSignUp from '../../components/PopupSignUp/PopupSignUp'
import TitleHelmet from '../../components/TitleHelmet/TitleHelmet'
import { storeAuthLogin } from '../../zustand/authLogin'
import API from '../../useFetch'
import { storeUsers } from '../../zustand/users'

const Login = () => {
    const [login, setLogin] = useState({
        email: '',
        password: ''
    })
    const [failedLogin, setFailedLogin] = useState('')
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [hoverLogin, setHoverLogin] = useState(false)
    const [showSignUp, setShowSignUp] = useState(false)

    const addUser = storeUsers((state) => state.addUser)
    const addContacts = storeUsers((state)=>state.addContacts)
    const addFriend = storeUsers((state)=>state.addFriend)
    const addNotifikasi = storeUsers((state)=>state.addNotifikasi)
    const addTeman = storeUsers((state)=>state.addTeman)
    const userToken = storeAuthLogin((state) => state.token)
    const addToken = storeAuthLogin((state) => state.addToken)
    const addId = storeAuthLogin((state)=>state.addId)

    const navigate = useNavigate()

    function userIsLoggedIn() {
        API.APIGetUserAuthLogin(userToken)
        .then(res=>{
            if(res && res.message === 'login is success'){
                navigate('/')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(() => {
        if (userToken !== null) {
            userIsLoggedIn()
        }
    }, [])

    const styleBtnCreate = {
        maxWidth: '12.5rem',
        margin: '0 auto'
    }

    const styleContainer = {
        flexDirection: "column",
        minHeightWrapp: "100vh",
        background: "#f0f2f5",
        alignItemsContainer: "center",
    }
    const styleInput = {
        paddingInput: '0.9em 1em',
        fontSizeInput: '1.05em'
    }
    const styleBtnLogin = {
        background: hoverLogin ? '#186ddc' : '#1877f2',
        fontSize: '1.3em',
        margin: '0.2em 0 0 0',
        height: '3.1rem',
        borderLoading: '3px solid #1877f2',
        borderTopColorLoading: '#fff',
        mouseOver: () => setHoverLogin(true),
        mouseLeave: () => setHoverLogin(false),
    }

    function handeLogin(e) {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        })
    }

    async function authLogin(token) {
        return await new Promise((resolve, reject) => {
            API.APIGetUserAuthLogin(token)
                .then(res => resolve({ message: 'success', attribute: res }))
                .catch(err => reject({ error: err, message: 'failed login' }))
        })
    }

    function submitLogin(e) {
        e.preventDefault()
        setFailedLogin('')
        setLoadingLogin(true)
        addUser({})
        addFriend([])
        addNotifikasi([])
        addContacts([])
        addTeman([])
        addToken(null)

        API.APIPostUserLogin(login)
            .then(res => {
                if (res && res.error) {
                    setFailedLogin(res.error)
                    setLoadingLogin(false)
                } else if (res && res.token) {
                    authLogin(res.token)
                        .then(result=>{
                            if(result && result.message === 'success'){
                                addToken(res.token)
                                addId(result.attribute.data.id)
                                navigate('/')
                                setLoadingLogin(false)
                            }
                        })
                        .catch(err => {
                            if(err && err.message === 'failed login'){
                                console.log(err)
                                setLoadingLogin(false)
                                alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
                            }
                        })
                }
            })
            .catch(err => {
                console.log(err)
                setLoadingLogin(false)
                alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
            })
    }

    return (
        <Container
            {...styleContainer}
            children={
                <>
                    <TitleHelmet
                        title="Facebook - log in or sign up"
                        link='http://localhost:3000/login'
                    />

                    {/* Pop-Up Sign Up */}
                    <PopupSignUp
                        display={showSignUp ? 'flex' : 'none'}
                        setShowSignUp={() => setShowSignUp(false)}
                    />

                    <img src={logo} alt="facebook" className="logo-login" />

                    <div className="container-form-login">
                        <form onSubmit={submitLogin} className="form-login">
                            <Input
                                {...styleInput}
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={login.email}
                                handleChange={handeLogin}
                            />
                            <Input
                                {...styleInput}
                                alignItemsWrapp="center"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={login.password}
                                handleChange={handeLogin}
                                nameIcon={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}
                                clickIcon={() => setShowPassword(!showPassword)}
                            />
                            <Button
                                {...styleBtnLogin}
                                displayLoading={loadingLogin ? 'flex' : 'none'}
                                value="Log in"
                                clickBtn={submitLogin}
                            />
                            <span className='no-account'>{failedLogin}</span>
                            <hr className='hr-login' />
                        </form>
                        <Button
                            {...styleBtnCreate}
                            value="Create new account"
                            clickBtn={() => {
                                setTimeout(() => {
                                    setShowSignUp(true)
                                }, 500);
                            }}
                        />
                    </div>
                </>
            }
        />
    )
}

export default Login