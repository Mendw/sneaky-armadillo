import { basepath } from '../../../../lib/utils'
import { withUserSession } from '../../../../lib/session'
import  { randomBytes } from 'crypto'

function buildURL({
    authenticationUrl, 
    client_id, 
    callbackEndpoint, 
    scope,
    state,
}) {
    return authenticationUrl + '?' + [
        `client_id=${client_id}`,
        `redirect_uri=${callbackEndpoint}`,
        'response_type=code',
        scope ? `scope=${scope}` : '',
        `state=${state}`
    ].filter(value => Boolean(value)).join('&')
}

export const provider_urls = {
    facebook: {
        authenticationUrl:'https://www.facebook.com/v11.0/dialog/oauth',
        client_id:process.env.FACEBOOK_CLIENT_ID,
        callbackEndpoint:`${basepath}/api/auth/callback/facebook`
    },
    google: {
        authenticationUrl:'https://accounts.google.com/o/oauth2/auth',
        client_id:process.env.GOOGLE_CLIENT_ID,
        callbackEndpoint:`${basepath}/api/auth/callback/google`,
        scope: 'openid profile email',
        
    }
}

export default withUserSession(async (req, res) => {
    let {provider} = req.query

    if(provider in provider_urls) {
        let token = randomBytes(32).toString('hex')
        req.session.set(`${provider}-token`, token)

        await req.session.save()
        res.redirect(buildURL({...provider_urls[provider], state: token}))
    } else {
        res.redirect(`${basepath}?error=provider`)
    }
})