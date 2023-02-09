import React from 'react'
import './HeadEditPf.scss'

const HeadEditPf = ({header, close}) => {
    return (
        <div className="head-edit-pf">
            <h1>{header}</h1>
            <button onClick={close}>
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    )
}

export default HeadEditPf