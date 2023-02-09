import React from 'react'
import Button from '../Button/Button'
import './CardInfo.scss'

const CardInfo = ({ name, img, displayOnline, click, heightWrapp, backgroundWrapp, heightImg, widthImg, heightImgInfo, widthImgInfo, fontSizeName, fontWeightName, mouveOver, mouseLeave, paddingWrapp, confirm, deleteFriend, displayBtnInfo, message, displayMessage, displayCircleNotif, widthWrapp, notifMessage, displayImg, icon, bdrRadiusImgInfo, bgImgInfo, classWrapp, colorMessage }) => {
  const styleWrapp = {
    height: heightWrapp,
    background: backgroundWrapp,
    padding: paddingWrapp,
    width: widthWrapp
  }
  const styleImgInfo = {
    height: heightImgInfo,
    width: widthImgInfo,
    borderRadius: bdrRadiusImgInfo,
    background: bgImgInfo
  }
  const styleImg = {
    display: displayImg,
    height: heightImg,
    width: widthImg
  }
  const styleOnline = {
    display: displayOnline
  }
  const styleBtn = {
    height: '1.9rem',
    maxWidth: '5rem',
    fontSize: '0.7rem'
  }
  const styleName = {
    fontSize: fontSizeName,
    fontWeight: fontWeightName
  }
  const styleBtnInfo = {
    display: displayBtnInfo
  }
  const styleMessage = {
    display: displayMessage,
    color: colorMessage
  }
  const styleCircleNotif = {
    display: displayCircleNotif
  }
  return (
    <div className={`card-info ${classWrapp}`} style={styleWrapp} onClick={click} onMouseOver={mouveOver} onMouseLeave={mouseLeave}>
      <div className="circle-notif" style={styleCircleNotif}></div>
      <div className="img-info" style={styleImgInfo}>
        {notifMessage !== undefined && notifMessage.length > 0 && (
          <span className='notif-message'>{notifMessage.length}</span>
        )}
        <img src={img} alt="" className='img-card-info' style={styleImg}/>
        {icon && (
          <i class={icon}></i>
        )}
        <span style={styleOnline}></span>
      </div>
      <div className="name-info">
        <p style={styleName}>{name}</p>
        <span style={styleMessage}>{message}</span>
        <div className="button-info" style={styleBtnInfo}>
          <Button 
          {...styleBtn}
          value="Konfirmasi"
          background='#1877f2'
          margin="0 0.5rem 0 0"
          clickBtn={confirm}
          />
          <Button 
          {...styleBtn}
          background="#dadde1"
          value="Hapus"
          colorBtn="#1c1e21"
          clickBtn={deleteFriend}
          />
        </div>
      </div>
    </div>
  )
}

export default CardInfo