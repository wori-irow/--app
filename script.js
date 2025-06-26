function saveDiary() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const content = document.getElementById("diaryEntry").value;
  localStorage.setItem("diary_" + today, content);
  document.getElementById("statusMsg").textContent = `✅ ${today} 일기 저장됨`;
}

function loadDiary() {
  const today = new Date().toISOString().split("T")[0];
  const savedContent = localStorage.getItem("diary_" + today);
  if (savedContent) {
    document.getElementById("diaryEntry").value = savedContent;
    document.getElementById("statusMsg").textContent = `📖 ${today} 일기 불러옴`;
  } else {
    document.getElementById("statusMsg").textContent = `⚠️ ${today} 일기가 없습니다`;
  }
}

function clearDiary() {
  const today = new Date().toISOString().split("T")[0];
  localStorage.removeItem("diary_" + today);
  document.getElementById("diaryEntry").value = "";
  document.getElementById("statusMsg").textContent = `🗑️ ${today} 일기 삭제됨`;
}
