import { useState } from "react";

export default function Home() {
  // 房間名稱、開始與結束日期
  const [roomName, setRoomName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  const createRoom = async () => {
    try {
      const participant_id = crypto.randomUUID(); // 當作房主的 ID
      const res = await fetch("/api/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomName,
          start_date,
          end_date,
          participant_id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // 建立房間成功後跳轉
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
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h1>建立新房間</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="房間名稱"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>開始日期: </label>
        <input
          type="date"
          value={start_date}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: "0.3rem" }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>結束日期: </label>
        <input
          type="date"
          value={end_date}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: "0.3rem" }}
        />
      </div>
      <button onClick={createRoom} style={{ padding: "0.5rem 1rem" }}>
        建立房間
      </button>
    </div>
  );
}
