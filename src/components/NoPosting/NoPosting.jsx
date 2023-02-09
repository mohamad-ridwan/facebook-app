import React from 'react'
import './NoPosting.scss'

const NoPosting = ({ onLoading, noPost }) => {
    return (
        <div className="no-posting">
            {onLoading ? (
                <div className="loading-get-post"></div>
            ) : (
                <>
                    {noPost && (
                        <h1 className='txt-no-post'>
                            No Posts
                        </h1>
                    )}
                </>
            )}
        </div>
    )
}

export default NoPosting