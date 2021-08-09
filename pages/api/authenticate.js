import { withUserSession } from "../../lib/session";
import { user_from_client_id, createUser, linkAccount } from '../../lib/fauna'

export default withUserSession (async function (req, res) {
    let auth_data = req.session.get('authentication-data')
    if(auth_data === undefined) {
        res.status(400).json({
            error: 'Authentication data not found'
        }); return
    }

    let {
        token,
        client_id,
        profile,
        provider_id
    } = auth_data

    req.session.unset('authentication-data')
    await req.session.save()

    if(token !== req.query.token) {
        res.status(400).json({
            error: 'Token mismatch'
        }); return
    }

    let {user, error} = await user_from_client_id(provider_id, client_id)
    if(error) {
        res.status(400)
        res.status(400).json({
            error: error
        }); return
    }
    
    if (!user) {
        user = await createUser(profile)
        linkAccount(provider_id, client_id, user.ref.id)
    }

    req.session.set('user', {
        user_ref: user.ref.id
    })
    await req.session.save()
    res.status(200).json({
        isLoggedIn: true,
        profile: user.data
    })
})