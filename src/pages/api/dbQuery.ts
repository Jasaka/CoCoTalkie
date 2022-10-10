import connection from "../../lib/db"
import { NextApiRequest, NextApiResponse } from "next"
import { fetchError } from "../../util/utilTypes"
import { query } from "../../lib/queries"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | fetchError>
) {
  connection
    .query(query)
    .then((result) => {
      res.status(200).json(result.rows)
    })
    .catch((err) => {
      res.status(404).json({ error: err.message })
    })
}
