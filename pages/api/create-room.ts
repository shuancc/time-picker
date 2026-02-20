import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

// pages/api/create-room.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // 回傳合法 JSON
    res.status(200).json({ roomId: Date.now().toString() });
  } else {
    // 其他 method 直接報錯
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { roomName, startDate, endDate, participantName } = req.body;
  if (!roomName || !startDate || !endDate || !participantName) {
    return res.status(400).json({ message: "缺少欄位" });
  }

  const room_id = uuidv4();
  const participant_id = uuidv4();

  // 建房間
  const { error: roomErr } = await supabase
    .from("rooms")
    .insert([{ id: room_id, name: roomName, start_date: startDate, end_date: endDate }]);

  if (roomErr) return res.status(500).json({ message: roomErr.message });

  // 建參與者
  const { error: partErr } = await supabase
    .from("participants")
    .insert([{ id: participant_id, room_id, name: participantName }]);

  if (partErr) return res.status(500).json({ message: partErr.message });

  res.status(200).json({ room_id, participant_id });
}
