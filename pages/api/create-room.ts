import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { name, start_date, end_date, participant_id } = req.body;

    // 生成房間 ID
    const room_id = uuidv4();

    // 建立房間
    const { error: roomError } = await supabase
      .from("rooms")
      .insert([{ id: room_id, name }]);

    if (roomError) throw roomError;

    // 將房主加入房間
    const { error: participantError } = await supabase
      .from("participants")
      .insert([{ id: participant_id, room_id }]);

    if (participantError) throw participantError;

    res.status(200).json({ room_id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
