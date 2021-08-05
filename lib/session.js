import { withIronSession } from 'next-iron-session'

export function withSession(handler) {
    return withIronSession(handler, {
        password: process.env.COOKIE_SECRET,
        cookieName: 'hoshimangas.session-cookie',
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production' ? true : false,
        },
    })
}