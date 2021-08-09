import { withUserSession } from "../../lib/session";
import adapter from "../../lib/fauna";

export default withUserSession(async (req, res) => {
    let user = req.session.get('user')

    if(user && user.user_ref !== undefined) {
        res.json({
            isLoggedIn: true,
            profile: await adapter.getUser(user.user_ref).then(res => res.data)
        })
    } else res.json({
        isLoggedIn: false
    })
})