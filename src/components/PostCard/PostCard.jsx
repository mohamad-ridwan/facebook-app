import React from 'react'
import { storeAuthLogin } from '../../zustand/authLogin'
import './PostCard.scss'

const PostCard = ({ data, users, clickLike, submitComment, changeComment, idInputComment, onLoading }) => {
    const id = storeAuthLogin((state) => state.id)

    return (
        <div className="wrapp-post-card">
            <div className="author-post">
                <img src={data?.fotoProfil} alt="" className="img-author-post" />

                <div className="name-author-post">
                    <h5 className='name-post'>
                        {data?.username}
                    </h5>
                    <span className='time-on-post'>
                        {data?.date} · {data?.postAudience === 'Friends' ? <i class="fa-solid fa-user-group"></i> : <i class="fa-solid fa-earth-europe"></i>}
                    </span>
                </div>
            </div>

            <p className="subject-post">
                {data?.message}
            </p>

            {data?.imgPost !== null && (
                <img src={data?.imgPost} alt="" className="img-result-post" />
            )}

            <div className="like-and-comment">
                <div className="left">
                    <button className="btn-like" onClick={clickLike}>
                        <i class="fa-solid fa-thumbs-up"></i>
                    </button>
                    <span className='total-like'>{data?.like?.length > 0 ? data?.like?.length > 1 ? data?.like?.filter(e => e.id === id).length === 1 ? `You and ${data?.like?.length - 1} Others` : data?.like?.length : data?.like?.filter(e => e.id === id).length === 1 ? `You ${data?.like?.length}` : data?.like?.length : ''}</span>
                </div>

                <span className='total-comment'>{data?.comments?.length > 0 ? data?.comments?.length : ''} comments</span>
            </div>

            <div className="write-comment">
                <div className="cont-pic-profile-comment">
                    <img src={users?.fotoProfil} alt="" className='pic-profile-comment' />
                </div>
                <form onSubmit={submitComment} className="form-comment">
                    <input type="text" id={idInputComment} name="" className='input-post-comment input-gb' placeholder='Write comment' onChange={changeComment}></input>
                    {onLoading && (
                        <div className="loading-submit-comment"></div>
                    )}
                </form>
            </div>

            {/* comment result */}
            {data?.comments?.length > 0 && data?.comments?.map((e, i) => (
                <div className="comment-result" key={i}>
                    <div className="cont-img-comment-result">
                        <img src={e.fotoProfil} alt="" className='img-comment-result' />
                    </div>

                    <div className="message-comment-result">
                        <div className="attribute-comment">
                            <h5 className="name-comment">
                                {e.username}
                            </h5>
                            <p className="message-comment">
                                {e.message}
                            </p>
                        </div>
                        <span className='date-msg-comment'>{e.date}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PostCard