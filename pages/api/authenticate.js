import { withSession } from "../../lib/session";
import adapter from '../../lib/fauna'

export default withSession (async function (req, res) {
    let auth_data = req.session.get('authentication-data')
    if(auth_data === undefined) {
        res.json({
            _error: 'no auth data'
        })
        return
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
        res.json({
            _error: 'token mismatch'
        })
        return
    }
    let {data, error} = await adapter.user_from_client_id(provider_id, client_id)
    if(error) {
        res.json({
            _error: error
        })
        return
    }
    
    if (data) {
        console.log('found!')
        console.log(data)
        res.json({
            
        })
        return
    }

    let user_ref = await adapter.createUser(profile)
    let account = await adapter.linkAccount(provider_id, client_id, user_ref)
    
    res.json(account)
})