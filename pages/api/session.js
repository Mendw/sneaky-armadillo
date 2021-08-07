import { withSession } from "../../lib/session";
import adapter from "../../lib/fauna";

export default withSession(async (req, res) => {
    let { sessionId } = req.session.get('session')??{};

    if(sessionId === undefined) {
        let id = await adapter.createSession({})
        req.session.set('session', {
            sessionId: id,
            data: {}
        })
    } else {
        let session = await adapter.getSession(sessionId)
        req.session.set('session', session)
    }
    
    await req.session.save()
    return req.session.get('session')
})