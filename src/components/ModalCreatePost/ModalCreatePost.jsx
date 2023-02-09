import React from 'react'
import Button from '../Button/Button'
import HeadEditPf from '../EditProfile/HeadEditPf/HeadEditPf'
import './ModalCreatePost.scss'

const ModalCreatePost = ({ users, closeModal, clickAddPhotos, changePhotos, dataPhotos, clickChange, clickCancel, placeholder, changePostInput, valueTxtInput, displayWrapp, chooseAudience, valueChoosePostAudience, submit, onReadySubmit, loadingPosts }) => {

    const styleWrapp = {
        display: displayWrapp
    }

    const styleBtn = {
        fontSize: "0.9em",
        height: '2.5rem',
        margin: '1rem',
        width: 'auto'
    }

    return (
        <div className="modal-create-post" style={styleWrapp}>
            <div className="con-white-create-post">
                <div className="white-create-post">
                    <HeadEditPf
                        header="Create Post"
                        close={closeModal}
                    />

                    <div className="author">
                        <div className="cont-img-author">
                        <img src={users?.fotoProfil} alt="" className='img-author' />
                        </div>

                        <div className="name-author">
                            <span>Mohamad Ridwan Apriyadi</span>
                            <button onClick={chooseAudience}>
                                {valueChoosePostAudience === 'Public' && (
                                    <i class="fa-solid fa-earth-europe"></i>
                                )}
                                {valueChoosePostAudience === 'Friends' && (
                                    <i class="fa-solid fa-user-group"></i>
                                )}
                                <span className='status-author'>{valueChoosePostAudience}</span>
                                <i class="fa-solid fa-sort-down icon-down"></i>
                            </button>
                        </div>
                    </div>

                    <textarea name="" id="" cols="30" rows="5" className='input-post' placeholder={placeholder} onChange={changePostInput} value={valueTxtInput}></textarea>

                    <div className="add-photos">
                        <div className="cont-photo-result">
                            {dataPhotos && (
                                <img src={dataPhotos} alt="" className='photo-result' />
                            )}

                            {dataPhotos !== null && (
                                <div className="change-or-cancel">
                                    <Button
                                        height="1.8rem"
                                        fontSize="0.8em"
                                        width="auto"
                                        value="Change"
                                        classBtn="change-post"
                                        clickBtn={clickChange}
                                    />
                                    <Button
                                        width="auto"
                                        fontSize="0.8em"
                                        height="1.8rem"
                                        value="Cancel"
                                        classBtn="cancel-post"
                                        clickBtn={clickCancel}
                                    />
                                </div>
                            )}

                            {dataPhotos === null && (
                                <button className='btn-add-photos' onClick={clickAddPhotos}>
                                    <i class="fa-solid fa-folder-plus"></i>
                                    <span>Add Photos</span>
                                </button>
                            )}

                            <input type="file" name="imgPost" accept="image/png, image/jpeg, image/jpg" id='inputImgPost' className="input-img-post" onChange={changePhotos} />
                        </div>
                    </div>

                    <Button
                        {...styleBtn}
                        value="Post"
                        classBtn={onReadySubmit ? 'submit-post' : 'disable-submit-post'}
                        displayLoading={loadingPosts}
                        borderLoading="3px solid transparent"
                        borderTopColorLoading="#fff"
                        clickBtn={submit}
                    />
                </div>
            </div>
        </div>
    )
}

export default ModalCreatePost