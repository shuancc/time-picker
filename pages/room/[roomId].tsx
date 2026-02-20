import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RoomPage() {
  const router = useRouter();
  const { roomId, participant_id } = router.query as { roomId: string; participant_id: string };

  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    if (!roomId) return;

    fetch(`/api/get-room?room_id=${roomId}`)
      .then((res) => res.json())
      .then((data) => setRoom(data.room));
  }, [roomId]);

  if (!room) return <div>Loading 房間資料...</div>;

  return (
    <div>
      <h1>房間：{room.name}</h1>
      <p>房間日期範圍：{room.start_date} ~ {room.end_date}</p>
      <p>你的參與者 ID：{participant_id}</p>
      <p>這裡可以開始顯示大家的時間表了</p>
    </div>
  );
}
