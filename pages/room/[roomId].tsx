import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RoomPage() {
  const router = useRouter();
  const { roomId } = router.query;

  const [participantId, setParticipantId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [myHours, setMyHours] = useState(Array(24).fill(false));
  const [allHours, setAllHours] = useState<boolean[][]>([]);

  // 從 localStorage 自動取得 participantId
  useEffect(() => {
    const pid = localStorage.getItem("participantId");
    if (pid) setParticipantId(pid);
  }, []);

  const fetchAvailability = async () => {
    if (!roomId) return;
    const res = await fetch(`/api/fetch-availability?room_id=${roomId}&date=${date}`);
    const data = await res.json();
    if (data.availability) {
      setAllHours(data.availability.map((a: any) => a.hours));
      const mine = data.availability.find((a: any) => a.participant_id === participantId);
      if (mine) setMyHours(mine.hours);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [roomId, date, participantId]);

  const toggleHour = (index: number) => {
    const newHours = [...myHours];
    newHours[index] = !newHours[index];
    setMyHours(newHours);
  };

  const saveAvailability = async () => {
    if (!participantId || !roomId) return alert("參與者 ID 缺失");
    await fetch("/api/update-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participant_id: participantId, room_id: roomId, date, hours: myHours }),
    });
    fetchAvailability();
  };

  // 匯總大家有空的時間
  const aggregateHours = Array(24).fill(true);
  allHours.forEach(p => p.forEach((h: boolean, i: number) => { aggregateHours[i] = aggregateHours[i] && h; }));

  return (
    <div style={{ padding: 20 }}>
      <h1>房間 {roomId}</h1>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <h2>我的時間表</h2>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {myHours.map((h, i) => (
          <div key={i} onClick={() => toggleHour(i)} style={{
            width: 30, height: 30, backgroundColor: h ? "green" : "#eee",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid #ccc",
          }}>{i}</div>
        ))}
      </div>
      <button onClick={saveAvailability} style={{ marginTop: 10 }}>儲存</button>

      <h2>大家有空的時間（綠色 = 全部人都有空）</h2>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {aggregateHours.map((h, i) => (
          <div key={i} style={{
            width: 30, height: 30, backgroundColor: h ? "green" : "#eee",
            display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ccc",
          }}>{i}</div>
        ))}
      </div>
    </div>
  );
}
