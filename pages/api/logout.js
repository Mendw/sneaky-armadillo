import { withUserSession } from "../../lib/session"

export default withUserSession(async (req, res) => {
  req.session.destroy();
  res.json({ isLoggedIn: false });
});