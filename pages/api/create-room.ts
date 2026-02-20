import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from '../../lib/supabase';// 確認路徑對
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { roomName, startDate, endDate, participantName } = req.body;

  if (!roomName || !startDate || !endDate || !participantName)
    return res.status(400).json({ message: "Missing required fields" });

  // 產生房間 ID 與參與者 ID
  const room_id = uuidv4();
  const participant_id = uuidv4();

  // 新增房間到 rooms table
  const { error: roomError } = await supabase.from("rooms").insert([
    {
      id: room_id,
      name: roomName,
      start_date: startDate,
      end_date: endDate,
    },
  ]);

  if (roomError) return res.status(500).json({ message: roomError.message });

  // 新增房主為第一個參與者到 participants table
  const { error: participantError } = await supabase.from("participants").insert([
    {
      id: participant_id,
      room_id,
      name: participantName,
    },
  ]);

  if (participantError)
    return res.status(500).json({ message: participantError.message });

  // 回傳房間 ID 與參與者 ID
  return res.status(200).json({ room_id, participant_id });
}
