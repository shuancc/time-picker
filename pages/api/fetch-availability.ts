import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { room_id, date } = req.query;
  if (!room_id || !date) return res.status(400).json({ error: "缺少 room_id 或 date" });

  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("room_id", room_id)
    .eq("date", date);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ availability: data });
}
