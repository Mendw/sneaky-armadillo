import { withSession } from '../../../../lib/session'
import { basepath } from '../../../../lib/utils'

import { jwtVerify } from 'jose/jwt/verify'
import { createRemoteJWKSet } from 'jose/jwks/remote'

export default withSession(async (req, res) => {    
    let redirect = basepath

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

        const { payload, protectedHeader } = await jwtVerify(
            response.id_token,
            createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs')), 
            {
                issuer: ["https://accounts.google.com", "accounts.google.com"],
                audience: process.env.GOOGLE_CLIENT_ID
            }
        )

        console.log(payload)
    } else {
        redirect = `${basepath}?error=token`
    }

    res.setHeader("cache-control", "no-store, max-age=0");
    res.redirect(redirect)
})