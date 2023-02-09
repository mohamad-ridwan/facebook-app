import {create} from 'zustand'
import {persist} from 'zustand/middleware'

const authLogin = persist((set)=>({
    token: null,
    id: null,
    addToken: (payload)=>set({token: payload}),
    addId: (payload)=> set({id: payload})
}),
{
    name: 'auth-login'
}
)

export const storeAuthLogin = create(authLogin)