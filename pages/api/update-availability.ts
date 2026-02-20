import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { participant_id, room_id, date, hours } = req.body;

  // 先檢查是否已經有紀錄
  const { data: existing, error: selectError } = await supabase
    .from("availability")
    .select("*")
    .eq("participant_id", participant_id)
    .eq("date", date)
    .single();

  if (selectError && selectError.code !== "PGRST116") { // PGRST116 = not found
    return res.status(500).json({ error: selectError.message });
  }

  if (existing) {
    // 更新
    const { data, error } = await supabase
      .from("availability")
      .update({ hours })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ availability: data });
  } else {
    // 新增
    const { data, error } = await supabase
      .from("availability")
      .insert([{ participant_id, room_id, date, hours }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ availability: data });
  }
}
