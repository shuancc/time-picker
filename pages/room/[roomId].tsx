import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function RoomPage() {
  const router = useRouter()
  const { roomId, participant_id } = router.query

  const [room, setRoom] = useState<any>(null)

  useEffect(() => {
    if (!roomId) return
    fetch(`/api/get-room?room_id=${roomId}`)
      .then((res) => res.json())
      .then((data) => setRoom(data.room))
  }, [roomId])

  if (!room) return <div>載入中...</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>房間：{room.name}</h1>
      <p>
        日期：{room.start_date} ～ {room.end_date}
      </p>
      <p>你的 participant ID：{participant_id}</p>
      <div>（後面可以加時間表功能）</div>
    </div>
  )
}
