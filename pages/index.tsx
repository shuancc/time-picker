import { useState } from "react";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  const createRoom = async () => {
    try {
      const participant_id = crypto.randomUUID(); // 房主 ID
      const res = await fetch("/api/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roomName, start_date, end_date, participant_id }),
      });

      const data = await res.json();
      if (res.ok) {
        // 跳轉到房間頁
        window.location.href = `/room/${data.room_id}?participant=${participant_id}`;
      } else {
        alert("建立房間失敗：" + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("建立房間發生錯誤");
    }
  };

  return (
    <div>
      <h1>Time Picker</h1>
      <input
        type="text"
        placeholder="房間名稱"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="date"
        value={start_date}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={end_date}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={createRoom}>建立房間</button>
    </div>
  );
}
