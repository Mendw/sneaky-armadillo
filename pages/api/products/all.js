import { getSeries } from "../../../lib/fauna"

export default async function handler(req, res) {
  console.log(await getSeries())

  res.status(200).json({

  })
}
