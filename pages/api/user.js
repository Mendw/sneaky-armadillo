import { withUserSession } from "../../lib/session";
import adapter from "../../lib/fauna";

export default withUserSession(async (req, res) => {
    let user = req.session.get('user')

    if(user && user.user_ref !== undefined) {
        let db_user = await adapter.getUser(user.user_ref).then(res => res.data)
        if(db_user !== undefined) {
            res.json({
                isLoggedIn: true,
                profile: db_user
            }); return
        }

        req.session.unset('user')
        await req.session.save()
    }

    res.json({
        isLoggedIn: false
    })
})