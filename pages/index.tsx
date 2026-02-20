const createRoom = async () => {
  try {
    const participant_id = crypto.randomUUID(); // 當作房主的 ID
    const res = await fetch("/api/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: roomName,         // 你頁面上的輸入值
        start_date,
        end_date,
        participant_id
      }),
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
