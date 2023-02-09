import React from 'react'
import './Container.scss'

const Container = ({ background, minHeightWrapp, flexDirection, children, alignItemsContainer, paddingContainer, justifyContentContainer, maxWidthContainer }) => {
    const styleWrapp = {
        background: background,
        minHeight: minHeightWrapp,
    }
    const styleContainer = {
        flexDirection: flexDirection,
        alignItems: alignItemsContainer,
        padding: paddingContainer,
        justifyContent: justifyContentContainer,
        maxWidth: maxWidthContainer
    }
    return (
        <div className="wrapp-container-card" style={styleWrapp}>
            <div className="container-card" style={styleContainer}>
                {children}
            </div>
        </div>
    )
}

export default Container