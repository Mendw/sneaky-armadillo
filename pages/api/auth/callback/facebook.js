import { withSession } from '../../../../lib/session'
import { basepath } from '../../../../lib/utils'

export default withSession(async (req, res) => {    
    let redirect = basepath
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
        let profile = await fetch(`https://graph.facebook.com/me?fields=email,name&access_token=${response.access_token}`).then(res => res.json())

        
    }

    res.setHeader("cache-control", "no-store, max-age=0");
    res.redirect(redirect)
})