import { withUserSession } from "../../lib/session";
import { user_from_client_id, updateUser, linkAccount, getUser, unlinkAccount } from '../../lib/fauna'

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
        user_ref,
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
        if(!error.code || error.code !== 0) {
            res.status(400).json({
                error: error.message
            })
        }
    }
    
    if (user) {
        res.status(400).json({
            error: 'Account already linked to a user'
        }); return
    }

    if(error && error.code === 0) {
        await unlinkAccount(provider_id, client_id)
    }
    
    user = await getUser(user_ref)
    await linkAccount(provider_id, client_id, user_ref)

    let accounts = user.data.accounts
    accounts.push(provider_id)

    res.status(200).json({
        isLoggedIn: true,
        profile: await updateUser(user_ref, {
            data: {accounts}
        }).then(user => user.data)
    })
})