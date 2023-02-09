import React, { useState, useEffect } from 'react'
import { send } from 'emailjs-com'
import Button from '../Button/Button'
import Input from '../Input/Input'
import InputSelect from '../InputSelect/InputSelect'
import './PopupSignUp.scss'
import API from '../../useFetch'

const PopupSignUp = ({ display, setShowSignUp }) => {
    const [year, setYear] = useState([])
    const [date, setDate] = useState([])
    const [signUp, setSignUp] = useState({
        namaDepan: '',
        namaBelakang: '',
        email: '',
        tanggal: '',
        bulan: '',
        tahun: '',
        gender: '',
        password: ''
    })
    const [err, setErr] = useState({
        namaDepan: true,
        namaBelakang: true,
        email: true,
        password: true,
        tanggal: true,
        bulan: true,
        tahun: true
    })
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    let countDate = 1
    const newDate = []

    function putDate(total) {
        for (countDate; countDate <= total; countDate++) {
            newDate.push(`${countDate}`)
        }
        setDate(newDate)
    }

    let mainYears = 1904
    const years = new Date().getFullYear()
    const arrYears = []

    function putYears(year) {
        for (mainYears; mainYears < year; mainYears++) {
            arrYears.push(`${mainYears + 1}`)
        }
        setYear(arrYears)
    }

    useEffect(() => {
        putDate(31)
        putYears(years)
        handleGender('female')
    }, [])

    function handleChangeSignUp(e) {
        setSignUp({
            ...signUp,
            [e.target.name]: e.target.value
        })

        if (err && Object.keys(err).length > 0) {
            setErr({
                ...err,
                [e.target.name]: false
            })
        }
    }

    function handleGender(id) {
        const newId = ['female', 'male', 'privacy']
        document.getElementById(id).checked = true

        const getId = newId.filter(e => e !== id)

        getId.forEach(e => {
            document.getElementById(e).checked = false
        })

        setSignUp({
            ...signUp,
            gender: id
        })
    }

    function handleChangeDateOfBirth(e) {
        setSignUp({
            ...signUp,
            [e.target.id]: e.target.value
        })

        if (err && Object.keys(err).length > 0) {
            setErr({
                ...err,
                [e.target.id]: false
            })
        }
    }

    const serviceID = process.env.REACT_APP_SERVICE_ID_EMAIL
    const templateID = process.env.REACT_APP_TEMPLATE_ID_EMAIL
    const publicKey = process.env.REACT_APP_PUBLIC_KEY_EMAIL

    async function sendTokenToEmail(generateToken) {
        const emailData = {
            to_name: `${signUp.namaDepan} ${signUp.namaBelakang}`,
            to_email: signUp.email,
            token_verification: generateToken,
        }

        return new Promise((resolve, reject) => {
            send(serviceID, templateID, emailData, publicKey)
                .then(res => {
                    resolve({ attribute: res, message: 'success_send_token_verification', popup: 'please check your email for verification' })
                })
                .catch(err => reject(err))
        })
    }

    function formCleaning() {
        document.getElementById('tanggal').value = '1'
        document.getElementById('bulan').value = 'Jan'
        document.getElementById('tahun').value = '1905'
        handleGender('female')
        setErr({
            namaDepan: true,
            namaBelakang: true,
            email: true,
            password: true,
            tanggal: true,
            bulan: true,
            tahun: true
        })
        setSignUp({
            namaDepan: '',
            namaBelakang: '',
            email: '',
            tanggal: '',
            bulan: '',
            tahun: '',
            gender: 'female',
            password: ''
        })
    }

    async function createdUser(data, popup) {
        API.APIPostUser(data)
            .then(res => {
                formCleaning()
                setLoadingSubmit(false)
                setShowSignUp(false)
                alert(popup)
            })
            .catch(err => {
                setLoadingSubmit(false)
                console.log(err)
                alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
            })
    }

    function postUser(token, data) {
        sendTokenToEmail(token)
            .then(res => {
                if (res.message === 'success_send_token_verification') {
                    createdUser(data, res.popup)
                }
            })
            .catch(err => {
                console.log(err)
                alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi.')
                setLoadingSubmit(false)
            })
    }

    async function deleteUser(_id) {
        return await new Promise((resolve, reject) => {
            API.APIDeleteUser(_id)
                .then(res => {
                    resolve({ message: 'success' })
                })
                .catch(err => {
                    reject({ message: 'error' })
                })
        })
    }

    async function userCheck(data) {
        if (window.confirm('buat akun?')) {
            setLoadingSubmit(true)
            API.APIGetAllUser()
                .then(res => {
                    const result = res.data
                    const checked = result.length > 0 ? result.filter(e => e.email === data.email) : []

                    if (checked.length === 0) {
                        postUser(data.token, data)
                    } else if (checked.length > 0 && checked[0].userVerifikasi === false) {
                        deleteUser(checked[0]._id)
                            .then(res => {
                                if (res.message === 'success') {
                                    postUser(data.token, data)
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi.')
                            })
                    } else if (checked.length > 0 && checked[0].userVerifikasi) {
                        setLoadingSubmit(false)
                        alert('email sudah terdaftar!')
                    }
                })
                .catch(err => {
                    setLoadingSubmit(false)
                    alert('oops!, telah terjadi kesalahan server\nmohon coba beberapa saat lagi')
                    console.log(err)
                })
        }
    }

    function validateForm() {
        let err = {}

        if (!signUp.namaDepan) {
            err.namaDepan = true
        }
        if (!signUp.namaBelakang) {
            err.namaBelakang = true
        }
        if (!signUp.email) {
            err.email = true
        } else if (!emailRegex.test(signUp.email)) {
            err.email = true
        }
        if (!signUp.password) {
            err.password = true
        }
        if (!signUp.tanggal) {
            err.tanggal = true
        }
        if (!signUp.bulan) {
            err.bulan = true
        }
        if (!signUp.tahun) {
            err.tahun = true
        }

        setErr(err)

        return new Promise((resolve, reject) => {
            resolve(err)
        })
    }

    function submitSignUp() {
        // generate token
        const miliSeconds = `${new Date().getMilliseconds()}`
        const randomNumberTokenOne = Math.floor(Math.random() * 9)
        const randomNumberTokenTwo = Math.floor(Math.random() * 9)
        const randomNumberTokenThree = Math.floor(Math.random() * 9)
        const generateToken = `${miliSeconds}${randomNumberTokenOne}${randomNumberTokenTwo}${randomNumberTokenThree}`

        // generate token expired
        const hoursNow = new Date().getHours()
        const getHours = hoursNow.toString().length === 1 ? `0${hoursNow + 1}` : hoursNow + 1
        const getMinute = new Date().getMinutes()
        const getYears = new Date().getFullYear()
        const getMonth = new Date().getMonth()
        const getDate = new Date().getDate()

        const generateExpiredToken = new Date(`${getYears}-${getMonth + 1}-${getDate} ${getHours}:${getMinute}`)

        const newData = {
            id: `${new Date().getTime()}`,
            namaDepan: signUp.namaDepan,
            namaBelakang: signUp.namaBelakang,
            email: signUp.email,
            tglLahir: `${signUp.tanggal} ${signUp.bulan} ${signUp.tahun}`,
            gender: signUp.gender,
            fotoProfil: '',
            fotoDinding: '',
            password: signUp.password,
            statusOnline: false,
            teman: [],
            posts: [],
            chat: [],
            grup: [],
            notifikasi: [],
            notifPermintaanTeman: [],
            token: generateToken,
            expired: `${generateExpiredToken}`,
            userVerifikasi: false
        }

        if (loadingSubmit === false) {
            validateForm()
                .then(res => {
                    if (Object.keys(res).length === 0) {
                        userCheck(newData)
                    }
                })
        }
    }

    const styleInputSignUp = {
        paddingInput: '0.5em 0.5em',
        fontSizeInput: '1em'
    }
    const styleBtnCreate = {
        maxWidth: '12.5rem',
        margin: '0 auto'
    }

    function closeSignUp() {
        formCleaning()
        setShowSignUp(false)
    }

    return (
        <div className="wrapp-popup-sign-up" style={{ display: display }}>
            <div className="popup-sign-up">
                <i class="fa-solid fa-xmark close-icon-sign-up" onClick={closeSignUp}></i>
                <h1>Sign Up</h1>
                <span>It's quick and easy.</span>
                <hr />
                <div className="name-sign-up">
                    <Input
                        {...styleInputSignUp}
                        marginWrapp="0 0.7em 0.7em 0"
                        type="text"
                        name="namaDepan"
                        inputClass={err?.namaDepan ? 'error-input-card' : ''}
                        placeholder="First name"
                        value={signUp && signUp.namaDepan}
                        handleChange={handleChangeSignUp}
                    />
                    <Input
                        {...styleInputSignUp}
                        type="text"
                        name="namaBelakang"
                        inputClass={err?.namaBelakang ? 'error-input-card' : ''}
                        placeholder="Surname"
                        value={signUp && signUp.namaBelakang}
                        handleChange={handleChangeSignUp}
                    />
                </div>
                <Input
                    {...styleInputSignUp}
                    widthWrapp="auto"
                    marginWrapp="0 0.9em 0.7em 0.9em"
                    type="email"
                    inputClass={err?.email ? 'error-input-card' : ''}
                    name="email"
                    placeholder="Email address"
                    value={signUp && signUp.email}
                    handleChange={handleChangeSignUp}
                />
                <Input
                    {...styleInputSignUp}
                    widthWrapp="auto"
                    marginWrapp="0 0.9em 0.7em 0.9em"
                    type="password"
                    inputClass={err?.password ? 'error-input-card' : ''}
                    name="password"
                    placeholder="New password"
                    value={signUp && signUp.password}
                    handleChange={handleChangeSignUp}
                />
                <span className='title-input-sign-up'>Date of birth</span>
                <div className="col-input-sign-up">
                    <InputSelect
                        idSelected="tanggal"
                        marginWrapp="0 0 0 0.9em"
                        value={date}
                        selectClass={err?.tanggal ? 'error-select-input-card' : ''}
                        handleChange={handleChangeDateOfBirth}
                    />
                    <InputSelect
                        idSelected="bulan"
                        marginWrapp="0 0.7em 0 0.7em"
                        value={month}
                        selectClass={err?.bulan ? 'error-select-input-card' : ''}
                        handleChange={handleChangeDateOfBirth}
                    />
                    <InputSelect
                        idSelected="tahun"
                        marginWrapp="0 0.9em 0 0"
                        value={year}
                        selectClass={err?.tahun ? 'error-select-input-card' : ''}
                        handleChange={handleChangeDateOfBirth}
                    />
                </div>
                <span className='title-input-sign-up'>Gender</span>
                <div className="col-input-sign-up">
                    <Input
                        {...styleInputSignUp}
                        nameChooseInput="Female"
                        alignItemsWrapp="center"
                        marginWrapp="0 0em 0.7em 0.9em"
                        widthInput="auto"
                        positionInput="absolute"
                        heightWrapp="2rem"
                        borderWrapp="1px solid #dadde1"
                        rightInput="0.4em"
                        type="radio"
                        name="gender"
                        idInput='female'
                        readOnly="readonly"
                        clickWrappInput={() => handleGender('female')}
                    />
                    <Input
                        {...styleInputSignUp}
                        nameChooseInput="Male"
                        widthInput="auto"
                        alignItemsWrapp="center"
                        marginWrapp="0 0.7em 0.7em 0.7em"
                        positionInput="absolute"
                        borderWrapp="1px solid #dadde1"
                        rightInput="0.4em"
                        heightWrapp="2rem"
                        type="radio"
                        name="gender"
                        idInput='male'
                        readOnly="readonly"
                        clickWrappInput={() => handleGender('male')}
                    />
                    <Input
                        {...styleInputSignUp}
                        nameChooseInput="Privacy"
                        widthInput="auto"
                        marginWrapp="0 0.9em 0.7em 0em"
                        alignItemsWrapp="center"
                        positionInput="absolute"
                        rightInput="0.4em"
                        heightWrapp="2rem"
                        borderWrapp="1px solid #dadde1"
                        type="radio"
                        name="gender"
                        idInput='privacy'
                        readOnly="readonly"
                        clickWrappInput={() => handleGender('privacy')}
                    />
                </div>
                <Button
                    {...styleBtnCreate}
                    value="Sign Up"
                    displayLoading={loadingSubmit ? 'flex' : 'none'}
                    clickBtn={submitSignUp}
                />
            </div>
        </div>
    )
}

export default PopupSignUp