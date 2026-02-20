// pages/api/create-room.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, start_date, end_date, participant_id } = req.body;

  if (!name || !start_date || !end_date || !participant_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const room_id = uuidv4();

  // 建立房間
  const { error: roomError } = await supabase.from("rooms").insert({
    id: room_id,
    name,
    start_date,
    end_date,
    host_id: participant_id
  });

  if (roomError) {
    console.error(roomError);
    return res.status(500).json({ message: "Failed to create room" });
  }

  // 將房主加入 availability (或 schedules) 資料表
  const { error: availError } = await supabase.from("availability").insert({
    room_id,
    participant_id,
    date: start_date, // 預設填第一天
    hours: Array(24).fill(false) // 預設所有時段都沒選
  });

  if (availError) {
    console.error(availError);
    return res.status(500).json({ message: "Failed to create availability" });
  }

  res.status(200).json({ room_id });
}
