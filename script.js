
// 기본 단가 정의 (localStorage에서 불러오거나 기본값 사용)
let prices = {
    wallpaper: {
        silk: 50000,      // 실크 도배 (평당)
        synthetic: 35000  // 합지 도배 (평당)
    },
    flooring: {
        hardwood: 80000,  // 강마루 (평당)
        vinyl: 45000      // 장판 (평당)
    },
    ceiling: {
        normal: 40000,    // 일반 천장 (평당)
        fireproof: 55000  // 방염 천장 (평당)
    },
    molding: {
        normal: 15000,    // 일반 몰딩 (미터당)
        premium: 25000    // 고급 몰딩 (미터당)
    },
    lighting: 150000,     // 조명 (개당)
    electrical: {
        outlet: 20000,    // 콘센트 (개당)
        switch: 15000,    // 스위치 (개당)
        perArea: 50000    // 전기공사 평당 단가
    },
    woodwork: {
        partitionWall: 500000,  // 가벽 시공
        doorFrameRepair: 200000 // 문틀 보수
    },
    door: {
        room: 400000,     // 방문 교체
        entrance: 800000  // 현관문 교체
    },
    bathroom: {
        full: 3000000,    // 욕실 전체 리모델링
        partial: 1500000  // 욕실 부분 리모델링
    },
    window: {
        room: 300000,     // 방샷시 (개당)
        living: 500000    // 거실샷시 (개당)
    },
    island: {
        dailyRate: 100000 // 섬 지역 하루 체류비
    }
};

// 관리자 모드 상태
let isAdminMode = false;
let adminPassword = localStorage.getItem('adminPassword') || '1234';

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadPricesFromStorage();
    setupEventListeners();
    calculateEstimate();
});

// localStorage에서 단가 정보 로드
function loadPricesFromStorage() {
    const savedPrices = localStorage.getItem('interiorPrices');
    if (savedPrices) {
        prices = JSON.parse(savedPrices);
    }
}

// localStorage에 단가 정보 저장
function savePricesToStorage() {
    localStorage.setItem('interiorPrices', JSON.stringify(prices));
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 모든 입력 필드에 change 이벤트 추가
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', calculateEstimate);
        input.addEventListener('input', calculateEstimate);
    });

    // 섬 지역 시공 체크박스 이벤트
    document.getElementById('islandWork').addEventListener('change', function() {
        const stayDaysRow = document.getElementById('stayDaysRow');
        if (this.checked) {
            stayDaysRow.classList.remove('hidden');
        } else {
            stayDaysRow.classList.add('hidden');
            document.getElementById('stayDays').value = '';
        }
        calculateEstimate();
    });

    // 관리자 모드 버튼
    document.getElementById('adminModeBtn').addEventListener('click', toggleAdminMode);
    document.getElementById('exitAdminBtn').addEventListener('click', exitAdminMode);
    document.getElementById('changePasswordBtn').addEventListener('click', changePassword);

    // 액션 버튼들
    document.getElementById('copyEstimateBtn').addEventListener('click', copyEstimate);
    document.getElementById('saveAsPdfBtn').addEventListener('click', saveAsPdf);
}

// 견적 계산 함수
function calculateEstimate() {
    const estimateBody = document.getElementById('estimateBody');
    const totalAmountElement = document.getElementById('totalAmount');
    
    estimateBody.innerHTML = '';
    let totalAmount = 0;

    // 도배
    const wallpaperType = document.getElementById('wallpaperType').value;
    const wallpaperArea = parseFloat(document.getElementById('wallpaperArea').value) || 0;
    if (wallpaperType && wallpaperArea > 0) {
        const price = prices.wallpaper[wallpaperType];
        const subtotal = price * wallpaperArea;
        addEstimateRow('도배', getTypeName('wallpaper', wallpaperType), price, wallpaperArea + '평', subtotal);
        totalAmount += subtotal;
    }

    // 바닥재
    const flooringType = document.getElementById('flooringType').value;
    const flooringArea = parseFloat(document.getElementById('flooringArea').value) || 0;
    if (flooringType && flooringArea > 0) {
        const price = prices.flooring[flooringType];
        const subtotal = price * flooringArea;
        addEstimateRow('바닥재', getTypeName('flooring', flooringType), price, flooringArea + '평', subtotal);
        totalAmount += subtotal;
    }

    // 천장
    const ceilingType = document.getElementById('ceilingType').value;
    const ceilingArea = parseFloat(document.getElementById('ceilingArea').value) || 0;
    if (ceilingType && ceilingArea > 0) {
        const price = prices.ceiling[ceilingType];
        const subtotal = price * ceilingArea;
        addEstimateRow('천장', getTypeName('ceiling', ceilingType), price, ceilingArea + '평', subtotal);
        totalAmount += subtotal;
    }

    // 몰딩
    const moldingType = document.getElementById('moldingType').value;
    const moldingLength = parseFloat(document.getElementById('moldingLength').value) || 0;
    if (moldingType && moldingLength > 0) {
        const price = prices.molding[moldingType];
        const subtotal = price * moldingLength;
        addEstimateRow('몰딩', getTypeName('molding', moldingType), price, moldingLength + 'm', subtotal);
        totalAmount += subtotal;
    }

    // 조명
    const lightingCount = parseInt(document.getElementById('lightingCount').value) || 0;
    if (lightingCount > 0) {
        const price = prices.lighting;
        const subtotal = price * lightingCount;
        addEstimateRow('조명', '조명 설치', price, lightingCount + '개', subtotal);
        totalAmount += subtotal;
    }

    // 전기공사
    const outletCount = parseInt(document.getElementById('outletCount').value) || 0;
    const switchCount = parseInt(document.getElementById('switchCount').value) || 0;
    const electricalArea = parseFloat(document.getElementById('electricalArea').value) || 0;

    if (outletCount > 0) {
        const subtotal = prices.electrical.outlet * outletCount;
        addEstimateRow('전기공사', '콘센트', prices.electrical.outlet, outletCount + '개', subtotal);
        totalAmount += subtotal;
    }

    if (switchCount > 0) {
        const subtotal = prices.electrical.switch * switchCount;
        addEstimateRow('전기공사', '스위치', prices.electrical.switch, switchCount + '개', subtotal);
        totalAmount += subtotal;
    }

    if (electricalArea > 0) {
        const subtotal = prices.electrical.perArea * electricalArea;
        addEstimateRow('전기공사', '전기공사 (평당)', prices.electrical.perArea, electricalArea + '평', subtotal);
        totalAmount += subtotal;
    }

    // 목공
    if (document.getElementById('partitionWall').checked) {
        addEstimateRow('목공', '가벽 시공', prices.woodwork.partitionWall, '1식', prices.woodwork.partitionWall);
        totalAmount += prices.woodwork.partitionWall;
    }

    if (document.getElementById('doorFrameRepair').checked) {
        addEstimateRow('목공', '문틀 보수', prices.woodwork.doorFrameRepair, '1식', prices.woodwork.doorFrameRepair);
        totalAmount += prices.woodwork.doorFrameRepair;
    }

    // 문 교체
    if (document.getElementById('roomDoor').checked) {
        addEstimateRow('문 교체', '방문', prices.door.room, '1식', prices.door.room);
        totalAmount += prices.door.room;
    }

    if (document.getElementById('entranceDoor').checked) {
        addEstimateRow('문 교체', '현관문', prices.door.entrance, '1식', prices.door.entrance);
        totalAmount += prices.door.entrance;
    }

    // 욕실 리모델링
    const bathroomType = document.getElementById('bathroomType').value;
    if (bathroomType) {
        const price = prices.bathroom[bathroomType];
        addEstimateRow('욕실 리모델링', getTypeName('bathroom', bathroomType), price, '1식', price);
        totalAmount += price;
    }

    // 샷시
    const windowType = document.getElementById('windowType').value;
    const windowCount = parseInt(document.getElementById('windowCount').value) || 0;
    if (windowType && windowCount > 0) {
        const price = prices.window[windowType];
        const subtotal = price * windowCount;
        addEstimateRow('샷시', getTypeName('window', windowType), price, windowCount + '개', subtotal);
        totalAmount += subtotal;
    }

    // 섬 지역 시공
    if (document.getElementById('islandWork').checked) {
        const stayDays = parseInt(document.getElementById('stayDays').value) || 0;
        if (stayDays > 0) {
            const price = prices.island.dailyRate;
            const subtotal = price * stayDays;
            addEstimateRow('섬 지역 시공', '체류비', price, stayDays + '일', subtotal);
            totalAmount += subtotal;
        }
    }

    // 총 금액 표시
    totalAmountElement.textContent = formatCurrency(totalAmount);
}

// 견적 테이블에 행 추가
function addEstimateRow(category, detail, unitPrice, quantity, subtotal) {
    const tbody = document.getElementById('estimateBody');
    const row = document.createElement('tr');
    row.className = 'fade-in';
    
    row.innerHTML = `
        <td>${category}</td>
        <td>${detail}</td>
        <td>${formatCurrency(unitPrice)}</td>
        <td>${quantity}</td>
        <td>${formatCurrency(subtotal)}</td>
    `;
    
    tbody.appendChild(row);
}

// 타입명 변환
function getTypeName(category, type) {
    const typeNames = {
        wallpaper: { silk: '실크', synthetic: '합지' },
        flooring: { hardwood: '강마루', vinyl: '장판' },
        ceiling: { normal: '일반', fireproof: '방염' },
        molding: { normal: '일반', premium: '고급' },
        bathroom: { full: '전체', partial: '부분' },
        window: { room: '방샷시', living: '거실샷시' }
    };
    
    return typeNames[category] ? typeNames[category][type] : type;
}

// 통화 형식으로 변환
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount);
}

// 관리자 모드 토글
function toggleAdminMode() {
    if (isAdminMode) {
        exitAdminMode();
        return;
    }

    const inputPassword = prompt('관리자 비밀번호를 입력하세요:');
    if (inputPassword === adminPassword) {
        isAdminMode = true;
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('adminModeBtn').textContent = '관리자 모드 (활성)';
        document.getElementById('adminModeBtn').style.background = '#28a745';
        setupPriceSettings();
    } else if (inputPassword !== null) {
        alert('비밀번호가 올바르지 않습니다.');
    }
}

// 관리자 모드 종료
function exitAdminMode() {
    isAdminMode = false;
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('adminModeBtn').textContent = '관리자 모드';
    document.getElementById('adminModeBtn').style.background = 'rgba(255,255,255,0.2)';
}

// 단가 설정 UI 생성
function setupPriceSettings() {
    const container = document.getElementById('priceSettings');
    container.innerHTML = '';

    const priceItems = [
        { category: 'wallpaper', key: 'silk', label: '도배 - 실크 (평당)' },
        { category: 'wallpaper', key: 'synthetic', label: '도배 - 합지 (평당)' },
        { category: 'flooring', key: 'hardwood', label: '바닥재 - 강마루 (평당)' },
        { category: 'flooring', key: 'vinyl', label: '바닥재 - 장판 (평당)' },
        { category: 'ceiling', key: 'normal', label: '천장 - 일반 (평당)' },
        { category: 'ceiling', key: 'fireproof', label: '천장 - 방염 (평당)' },
        { category: 'molding', key: 'normal', label: '몰딩 - 일반 (미터당)' },
        { category: 'molding', key: 'premium', label: '몰딩 - 고급 (미터당)' },
        { category: null, key: 'lighting', label: '조명 (개당)' },
        { category: 'electrical', key: 'outlet', label: '전기공사 - 콘센트 (개당)' },
        { category: 'electrical', key: 'switch', label: '전기공사 - 스위치 (개당)' },
        { category: 'electrical', key: 'perArea', label: '전기공사 - 평당 단가' },
        { category: 'woodwork', key: 'partitionWall', label: '목공 - 가벽 시공' },
        { category: 'woodwork', key: 'doorFrameRepair', label: '목공 - 문틀 보수' },
        { category: 'door', key: 'room', label: '문 교체 - 방문' },
        { category: 'door', key: 'entrance', label: '문 교체 - 현관문' },
        { category: 'bathroom', key: 'full', label: '욕실 리모델링 - 전체' },
        { category: 'bathroom', key: 'partial', label: '욕실 리모델링 - 부분' },
        { category: 'window', key: 'room', label: '샷시 - 방샷시 (개당)' },
        { category: 'window', key: 'living', label: '샷시 - 거실샷시 (개당)' },
        { category: 'island', key: 'dailyRate', label: '섬 지역 - 하루 체류비' }
    ];

    priceItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'price-item';
        
        const currentPrice = item.category ? prices[item.category][item.key] : prices[item.key];
        
        div.innerHTML = `
            <label>${item.label}</label>
            <input type="number" value="${currentPrice}" 
                   data-category="${item.category}" 
                   data-key="${item.key}"
                   onchange="updatePrice(this)">
        `;
        
        container.appendChild(div);
    });
}

// 단가 업데이트
function updatePrice(input) {
    const category = input.dataset.category;
    const key = input.dataset.key;
    const value = parseInt(input.value) || 0;

    if (category) {
        prices[category][key] = value;
    } else {
        prices[key] = value;
    }

    savePricesToStorage();
    calculateEstimate();
}

// 비밀번호 변경
function changePassword() {
    const currentPassword = prompt('현재 비밀번호를 입력하세요:');
    if (currentPassword !== adminPassword) {
        alert('현재 비밀번호가 올바르지 않습니다.');
        return;
    }

    const newPassword = prompt('새 비밀번호를 입력하세요:');
    if (!newPassword) {
        return;
    }

    const confirmPassword = prompt('새 비밀번호를 다시 입력하세요:');
    if (newPassword !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    adminPassword = newPassword;
    localStorage.setItem('adminPassword', adminPassword);
    alert('비밀번호가 성공적으로 변경되었습니다.');
}

// 견적서 복사
function copyEstimate() {
    const table = document.getElementById('estimateTable');
    const totalAmount = document.getElementById('totalAmount').textContent;
    
    let text = '🏠 인테리어 견적서\n\n';
    text += '==========================================\n';
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        text += `${cells[0].textContent} - ${cells[1].textContent}\n`;
        text += `  단가: ${cells[2].textContent} × ${cells[3].textContent} = ${cells[4].textContent}\n\n`;
    });
    
    text += '==========================================\n';
    text += `총 견적 금액: ${totalAmount}\n`;
    text += '==========================================\n';
    text += `생성일: ${new Date().toLocaleDateString('ko-KR')}`;

    navigator.clipboard.writeText(text).then(() => {
        alert('견적서가 클립보드에 복사되었습니다.');
    }).catch(() => {
        alert('복사에 실패했습니다. 브라우저에서 복사 기능을 지원하지 않습니다.');
    });
}

// PDF 저장 (간단한 print 기능으로 대체)
function saveAsPdf() {
    // 인쇄용 스타일을 추가하여 PDF로 저장할 수 있도록 함
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            body * { visibility: hidden; }
            .result-section, .result-section * { visibility: visible; }
            .result-section { position: absolute; top: 0; left: 0; }
            .action-buttons { display: none; }
            #adminPanel { display: none; }
            header { display: none; }
            .input-section { display: none; }
        }
    `;
    document.head.appendChild(printStyle);
    
    window.print();
    
    // 인쇄 후 스타일 제거
    setTimeout(() => {
        document.head.removeChild(printStyle);
    }, 1000);
}

