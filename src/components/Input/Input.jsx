import React from 'react'
import './Input.scss'

const Input = ({nameChooseInput, type, name, placeholder, value, nameIcon, paddingInput, fontSizeInput, handleChange, alignItemsWrapp, clickIcon, readOnly, marginWrapp, widthWrapp, heightWrapp, positionInput, widthInput, rightInput, borderWrapp, idInput, clickWrappInput, inputClass, maxLength}) => {
    const styleWrapp = {
        alignItems: alignItemsWrapp,
        margin: marginWrapp,
        width: widthWrapp,
        height: heightWrapp,
        border: borderWrapp
    }
    const styleInput = {
        padding: paddingInput,
        fontSize: fontSizeInput,
        position: positionInput,
        width: widthInput,
        right: rightInput
    }
  return (
    <div style={styleWrapp} className="wp-input" onClick={clickWrappInput}>
        {nameChooseInput && (
            <p className='name-choose-input'>{nameChooseInput}</p>
        )}
        <input id={idInput} style={styleInput} className={`input-card input-gb ${inputClass}`} type={type} readOnly={readOnly} name={name} placeholder={placeholder} maxLength={maxLength} value={value} onChange={handleChange}/>
        {nameIcon && (
            <i className={`${nameIcon} icon-input`} onClick={clickIcon}></i>
        )}
    </div>
  )
}

export default Input