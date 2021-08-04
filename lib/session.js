import { createContext, useContext, useEffect } from "react"
import { withIronSession } from 'next-iron-session'
import { useState } from "react";

const SessionContext = createContext()/*
const broadcast = new BroadcastChannel('hoshi-session-broadcast')

broadcast.onmessage = (ev) => {
    let data = ev.data


}*/

let sessionData;

export function useSession() {
    const context = useContext(SessionContext)
    if (context) return context
    return _useSessionHook()
}

function _useSessionHook() {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)

    /*
    useEffect(() => {
        if(sessionData === undefined) sessionData = null


        sessionData = await getSession()
        setData()
        setLoading(false)
    })*/

    return [data, loading]
}

export function Provider(props) {
    return <SessionContext.Provider value={useSession()}>
        {props.children}
    </SessionContext.Provider>
}

export function withSession(handler) {
    return withIronSession(handler, {
        password: process.env.COOKIE_SECRET,
        cookieName: 'hoshimangas.session-cookie',
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production' ? true : false,
        },
    })
}