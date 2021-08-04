import { withSession } from "../../lib/session";

export default withSession((req, res) => {
    let user = req.session.get('user');
    let response = user ? user : {
        text: 'hello'
    };
    
    res.status(200).json(response)
})