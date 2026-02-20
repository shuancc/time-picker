import { useState } from "react";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = async () => {
    const res = await fetch("/api/join-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_id: roomId, participant_name: name }),
    });
    const data = await res.json();
    if (data.participant?.id) setJoined(true);
  };

  if (joined) return <h2>加入房間成功！</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>加入房間</h1>
      <input placeholder="房間 ID" value={roomId} onChange={e => setRoomId(e.target.value)} />
      <input placeholder="你的名字" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={joinRoom}>加入房間</button>
    </div>
  );
}
