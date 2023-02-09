import React from 'react'
import './SectionEditPf.scss'

const SectionEditPf = ({title, nameBtn, clickEdit, idInputImg, changeFile}) => {
  return (
    <div className="section-edit-pf">
        <h1>{title}</h1>
        <button onClick={clickEdit}>{nameBtn}</button>
        <input type="file" name="myImage" accept="image/png, image/jpeg, image/jpg" id={idInputImg} className="input-edit-pf" onChange={changeFile}/>
    </div>
  )
}

export default SectionEditPf