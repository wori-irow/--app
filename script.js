
// 기본 단가 설정 (localStorage에서 불러오거나 기본값 사용)
let unitPrices = {
    // 도배
    wallpaper_silk: 15000,      // 실크 도배 (평당)
    wallpaper_composite: 12000, // 합지 도배 (평당)
    
    // 바닥재
    flooring_laminate: 80000,   // 강마루 (평당)
    flooring_vinyl: 45000,      // 장판 (평당)
    
    // 천장
    ceiling_standard: 25000,    // 일반 천장 (평당)
    ceiling_fireproof: 35000,   // 방염 천장 (평당)
    
    // 몰딩
    molding_standard: 8000,     // 일반 몰딩 (미터당)
    molding_premium: 15000,     // 고급 몰딩 (미터당)
    
    // 조명
    lighting: 50000,            // 조명 (개당)
    
    // 전기공사
    outlet: 25000,              // 콘센트 (개당)
    switch: 20000,              // 스위치 (개당)
    electrical_per_area: 30000, // 전기공사 평당 단가
    
    // 목공
    partition_work: 200000,     // 가벽 시공
    door_frame_work: 80000,     // 문틀 보수
    
    // 문 교체
    room_door: 150000,          // 방문
    entrance_door: 400000,      // 현관문
    
    // 욕실 리모델링
    bathroom_full: 3000000,     // 욕실 전체
    bathroom_partial: 1000000,  // 욕실 부분
    
    // 샷시
    window_room: 300000,        // 방샷시 (개당)
    window_living: 500000,      // 거실샷시 (개당)
    
    // 섬 지역 추가 비용
    island_daily_cost: 100000   // 하루 체류비용
};

// 관리자 관련 변수
let isAdminMode = false;
const defaultPassword = 'admin123';

// DOM 요소들
const adminModeBtn = document.getElementById('adminModeBtn');
const adminPanel = document.getElementById('adminPanel');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const estimateTableBody = document.getElementById('estimateTableBody');
const totalAmount = document.getElementById('totalAmount');
const islandWorkCheckbox = document.getElementById('island-work');
const islandDaysInput = document.getElementById('island-days-input');

// 초기화 함수
function init() {
    loadStoredData();
    setupEventListeners();
    calculateEstimate();
    setupAdminControls();
}

// localStorage에서 데이터 로드
function loadStoredData() {
    const storedPrices = localStorage.getItem('unitPrices');
    if (storedPrices) {
        unitPrices = { ...unitPrices, ...JSON.parse(storedPrices) };
    }
}

// localStorage에 데이터 저장
function saveData() {
    localStorage.setItem('unitPrices', JSON.stringify(unitPrices));
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 관리자 모드 버튼
    adminModeBtn.addEventListener('click', toggleAdminMode);
    
    // 비밀번호 변경 버튼
    changePasswordBtn.addEventListener('click', changePassword);
    
    // 섬 지역 시공 체크박스
    islandWorkCheckbox.addEventListener('change', function() {
        if (this.checked) {
            islandDaysInput.classList.remove('hidden');
        } else {
            islandDaysInput.classList.add('hidden');
            document.getElementById('island-days').value = '';
        }
        calculateEstimate();
    });
    
    // 모든 입력 필드에 이벤트 리스너 추가
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', calculateEstimate);
        input.addEventListener('input', calculateEstimate);
    });
    
    // 액션 버튼들
    document.getElementById('copyEstimateBtn').addEventListener('click', copyEstimate);
    document.getElementById('printEstimateBtn').addEventListener('click', printEstimate);
}

// 관리자 모드 토글
function toggleAdminMode() {
    if (isAdminMode) {
        // 관리자 모드 해제
        isAdminMode = false;
        adminPanel.classList.add('hidden');
        adminModeBtn.textContent = '관리자 모드';
        adminModeBtn.style.background = 'rgba(255,255,255,0.2)';
    } else {
        // 관리자 모드 진입 시도
        const storedPassword = localStorage.getItem('adminPassword') || defaultPassword;
        const inputPassword = prompt('관리자 비밀번호를 입력하세요:');
        
        if (inputPassword === storedPassword) {
            isAdminMode = true;
            adminPanel.classList.remove('hidden');
            adminModeBtn.textContent = '관리자 모드 해제';
            adminModeBtn.style.background = 'rgba(231,76,60,0.8)';
            setupAdminControls();
        } else if (inputPassword !== null) {
            alert('비밀번호가 틀렸습니다.');
        }
    }
}

// 비밀번호 변경
function changePassword() {
    const currentPassword = localStorage.getItem('adminPassword') || defaultPassword;
    const inputCurrentPassword = prompt('현재 비밀번호를 입력하세요:');
    
    if (inputCurrentPassword !== currentPassword) {
        alert('현재 비밀번호가 틀렸습니다.');
        return;
    }
    
    const newPassword = prompt('새 비밀번호를 입력하세요:');
    if (!newPassword) {
        alert('비밀번호가 입력되지 않았습니다.');
        return;
    }
    
    const confirmPassword = prompt('새 비밀번호를 다시 입력하세요:');
    if (newPassword !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    localStorage.setItem('adminPassword', newPassword);
    alert('비밀번호가 성공적으로 변경되었습니다.');
}

// 관리자 단가 설정 UI 생성
function setupAdminControls() {
    const adminControls = document.querySelector('.admin-controls');
    const controlsDiv = adminControls.querySelector('div') || document.createElement('div');
    
    controlsDiv.innerHTML = '';
    
    const priceLabels = {
        wallpaper_silk: '실크 도배 (평당)',
        wallpaper_composite: '합지 도배 (평당)',
        flooring_laminate: '강마루 (평당)',
        flooring_vinyl: '장판 (평당)',
        ceiling_standard: '일반 천장 (평당)',
        ceiling_fireproof: '방염 천장 (평당)',
        molding_standard: '일반 몰딩 (미터당)',
        molding_premium: '고급 몰딩 (미터당)',
        lighting: '조명 (개당)',
        outlet: '콘센트 (개당)',
        switch: '스위치 (개당)',
        electrical_per_area: '전기공사 (평당)',
        partition_work: '가벽 시공',
        door_frame_work: '문틀 보수',
        room_door: '방문',
        entrance_door: '현관문',
        bathroom_full: '욕실 전체',
        bathroom_partial: '욕실 부분',
        window_room: '방샷시 (개당)',
        window_living: '거실샷시 (개당)',
        island_daily_cost: '섬 지역 하루 체류비용'
    };
    
    Object.keys(unitPrices).forEach(key => {
        const div = document.createElement('div');
        div.className = 'price-control';
        
        const label = document.createElement('label');
        label.textContent = priceLabels[key] || key;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.value = unitPrices[key];
        input.addEventListener('change', function() {
            unitPrices[key] = parseInt(this.value) || 0;
            saveData();
            calculateEstimate();
        });
        
        const span = document.createElement('span');
        span.textContent = '원';
        
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(span);
        controlsDiv.appendChild(div);
    });
    
    if (!adminControls.querySelector('div')) {
        adminControls.appendChild(controlsDiv);
    }
}

// 견적 계산 함수
function calculateEstimate() {
    const estimates = [];
    let total = 0;
    
    // 1. 도배
    const wallpaperType = document.getElementById('wallpaper-type').value;
    const wallpaperArea = parseFloat(document.getElementById('wallpaper-area').value) || 0;
    
    if (wallpaperType && wallpaperArea > 0) {
        const priceKey = `wallpaper_${wallpaperType}`;
        const unitPrice = unitPrices[priceKey];
        const amount = unitPrice * wallpaperArea;
        estimates.push({
            item: '도배',
            detail: wallpaperType === 'silk' ? '실크' : '합지',
            unitPrice: unitPrice,
            quantity: wallpaperArea + '평',
            amount: amount
        });
        total += amount;
    }
    
    // 2. 바닥재
    const flooringType = document.getElementById('flooring-type').value;
    const flooringArea = parseFloat(document.getElementById('flooring-area').value) || 0;
    
    if (flooringType && flooringArea > 0) {
        const priceKey = `flooring_${flooringType}`;
        const unitPrice = unitPrices[priceKey];
        const amount = unitPrice * flooringArea;
        estimates.push({
            item: '바닥재',
            detail: flooringType === 'laminate' ? '강마루' : '장판',
            unitPrice: unitPrice,
            quantity: flooringArea + '평',
            amount: amount
        });
        total += amount;
    }
    
    // 3. 천장
    const ceilingType = document.getElementById('ceiling-type').value;
    const ceilingArea = parseFloat(document.getElementById('ceiling-area').value) || 0;
    
    if (ceilingType && ceilingArea > 0) {
        const priceKey = `ceiling_${ceilingType}`;
        const unitPrice = unitPrices[priceKey];
        const amount = unitPrice * ceilingArea;
        estimates.push({
            item: '천장',
            detail: ceilingType === 'standard' ? '일반' : '방염',
            unitPrice: unitPrice,
            quantity: ceilingArea + '평',
            amount: amount
        });
        total += amount;
    }
    
    // 4. 몰딩
    const moldingType = document.getElementById('molding-type').value;
    const moldingLength = parseFloat(document.getElementById('molding-length').value) || 0;
    
    if (moldingType && moldingLength > 0) {
        const priceKey = `molding_${moldingType}`;
        const unitPrice = unitPrices[priceKey];
        const amount = unitPrice * moldingLength;
        estimates.push({
            item: '몰딩',
            detail: moldingType === 'standard' ? '일반' : '고급',
            unitPrice: unitPrice,
            quantity: moldingLength + 'm',
            amount: amount
        });
        total += amount;
    }
    
    // 5. 조명
    const lightingCount = parseInt(document.getElementById('lighting-count').value) || 0;
    
    if (lightingCount > 0) {
        const unitPrice = unitPrices.lighting;
        const amount = unitPrice * lightingCount;
        estimates.push({
            item: '조명',
            detail: '일반',
            unitPrice: unitPrice,
            quantity: lightingCount + '개',
            amount: amount
        });
        total += amount;
    }
    
    // 6. 전기공사
    const outletCount = parseInt(document.getElementById('outlet-count').value) || 0;
    const switchCount = parseInt(document.getElementById('switch-count').value) || 0;
    const electricalArea = parseFloat(document.getElementById('electrical-area').value) || 0;
    
    if (outletCount > 0) {
        const unitPrice = unitPrices.outlet;
        const amount = unitPrice * outletCount;
        estimates.push({
            item: '전기공사',
            detail: '콘센트',
            unitPrice: unitPrice,
            quantity: outletCount + '개',
            amount: amount
        });
        total += amount;
    }
    
    if (switchCount > 0) {
        const unitPrice = unitPrices.switch;
        const amount = unitPrice * switchCount;
        estimates.push({
            item: '전기공사',
            detail: '스위치',
            unitPrice: unitPrice,
            quantity: switchCount + '개',
            amount: amount
        });
        total += amount;
    }
    
    if (electricalArea > 0) {
        const unitPrice = unitPrices.electrical_per_area;
        const amount = unitPrice * electricalArea;
        estimates.push({
            item: '전기공사',
            detail: '평당 공사비',
            unitPrice: unitPrice,
            quantity: electricalArea + '평',
            amount: amount
        });
        total += amount;
    }
    
    // 7. 목공
    if (document.getElementById('partition-work').checked) {
        const amount = unitPrices.partition_work;
        estimates.push({
            item: '목공',
            detail: '가벽 시공',
            unitPrice: amount,
            quantity: '1식',
            amount: amount
        });
        total += amount;
    }
    
    if (document.getElementById('door-frame-work').checked) {
        const amount = unitPrices.door_frame_work;
        estimates.push({
            item: '목공',
            detail: '문틀 보수',
            unitPrice: amount,
            quantity: '1식',
            amount: amount
        });
        total += amount;
    }
    
    // 8. 문 교체
    if (document.getElementById('room-door').checked) {
        const amount = unitPrices.room_door;
        estimates.push({
            item: '문 교체',
            detail: '방문',
            unitPrice: amount,
            quantity: '1개',
            amount: amount
        });
        total += amount;
    }
    
    if (document.getElementById('entrance-door').checked) {
        const amount = unitPrices.entrance_door;
        estimates.push({
            item: '문 교체',
            detail: '현관문',
            unitPrice: amount,
            quantity: '1개',
            amount: amount
        });
        total += amount;
    }
    
    // 9. 욕실 리모델링
    if (document.getElementById('bathroom-full').checked) {
        const amount = unitPrices.bathroom_full;
        estimates.push({
            item: '욕실 리모델링',
            detail: '전체',
            unitPrice: amount,
            quantity: '1식',
            amount: amount
        });
        total += amount;
    }
    
    if (document.getElementById('bathroom-partial').checked) {
        const amount = unitPrices.bathroom_partial;
        estimates.push({
            item: '욕실 리모델링',
            detail: '부분',
            unitPrice: amount,
            quantity: '1식',
            amount: amount
        });
        total += amount;
    }
    
    // 10. 샷시
    const windowType = document.getElementById('window-type').value;
    const windowCount = parseInt(document.getElementById('window-count').value) || 0;
    
    if (windowType && windowCount > 0) {
        const priceKey = `window_${windowType}`;
        const unitPrice = unitPrices[priceKey];
        const amount = unitPrice * windowCount;
        estimates.push({
            item: '샷시',
            detail: windowType === 'room' ? '방샷시' : '거실샷시',
            unitPrice: unitPrice,
            quantity: windowCount + '개',
            amount: amount
        });
        total += amount;
    }
    
    // 11. 섬 지역 시공
    if (document.getElementById('island-work').checked) {
        const islandDays = parseInt(document.getElementById('island-days').value) || 0;
        if (islandDays > 0) {
            const unitPrice = unitPrices.island_daily_cost;
            const amount = unitPrice * islandDays;
            estimates.push({
                item: '섬 지역 시공',
                detail: '체류비용',
                unitPrice: unitPrice,
                quantity: islandDays + '일',
                amount: amount
            });
            total += amount;
        }
    }
    
    // 테이블 업데이트
    updateEstimateTable(estimates, total);
}

// 견적 테이블 업데이트
function updateEstimateTable(estimates, total) {
    estimateTableBody.innerHTML = '';
    
    estimates.forEach(estimate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${estimate.item}</td>
            <td>${estimate.detail}</td>
            <td>${formatNumber(estimate.unitPrice)}원</td>
            <td>${estimate.quantity}</td>
            <td>${formatNumber(estimate.amount)}원</td>
        `;
        estimateTableBody.appendChild(row);
    });
    
    totalAmount.innerHTML = `<strong>${formatNumber(total)}원</strong>`;
}

// 숫자 포맷팅 (천 단위 구분자)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 견적서 복사
function copyEstimate() {
    let estimateText = '=== 인테리어 견적서 ===\n\n';
    estimateText += '항목\t세부사항\t단가\t수량\t금액\n';
    estimateText += '----------------------------------------\n';
    
    const rows = estimateTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 5) {
            estimateText += `${cells[0].textContent}\t${cells[1].textContent}\t${cells[2].textContent}\t${cells[3].textContent}\t${cells[4].textContent}\n`;
        }
    });
    
    estimateText += '----------------------------------------\n';
    estimateText += `총 견적 금액: ${totalAmount.textContent}\n\n`;
    estimateText += `작성일: ${new Date().toLocaleDateString('ko-KR')}\n`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(estimateText).then(() => {
            alert('견적서가 클립보드에 복사되었습니다.');
        }).catch(() => {
            fallbackCopy(estimateText);
        });
    } else {
        fallbackCopy(estimateText);
    }
}

// 클립보드 복사 대체 방법
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('견적서가 클립보드에 복사되었습니다.');
    } catch (err) {
        alert('복사 기능을 지원하지 않는 브라우저입니다.');
    }
    
    document.body.removeChild(textArea);
}

// PDF 저장/인쇄
function printEstimate() {
    window.print();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);

