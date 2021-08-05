import { withSession } from '../../../../lib/session'
import { basepath } from '../../../../lib/utils'

import { jwtVerify } from 'jose-node-esm-runtime/jwt/verify'
import { createRemoteJWKSet } from 'jose-node-esm-runtime/jwks/remote'
import { randomBytes } from 'crypto'

const remoteJWKs = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export default withSession(async (req, res) => {    
    res.setHeader("cache-control", "no-store, max-age=0");

    if(req.query.state === req.session.get('google-token')) {
        req.session.unset('google-token')
        await req.session.save()

        let response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
                code: req.query.code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${basepath}/api/auth/callback/google`,
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

        let token = randomBytes(32).toString('hex')
        req.session.set('authentication-data', {
            token: token,
            client_id: payload.sub,
            profile: {
                email: payload.email,
                email_verified: payload.email_verified,
                name: payload.name
            },
            provider_id: 'google'
        })

        await req.session.save()

        res.redirect(`${basepath}/autenticar?token=${token}`)
        return
    }

    //error should be passed
    res.redirect(basepath)
})