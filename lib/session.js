import { createContext, useContext, useEffect } from "react"
import { withIronSession } from 'next-iron-session'
import useUser from './useUser.js'

const SessionContext = createContext()

/*
export function useSession () {
    const context = useContext(SessionContext)
    if(context) return context
    return useSWR('/api/session')
}

export function Provider(props) {
    return <SessionContext.Provider value={useSession()}>
        {props.children}
    </SessionContext.Provider>
}*/

export function withSession(handler) {
    return withIronSession(handler, {
        password: process.env.COOKIE_SECRET,
        cookieName: 'hoshimangas.session-cookie',
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production' ? true : false,
        },
    })
}