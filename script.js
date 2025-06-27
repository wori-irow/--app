// 견적 리스트 저장용
const estimates = [];

const categoryMap = {
  wallpaper: "도배",
  flooring: "바닥재",
  ceiling: "천장",
  molding: "몰딩",
  lighting: "조명",
  electric: "전기",
  woodwork: "목공",
  door: "문 교체",
  bathroom: "욕실 리모델링",
  sash: "샷시"
};

function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateEstimateList() {
  const ul = document.getElementById("estimateItems");
  ul.innerHTML = "";

  let total = 0;
  estimates.forEach((item, idx) => {
    const li = document.createElement("li");
    li.textContent = `${categoryMap[item.category]} - 면적: ${item.area}㎡, 단가: ${formatPrice(item.price)}원, 합계: ${formatPrice(item.area * item.price)}원`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = () => {
      estimates.splice(idx, 1);
      updateEstimateList();
    };
    li.appendChild(delBtn);

    ul.appendChild(li);

    total += item.area * item.price;
  });

  document.getElementById("totalPrice").textContent = formatPrice(total);
}

document.getElementById("addEstimate").addEventListener("click", () => {
  const buildingType = document.getElementById("buildingType").value;
  const workType = document.getElementById("workType").value;
  const category = document.getElementById("category").value;
  const area = parseFloat(document.getElementById("area").value);
  const price = parseInt(document.getElementById("materialPrice").value, 10);

  if (!buildingType || !workType) {
    alert("건물 유형과 공사 유형을 선택하세요.");
    return;
  }
  if (!category) {
    alert("항목을 선택하세요.");
    return;
  }
  if (isNaN(area) || area <= 0) {
    alert("유효한 면적을 입력하세요.");
    return;
  }
  if (isNaN(price) || price <= 0) {
    alert("유효한 단가를 입력하세요.");
    return;
  }

  // 항목 추가
  estimates.push({ buildingType, workType, category, area, price });
  updateEstimateList();

  // 입력값 초기화 (면적, 단가만)
  document.getElementById("area").value = "";
  document.getElementById("materialPrice").value = "";
});
  
document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("모든 견적 항목을 삭제하시겠습니까?")) {
    estimates.length = 0;
    updateEstimateList();
  }
});

// 초기 렌더링
updateEstimateList();
