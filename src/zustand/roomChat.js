import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const roomChat = (set) => ({
    someoneDeletedFriend: {},
    addSomeoneDeletedFriend: (payload)=>set({someoneDeletedFriend: payload})
})

export const storeRoomChat = create(devtools(roomChat))