import { withUserSession } from '../../../../../lib/session';
import { basepath } from '../../../../../lib/utils'
import { randomBytes } from 'crypto'

export default withUserSession(async (req, res) => {
    let facebook_state = req.session.get('facebook-state')
    let user = req.session.get('user')
    let query_state = req.query.state
    if(
        query_state && 
        facebook_state && 
        'token' in facebook_state &&
        query_state === facebook_state.token &&
        
        user &&
        'user_ref' in user &&
        'user_ref' in facebook_state &&
        user.user_ref === facebook_state.user_ref
    ) {
        req.session.unset('facebook-token')
        await req.session.save()

        let url = 'https://graph.facebook.com/v11.0/oauth/access_token?' + [
            `client_id=${process.env.FACEBOOK_CLIENT_ID}`,
            `redirect_uri=${basepath}/api/auth/callback/link/facebook`,
            `client_secret=${process.env.FACEBOOK_CLIENT_SECRET}`,
            `code=${req.query.code}`
        ].join('&')

        let response = await fetch(url).then(res => res.json())
        let { id } = await fetch(`https://graph.facebook.com/me?fields=email,name&access_token=${response.access_token}`).then(res => res.json())
        let token = randomBytes(16).toString('hex')

        req.session.set('authentication-data', {
            token: token,
            client_id: id,
            user_ref: facebook_state.user_ref,
            provider_id: 'facebook'
        })

        await req.session.save()
        
        res.redirect(`${basepath}/enlazar?token=${token}`)
        return
    }

    res.redirect(`${basepath}?error=state-mismatch`)
})