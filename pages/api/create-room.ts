import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, start_date, end_date } = req.body;
  if (!name || !start_date || !end_date) return res.status(400).json({ message: "缺少欄位" });

  // 1️⃣ 建立房間
  const roomId = uuidv4();
  const { data: roomData, error: roomError } = await supabase
    .from("rooms")
    .insert([{ id: roomId, name, start_date, end_date }])
    .select()
    .single();

  if (roomError) return res.status(500).json({ error: roomError.message });

  // 2️⃣ 建立房主 participant
  const participantId = uuidv4();
  const { data: participantData, error: participantError } = await supabase
    .from("participants")
    .insert([{ id: participantId, room_id: roomId, name: "房主" }])
    .select()
    .single();

  if (participantError) return res.status(500).json({ error: participantError.message });

  return res.status(200).json({
    room: roomData,
    participantId, // 前端用這個自動登入房主
  });
}
