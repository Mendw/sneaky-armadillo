import { withUserSession } from '../../../../../lib/session';
import { basepath } from '../../../../../lib/utils'

import { jwtVerify } from 'jose/jwt/verify'
import { createRemoteJWKSet } from 'jose/jwks/remote'
import { randomBytes } from 'crypto'

const remoteJWKs = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export default withUserSession(async (req, res) => {
    let google_state = req.session.get('google-state')
    let user = req.session.get('user')
    let query_state = req.query.state
    if(
        query_state && 
        google_state && 
        'token' in google_state &&
        query_state === google_state.token &&
        
        user &&
        'user_ref' in user &&
        'user_ref' in google_state &&
        user.user_ref === google_state.user_ref
    ) {
        req.session.unset('google-token')
        await req.session.save()

        let response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
                code: req.query.code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${basepath}/api/auth/callback/link/google`,
                grant_type: 'authorization_code'
            })
        }).then(res => res.json())

        const { payload } = await jwtVerify(
            response.id_token, remoteJWKs, 
            {
                issuer: ["https://accounts.google.com", "accounts.google.com"],
                audience: process.env.GOOGLE_CLIENT_ID
            }
        )

        let token = randomBytes(16).toString('hex')
        req.session.set('authentication-data', {
            token: token,
            client_id: payload.sub,
            user_ref: google_state.user_ref,
            provider_id: 'google'
        })

        await req.session.save()

        res.redirect(`${basepath}/enlazar?token=${token}`)
        return
    }

    res.redirect(`${basepath}?error=state-mismatch`)
})