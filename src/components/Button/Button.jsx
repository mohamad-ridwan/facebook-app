import React from 'react'
import './Button.scss'

const Button = ({width, maxWidth, margin, background, value, clickBtn, fontSize, mouseOver, mouseLeave, height, displayLoading, borderLoading, borderTopColorLoading, zIndexBtn, icon, displayIcon, colorBtn, classBtn }) => {
  const style = {
    width: width,
    maxWidth: maxWidth,
    margin: margin,
    background: background,
    fontSize: fontSize,
    height: height,
    zIndex: zIndexBtn,
    color: colorBtn
  }
  const styleLoading = {
    display: displayLoading,
    border: borderLoading,
    borderTopColor: borderTopColorLoading
  }
  const styleIcon = {
    display: displayIcon
  }
  return (
    <button className={`btn-exc ${classBtn}`} onClick={clickBtn} style={style} onMouseOver={mouseOver} onMouseLeave={mouseLeave}>
      <div className="loading-btn-exc" style={styleLoading}></div>
      <i class={icon} style={styleIcon}></i>
      {value}
    </button>
  )
}

export default Button