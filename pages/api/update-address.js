import { withUserSession } from "../../lib/session"
import adapter from "../../lib/fauna"

export default withUserSession(async function (req, res) {
    let user = req.session.get('user')

    if(user && user.user_ref !== undefined) {
        let payload = req.body

        let { data, error } = await adapter.updateAddress(user.user_ref, payload)
        if(error) {
            res.status(400).json({
                error: error
            }); return
        } else {
            res.status(200).json({
                isLoggedIn: true,
                profile: data
            })
            return
        }
    } else {
        res.status(400).json({
            error: "Usuario no encontrado"
        }); return
    }
})