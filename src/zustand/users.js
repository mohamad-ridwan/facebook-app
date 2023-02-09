import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const users = (set) => ({
    users: {},
    contacts: [],
    permintaanPertemanan: [],
    // userResult msh di plan
    userResult: {},
    notifikasi: [],
    teman: [],
    roomChatPerson: {},
    chatPerson: [],
    chatRoomId: null,
    addUser: (payload) => set({ users: payload }),
    addContacts: (payload)=> set({contacts: payload}),
    addFriend: (payload)=>set({permintaanPertemanan: payload}),
    changeUserResult: (payload)=>set({userResult: payload}),
    addNotifikasi: (payload)=>set({notifikasi: payload}),
    addTeman: (payload)=>set({teman: payload}),
    addRoomChatPerson: (payload)=>set({roomChatPerson: payload}),
    addChatPerson: (payload)=>set({chatPerson: payload}),
    addChatRoomId: (payload)=>set({chatRoomId: payload})
})

export const storeUsers = create(devtools(users))