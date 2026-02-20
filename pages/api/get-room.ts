import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../lib/supabase"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { room_id } = req.query
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", room_id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ room: data })
}
