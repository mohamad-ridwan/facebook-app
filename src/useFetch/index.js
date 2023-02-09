import useFetch from "./useFetch";

// user
const APIGetAllUser = ()=>useFetch('v1/user/get/all-user', 'GET')
const APIGetOneUser = (id)=>useFetch(`v1/user/get/one-user/${id}`, 'GET')
const APIGetUserAuthLogin = (token)=>useFetch(`v1/user/get/user-auth-login?token=${token}`, 'GET')
const APIPostUserLogin = (data)=>useFetch('v1/user/post/user-login', 'POST', data)
const APIPostUser = (data)=> useFetch('v1/user/post/user', 'POST', data)
const APIPostNotifPermintaanPertemanan = (id, data)=>useFetch(`v1/user/post/notif-permintaan-pertemanan/${id}`, 'POST', data)
const APIPostAcceptFriendship = (id, data)=>useFetch(`v1/user/post/accept-friendship/${id}`, 'POST', data)
const APIPostNotifikasi = (id, idTeman, data)=>useFetch(`v1/user/post/notifikasi/${id}?idTeman=${idTeman}`, 'POST', data)
const APIPostChatRoom = (id, data)=>useFetch(`v1/user/post/${id}/chat`, 'POST', data)
const APIPostMessage = (_id, roomId, data)=>useFetch(`v1/user/post/${_id}/chat/message?roomId=${roomId}`, 'POST', data)
const APIPostPosts = (id, data)=> useFetch(`v1/user/post/${id}/posts`, 'POST', data)
const APIPostLikePosts = (id, idLocation, data)=>useFetch(`v1/user/post/posts/like?userId=${id}&idLocation=${idLocation}`, 'POST', data)
const APIPostComments = (id, idLocation, data)=>useFetch(`v1/user/post/posts/comments?userId=${id}&idLocation=${idLocation}`, 'POST', data)
const APIPutUserActivated = (_id)=>useFetch(`v1/user/put/user-activated/${_id}`, 'PUT')
const APIPutUserLogout = (id)=>useFetch(`v1/user/put/user-logout?_id=${id}`, 'PUT')
const APIPutProfilePersonalInfo = (_id, data)=>useFetch(`v1/user/put/profile-personal-information?user_id=${_id}`, 'PUT', data)
const APIPutProfilePicture = (_id, data)=>useFetch(`v1/user/put/profile-picture?user_id=${_id}`, 'PUT', data)
const APIPutProfileCover = (_id, data)=>useFetch(`v1/user/put/profile-cover?user_id=${_id}`, 'PUT', data)
const APIDeleteUser = (_id)=>useFetch(`v1/user/delete/user/${_id}`, 'DELETE')
const APIDeleteTeman = (id, idTeman)=>useFetch(`v1/user/delete/${id}/teman?idTeman=${idTeman}`, 'DELETE')
const APIDeleteChat = (id, userId)=>useFetch(`v1/user/delete/${id}/chat?userId=${userId}`, 'DELETE')
const APIDeleteNotifFriendRequest = (id, idTeman)=>useFetch(`v1/user/delete/notif-permintaan-pertemanan/${id}?idTeman=${idTeman}`, 'DELETE')

const API = {
    APIGetAllUser,
    APIGetOneUser,
    APIGetUserAuthLogin,
    APIPostUserLogin,
    APIPostUser,
    APIPostNotifPermintaanPertemanan,
    APIPostAcceptFriendship,
    APIPostNotifikasi,
    APIPostChatRoom,
    APIPostMessage,
    APIPostPosts,
    APIPostLikePosts,
    APIPostComments,
    APIPutUserActivated,
    APIPutUserLogout,
    APIPutProfilePersonalInfo,
    APIPutProfilePicture,
    APIPutProfileCover,
    APIDeleteUser,
    APIDeleteTeman,
    APIDeleteChat,
    APIDeleteNotifFriendRequest
}

export default API