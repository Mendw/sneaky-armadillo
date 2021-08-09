import { withUserSession } from '../../../../lib/session'
import { basepath } from '../../../../lib/utils'
import { randomBytes } from 'crypto'

export default withUserSession(async (req, res) => {    
    res.setHeader("cache-control", "no-store, max-age=0");

    if(req.query.state === req.session.get('facebook-token')) {
        req.session.unset('facebook-token')
        await req.session.save()

        let url = 'https://graph.facebook.com/v11.0/oauth/access_token?' + [
            `client_id=${process.env.FACEBOOK_CLIENT_ID}`,
            `redirect_uri=${basepath}/api/auth/callback/facebook`,
            `client_secret=${process.env.FACEBOOK_CLIENT_SECRET}`,
            `code=${req.query.code}`
        ].join('&')

        let response = await fetch(url).then(res => res.json())
        let {id, ...profile} = await fetch(`https://graph.facebook.com/me?fields=email,name&access_token=${response.access_token}`).then(res => res.json())
        let token = randomBytes(32).toString('hex')

        req.session.set('authentication-data', {
            token: token,
            client_id: id,
            profile: profile,
            provider_id: 'facebook'
        })

        await req.session.save()
        
        res.redirect(`${basepath}/autenticar?token=${token}`)
        return
    }

    //error should be passed
    res.redirect(basepath)
})