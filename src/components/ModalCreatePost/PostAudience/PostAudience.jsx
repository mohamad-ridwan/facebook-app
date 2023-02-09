import React from 'react'
import CardInfo from '../../CardInfo/CardInfo'
import HeadEditPf from '../../EditProfile/HeadEditPf/HeadEditPf'
import './PostAudience.scss'

const PostAudience = ({ displayWrapp, closeModal, clickAudience, activeChoose }) => {
    const styleWrapp = {
        display: displayWrapp
    }

    const styleCardInfo = {
        widthWrapp: 'auto',
        displayImg: 'none',
        heightWrapp: '5rem',
        heightImgInfo: '3.8rem',
        widthImgInfo: '4.6rem',
        displayOnline: 'none',
        bdrRadiusImgInfo: '500px',
        bgImgInfo: '#e4e6eb',
        displayMessage: 'flex',
        colorMessage: '#606770'
    }

    return (
        <div className="post-audience" style={styleWrapp}>
            <div className="cont-post-audience">
                <div className="white-post-audience">
                    <HeadEditPf
                        header="Post Audience"
                        close={closeModal}
                    />

                    <p className='title-post-adc'>Who can see your post?</p>
                    <span className='desk-post-adc'>
                        Your post will show up in Feed, on your profile.
                        <br /><br />
                        Your default audience is set to <b>Friends</b>, but you can change the audience of this specific post.
                    </span>

                    <div className="choose-public-or-friends">
                        <CardInfo
                            {...styleCardInfo}
                            icon="fa-solid fa-earth-europe"
                            classWrapp={activeChoose === 'Public' ? 'choose-post-audience choose-post-audience-active' : 'choose-post-audience'}
                            name="Public"
                            message="Anyone on or off Facebook"
                            click={()=>clickAudience('Public')}
                        />
                        <CardInfo
                            {...styleCardInfo}
                            icon="fa-solid fa-user-group"
                            classWrapp={activeChoose === 'Friends' ? 'choose-post-audience choose-post-audience-active' : 'choose-post-audience'}
                            name="Friends"
                            message="Your friends on Facebook"
                            click={()=>clickAudience('Friends')}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostAudience