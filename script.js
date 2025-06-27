
// 공간별 기본 단가 (평당 만원)
const basePrices = {
    living: 80,    // 거실
    bedroom: 70,   // 침실
    kitchen: 120,  // 주방
    bathroom: 150, // 욕실
    office: 90     // 사무실
};

// 작업 종류별 배수
const workTypeMultipliers = {
    basic: 1.0,     // 기본 도배/장판
    premium: 1.8,   // 프리미엄 마감재
    luxury: 2.5,    // 럭셔리 인테리어
    full: 3.5       // 풀 리모델링
};

// 추가 옵션 비용
const additionalOptions = {
    lighting: 50,    // 조명 공사 (만원)
    electrical: 100, // 전기 공사 (만원)
    plumbing: 150,   // 배관 공사 (만원)
    flooring: 20     // 바닥재 교체 (평당 만원)
};

// DOM 요소 선택
const roomTypeSelect = document.getElementById('roomType');
const areaInput = document.getElementById('area');
const workTypeSelect = document.getElementById('workType');
const calculateBtn = document.getElementById('calculateBtn');
const resultSection = document.getElementById('resultSection');
const basicCostSpan = document.getElementById('basicCost');
const optionCostSpan = document.getElementById('optionCost');
const totalCostSpan = document.getElementById('totalCost');

// 체크박스 요소들
const checkboxes = {
    lighting: document.getElementById('lighting'),
    electrical: document.getElementById('electrical'),
    plumbing: document.getElementById('plumbing'),
    flooring: document.getElementById('flooring')
};

// 숫자를 원화 형식으로 포맷팅
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

// 기본 공사비 계산
function calculateBasicCost() {
    const roomType = roomTypeSelect.value;
    const area = parseFloat(areaInput.value) || 0;
    const workType = workTypeSelect.value;
    
    const basePrice = basePrices[roomType];
    const multiplier = workTypeMultipliers[workType];
    
    return Math.round(basePrice * area * multiplier * 10000); // 만원을 원으로 변환
}

// 추가 옵션 비용 계산
function calculateOptionCost() {
    const area = parseFloat(areaInput.value) || 0;
    let totalOptionCost = 0;
    
    // 각 체크박스 확인
    for (const [optionName, checkbox] of Object.entries(checkboxes)) {
        if (checkbox.checked) {
            if (optionName === 'flooring') {
                // 바닥재는 평당 계산
                totalOptionCost += additionalOptions[optionName] * area * 10000;
            } else {
                // 나머지는 고정 비용
                totalOptionCost += additionalOptions[optionName] * 10000;
            }
        }
    }
    
    return Math.round(totalOptionCost);
}

// 견적 계산 및 표시
function calculateEstimate() {
    const area = parseFloat(areaInput.value);
    
    // 입력 값 검증
    if (!area || area <= 0) {
        alert('올바른 면적을 입력해주세요.');
        areaInput.focus();
        return;
    }
    
    if (area > 100) {
        alert('100평 이하의 면적을 입력해주세요.');
        areaInput.focus();
        return;
    }
    
    // 비용 계산
    const basicCost = calculateBasicCost();
    const optionCost = calculateOptionCost();
    const totalCost = basicCost + optionCost;
    
    // 결과 표시
    basicCostSpan.textContent = formatCurrency(basicCost);
    optionCostSpan.textContent = formatCurrency(optionCost);
    totalCostSpan.textContent = formatCurrency(totalCost);
    
    // 결과 섹션 표시
    resultSection.classList.add('show');
    
    // 결과 섹션으로 스크롤
    resultSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// 실시간 계산 (입력값이 변경될 때마다)
function handleInputChange() {
    const area = parseFloat(areaInput.value);
    
    if (area && area > 0 && area <= 100) {
        calculateEstimate();
    }
}

// 이벤트 리스너 등록
calculateBtn.addEventListener('click', calculateEstimate);

// 입력값 변경 시 실시간 계산
areaInput.addEventListener('input', handleInputChange);
roomTypeSelect.addEventListener('change', handleInputChange);
workTypeSelect.addEventListener('change', handleInputChange);

// 체크박스 변경 시 실시간 계산
Object.values(checkboxes).forEach(checkbox => {
    checkbox.addEventListener('change', handleInputChange);
});

// 엔터 키로 계산
areaInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateEstimate();
    }
});

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', function() {
    // 기본값 설정
    areaInput.value = '';
    roomTypeSelect.value = 'living';
    workTypeSelect.value = 'basic';
    
    // 모든 체크박스 해제
    Object.values(checkboxes).forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 결과 섹션 숨김
    resultSection.classList.remove('show');
    
    // 면적 입력 필드에 포커스
    areaInput.focus();
});

// 모바일에서 숫자 키패드 표시
areaInput.setAttribute('inputmode', 'decimal');
