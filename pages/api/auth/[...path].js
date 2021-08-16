import { basepath } from '../../../lib/utils'
import { withUserSession } from '../../../lib/session'
import { randomBytes } from 'crypto'
import adapter from '../../../lib/fauna'

function buildURL({
    authenticationUrl,
    client_id,
    action,
    provider,
    scope,
    state,
}) {
    return authenticationUrl + '?' + [
        `client_id=${client_id}`,
        `redirect_uri=${basepath}/api/auth/callback/${action}/${provider}`,
        'response_type=code',
        scope ? `scope=${scope}` : '',
        `state=${state}`
    ].filter(value => Boolean(value)).join('&')
}

export const provider_urls = {
    facebook: {
        authenticationUrl: 'https://www.facebook.com/v11.0/dialog/oauth',
        client_id: process.env.FACEBOOK_CLIENT_ID,
        scope: 'public_profile email'
    },
    google: {
        authenticationUrl: 'https://accounts.google.com/o/oauth2/auth',
        client_id: process.env.GOOGLE_CLIENT_ID,
        scope: 'openid profile email',
    }
}

export default withUserSession(async (req, res) => {
    const { path } = req.query
    if (path.length !== 2) {
        res.redirect(`${basepath}?error=path`)
        return
    }

    const [action, provider] = path
    if (!(['login', 'link', 'unlink'].includes(action))) {
        res.redirect(`${basepath}?error=action`)
        return
    }

    let user_ref
    if (['link', 'unlink'].includes(action)) {
        let user = req.session.get('user')
        if (!(user && user.user_ref)) {
            res.redirect(`${basepath}?error=user_ref`)
            return
        }

        user_ref = user.user_ref
    }

    if (provider in provider_urls) {
        if (action === 'unlink') {
            let user = await adapter.getUser(user_ref)
            let accounts = user.data.accounts
            if (accounts.length < 2) {
                res.status(400).json({
                    error: "Can't unlink when theres only one account"
                }); return
            }

            let { error } = await adapter.unlinkAccount(provider, user_ref)
            if (error) {
                res.status(400).json(error)
                return
            }

            accounts = accounts.filter((value) => {
                return value !== provider
            })

            res.json({
                isLoggedIn: true,
                profile: await adapter.updateUser(user_ref, {
                    data: { accounts }
                }).then(user => user.data)
            }); return
        }

        let token = randomBytes(16).toString('hex')
        req.session.set(`${provider}-state`, {
            token,
            user_ref
        })
        await req.session.save()
        res.json({
            redirectURL: buildURL({
                ...provider_urls[provider],
                state: token,
                action,
                provider
            })
        })
    } else {
        res.json({
            error: '(api/auth/[...path]) Provider not recognized'
        })
    }
})