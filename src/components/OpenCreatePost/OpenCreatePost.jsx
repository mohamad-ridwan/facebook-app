import React from 'react'
import './OpenCreatePost.scss'

const OpenCreatePost = ({img, click, title}) => {
    return (
        <div className="wrapp-open-create-post">
            <div className="cont-img-upload-pf">
            <img src={img} alt="" className="img-upload-pf" />
            </div>
            
            <button className="open-create-post" onClick={click}>
                {title}
            </button>
        </div>
    )
}

export default OpenCreatePost