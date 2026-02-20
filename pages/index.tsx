import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [participantName, setParticipantName] = useState("");

  const createRoom = async () => {
    if (!roomName || !startDate || !endDate || !participantName) {
      alert("請填寫所有欄位");
      return;
    }

    const res = await fetch("/api/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, startDate, endDate, participantName }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/room/${data.room_id}?participant_id=${data.participant_id}`);
    } else {
      alert(data.message || "建立失敗");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>建立房間</h1>
      <input
        placeholder="房間名稱"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <input
        placeholder="你的名字"
        value={participantName}
        onChange={(e) => setParticipantName(e.target.value)}
      />
      <button onClick={createRoom}>建立房間</button>
    </div>
  );
}
