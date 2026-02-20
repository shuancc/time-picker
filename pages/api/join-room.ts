import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { room_id, participant_name } = req.body;

  const { data, error } = await supabase
    .from("participants")
    .insert([{ room_id, name: participant_name }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ participant: data });
}
