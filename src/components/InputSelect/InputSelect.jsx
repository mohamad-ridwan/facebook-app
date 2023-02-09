import React from 'react'
import './InputSelect.scss'

const InputSelect = ({ value, marginWrapp, idSelected, handleChange, selectClass}) => {
    const styleWrapp = {
        margin: marginWrapp
    }
    return (
        <label htmlFor="" className='label-select' style={styleWrapp}>
            <select className={`select-input-card ${selectClass}`} onChange={handleChange} id={idSelected}>
                {value && value.length > 0 ? value.map((e, i)=>(
                    <option key={i} value={e}>{e}</option>
                )) : (
                    <></>
                )}
            </select>
            <i class="fa-solid fa-angle-down"></i>
        </label>
    )
}

export default InputSelect