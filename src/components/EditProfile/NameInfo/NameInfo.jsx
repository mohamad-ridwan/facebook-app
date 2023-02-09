import React from 'react'
import './NameInfo.scss'

const NameInfo = ({ icon, title}) => {
    return (
        <div className="name-info-edit-pf">
            <div className="attribute-name-info-edit-pf">
                <div className="icon-info-edit-pf">
                    <i class={icon}></i>
                </div>
                <span>{title}</span>
            </div>
        </div>
    )
}

export default NameInfo