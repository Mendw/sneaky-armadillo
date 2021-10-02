import { withUserSession } from "../../lib/session"
import adapter from "../../lib/fauna"

export default withUserSession(async function (req, res) {
    let user = req.session.get('user')

    if(user && user.user_ref !== undefined) {
        res.status(200).json(await adapter.detailedCart(user.user_ref))
    } else {
        res.status(400).json({
            error: "Usuario no encontrado"
        }); return
    }
})