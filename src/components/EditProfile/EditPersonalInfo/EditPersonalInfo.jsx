import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../useFetch'
import Button from '../../Button/Button'
import Input from '../../Input/Input'
import InputSelect from '../../InputSelect/InputSelect'
import './EditPersonalInfo.scss'

const EditPersonalInfo = ({ display, setShowEditPersonal, users }) => {
    const [dataEdit, setDataEdit] = useState({
        namaDepan: '',
        namaBelakang: '',
        email: '',
        tanggal: '',
        bulan: '',
        tahun: '',
        gender: ''
    })
    const [err, setErr] = useState({
        namaDepan: false,
        namaBelakang: false,
        email: false,
        tanggal: false,
        bulan: false,
        tahun: false
    })
    const [year, setYear] = useState([])
    const [date, setDate] = useState([])
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [onReadySave, setOnReadySave] = useState(false) 

    const navigate = useNavigate()

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    function handleGender(id, condition) {
        const newId = ['female', 'male', 'privacy']
        const el = document.getElementById(id)

        if (el) {
            el.checked = true
        }

        const getId = newId.filter(e => e !== id)

        getId.forEach(e => {
            document.getElementById(e).checked = false
        })

        if (condition) {
            setDataEdit({
                ...dataEdit,
                gender: id
            })
        }
    }

    useEffect(() => {
        setTimeout(() => {
            formCleaning(true)
        }, 0)
    }, [users])

    useEffect(()=>{
        let errChange = {}

        const tglLahir = users?.tglLahir
        const tanggal = tglLahir && tglLahir.slice(0, 2).replace(/ /g, '')
        const bulan = tglLahir && tglLahir.slice(3, 7).replace(/ /g, '')
        const tahun = tglLahir && tglLahir.slice(7, 11).replace(/ /g, '')

        if(dataEdit.namaDepan === users?.namaDepan){
            errChange.namaDepan = 'this is the same'
        }
        if(dataEdit.namaBelakang === users?.namaBelakang){
            errChange.namaBelakang = 'this is the same'
        }
        if(dataEdit.email === users?.email){
            errChange.email = 'this is the same'
        }
        if(dataEdit.tanggal === tanggal){
            errChange.tanggal = 'this is the same'
        }
        if(dataEdit.bulan === bulan){
            errChange.bulan = 'this is the same'
        }
        if(dataEdit.tahun === tahun){
            errChange.tahun = 'this is the same'
        }
        if(dataEdit.gender === users?.gender){
            errChange.gender = 'this is the same'
        }

        if(dataEdit?.namaDepan?.length > 0 && Object.keys(errChange).length !== 7){
            setOnReadySave(true)
        }
        if(dataEdit?.namaDepan?.length > 0 && Object.keys(errChange).length === 7){
            setOnReadySave(false)
        }
    }, [dataEdit])

    function formCleaning(condition) {
        const tglLahir = users?.tglLahir
        const tanggal = document.getElementById('tanggal')
        const bulan = document.getElementById('bulan')
        const tahun = document.getElementById('tahun')

        if (tanggal) {
            tanggal.value = tglLahir && tglLahir.slice(0, 2).replace(/ /g, '')
        }
        if (bulan) {
            bulan.value = tglLahir && tglLahir.slice(3, 7).replace(/ /g, '')
        }
        if (tahun) {
            tahun.value = tglLahir && tglLahir.slice(7, 11).replace(/ /g, '')
        }

        if (condition) {
            setErr({
                namaDepan: false,
                namaBelakang: false,
                email: false,
                tanggal: false,
                bulan: false,
                tahun: false
            })
            setDataEdit({
                namaDepan: users?.namaDepan,
                namaBelakang: users?.namaBelakang,
                email: users?.email,
                tanggal: tglLahir && tglLahir.slice(0, 2).replace(/ /g, ''),
                bulan: tglLahir && tglLahir.slice(3, 7).replace(/ /g, ''),
                tahun: tglLahir && tglLahir.slice(7, 11).replace(/ /g, ''),
                gender: users?.gender
            })
            handleGender(users?.gender)
        }
    }

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
    }, [])

    const styleInputSignUp = {
        paddingInput: '0.5em 0.5em',
        fontSizeInput: '1em'
    }
    const styleBtnCreate = {
        maxWidth: '12.5rem',
        margin: '0 auto'
    }

    function handleChangeEdit(e) {
        setDataEdit({
            ...dataEdit,
            [e.target.name]: e.target.value
        })

        if (err && Object.keys(err).length > 0) {
            setErr({
                ...err,
                [e.target.name]: false
            })
        }
    }

    function handleChangeDateOfBirth(e) {
        setDataEdit({
            ...dataEdit,
            [e.target.id]: e.target.value
        })

        if (err && Object.keys(err).length > 0) {
            setErr({
                ...err,
                [e.target.id]: false
            })
        }
    }

    function closeEdit() {
        setShowEditPersonal()
        formCleaning(true)
    }

    function validateForm() {
        let err = {}
        let errChange = {}

        const tglLahir = users?.tglLahir
        const tanggal = tglLahir && tglLahir.slice(0, 2).replace(/ /g, '')
        const bulan = tglLahir && tglLahir.slice(3, 7).replace(/ /g, '')
        const tahun = tglLahir && tglLahir.slice(7, 11).replace(/ /g, '')

        if (!dataEdit.namaDepan) {
            err.namaDepan = true
        }
        if (!dataEdit.namaBelakang) {
            err.namaBelakang = true
        }
        if (!dataEdit.email) {
            err.email = true
        } else if (!emailRegex.test(dataEdit.email)) {
            err.email = true
        }
        if (!dataEdit.tanggal) {
            err.tanggal = true
        }
        if (!dataEdit.bulan) {
            err.bulan = true
        }
        if (!dataEdit.tahun) {
            err.tahun = true
        }

        setErr(err)

        if(dataEdit.namaDepan === users?.namaDepan){
            errChange.namaDepan = 'this is the same'
        }
        if(dataEdit.namaBelakang === users?.namaBelakang){
            errChange.namaBelakang = 'this is the same'
        }
        if(dataEdit.email === users?.email){
            errChange.email = 'this is the same'
        }
        if(dataEdit.tanggal === tanggal){
            errChange.tanggal = 'this is the same'
        }
        if(dataEdit.bulan === bulan){
            errChange.bulan = 'this is the same'
        }
        if(dataEdit.tahun === tahun){
            errChange.tahun = 'this is the same'
        }
        if(dataEdit.gender === users?.gender){
            errChange.gender = 'this is the same'
        }

        return new Promise((resolve) => {
            resolve({err: err, errChange: errChange})
        })
    }

    function updatePersonalInfo(){
        const newData = {
            namaDepan: dataEdit.namaDepan,
            namaBelakang: dataEdit.namaBelakang,
            email: dataEdit.email,
            tglLahir: `${dataEdit.tanggal} ${dataEdit.bulan} ${dataEdit.tahun}`,
            gender: dataEdit.gender
        }
        API.APIPutProfilePersonalInfo(users?._id, newData)
        .then(res=>{
            if(res?.data){
                const namaDepan = res.data.namaDepan
                const namaBelakang = res.data.namaBelakang
                alert('successfully updated personal info')
                navigate(`/${namaDepan}${namaBelakang}`)
                window.location.reload()
            }
        })
        .catch(err=> console.log(err))
    }

    function saveEdit() {
        if (loadingSubmit === false) {
            validateForm()
                .then(res => {
                    if (Object.keys(res.errChange).length <= 6 && Object.keys(res.err).length === 0) {
                        updatePersonalInfo()
                    }
                })
        }
    }

    return (
        <div className="wrapp-pop-up-edit-personal" style={{ display: display }}>
            <div className="popup-sign-up">
                <i class="fa-solid fa-xmark close-icon-sign-up" onClick={closeEdit}></i>
                <h1>Edit Personal Information</h1>
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
                        value={dataEdit.namaDepan}
                        handleChange={handleChangeEdit}
                    />
                    <Input
                        {...styleInputSignUp}
                        type="text"
                        name="namaBelakang"
                        inputClass={err?.namaBelakang ? 'error-input-card' : ''}
                        placeholder="Surname"
                        value={dataEdit.namaBelakang}
                        handleChange={handleChangeEdit}
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
                    value={dataEdit.email}
                    handleChange={handleChangeEdit}
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
                        clickWrappInput={() => handleGender('female', true)}
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
                        clickWrappInput={() => handleGender('male', true)}
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
                        clickWrappInput={() => handleGender('privacy', true)}
                    />
                </div>
                <Button
                    {...styleBtnCreate}
                    classBtn={onReadySave ? '' : 'disable-save-edit'}
                    value="Save"
                    // displayLoading={loadingSubmit ? 'flex' : 'none'}
                    clickBtn={saveEdit}
                />
            </div>
        </div>
    )
}

export default EditPersonalInfo