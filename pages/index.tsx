import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const createRoom = async () => {
    if (!name || !startDate || !endDate) return alert("請填齊欄位");

    const res = await fetch("/api/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, start_date: startDate, end_date: endDate }),
    });
    const data = await res.json();

    if (data.room && data.participantId) {
      // 將 participantId 存到 localStorage (房主自動登入)
      localStorage.setItem("participantId", data.participantId);
      alert(`房間建立成功！自動登入房主`);
      window.location.href = `/room/${data.room.id}`;
    } else {
      alert(`建立失敗: ${data.error || data.message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>建立房間</h1>
      <input placeholder="房間名稱" value={name} onChange={e => setName(e.target.value)} />
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <button onClick={createRoom}>建立房間</button>
    </div>
  );
}
