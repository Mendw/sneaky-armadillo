import { withSession } from '../../../lib/session'

export default withSession(async (req, res) => {
  const { username } = await req.body

  try {

  } catch (error) {
    const { response: fetchResponse } = error
    res.status(fetchResponse?.status || 500).json(error.data)
  }
})