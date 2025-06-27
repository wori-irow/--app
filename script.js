
// 기본 관리자 정보
const ADMIN_CREDENTIALS = {
    id: 'suwon1234',
    password: '1234'
};

// 기본 가격 정보
const DEFAULT_PRICES = {
    '타일': 50000,
    '마루': 80000,
    '리놀륨': 30000,
    '일반벽지': 20000,
    '실크벽지': 35000,
    '페인트': 15000,
    'LED조명': 100000,
    '샹들리에': 300000,
    '스포트라이트': 50000,
    '기본시공': 200000,
    '고급시공': 350000
};

// 현재 가격 정보 (로컬 스토리지에서 불러오거나 기본값 사용)
let currentPrices = { ...DEFAULT_PRICES };

// DOM 요소들
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const adminSettingsModal = document.getElementById('adminSettingsModal');
const closeModal = document.querySelector('.close');
const closeSettingsModal = document.querySelector('.close-settings');
const adminLoginForm = document.getElementById('adminLogin');
const calculateBtn = document.getElementById('calculateBtn');
const totalAmountElement = document.getElementById('totalAmount');
const areaInput = document.getElementById('area');
const savePricesBtn = document.getElementById('savePrices');
const resetPricesBtn = document.getElementById('resetPrices');

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadPricesFromStorage();
    updatePriceLabels();
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    adminBtn.addEventListener('click', () => {
        adminModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    closeSettingsModal.addEventListener('click', () => {
        adminSettingsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === adminModal) {
            adminModal.style.display = 'none';
        }
        if (event.target === adminSettingsModal) {
            adminSettingsModal.style.display = 'none';
        }
    });

    adminLoginForm.addEventListener('submit', handleAdminLogin);
    calculateBtn.addEventListener('click', calculateTotal);
    savePricesBtn.addEventListener('click', savePrices);
    resetPricesBtn.addEventListener('click', resetPrices);

    // 실시간 계산을 위한 이벤트 리스너
    areaInput.addEventListener('input', calculateTotal);
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });
}

// 관리자 로그인 처리
function handleAdminLogin(event) {
    event.preventDefault();
    
    const id = document.getElementById('adminId').value;
    const password = document.getElementById('adminPassword').value;
    
    if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
        adminModal.style.display = 'none';
        adminSettingsModal.style.display = 'block';
        
        // 입력 필드 초기화
        document.getElementById('adminId').value = '';
        document.getElementById('adminPassword').value = '';
        
        // 현재 가격으로 설정창 업데이트
        updateAdminSettings();
        
        showNotification('관리자 로그인 성공', 'success');
    } else {
        showNotification('아이디 또는 비밀번호가 올바르지 않습니다.', 'error');
    }
}

// 견적 계산
function calculateTotal() {
    const area = parseFloat(areaInput.value) || 0;
    if (area <= 0) {
        totalAmountElement.textContent = '0';
        return;
    }

    let total = 0;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        const item = checkbox.dataset.item;
        const category = checkbox.dataset.category;
        const price = currentPrices[item];
        
        if (category === 'lighting') {
            // 조명은 개당 가격
            total += price;
        } else {
            // 나머지는 평당 가격
            total += price * area;
        }
    });

    totalAmountElement.textContent = total.toLocaleString();
}

// 가격 저장
function savePrices() {
    const priceInputs = document.querySelectorAll('.price-item input[type="number"]');
    
    priceInputs.forEach(input => {
        const item = input.id.replace('price-', '');
        const newPrice = parseInt(input.value) || 0;
        currentPrices[item] = newPrice;
    });
    
    // 로컬 스토리지에 저장
    localStorage.setItem('interiorPrices', JSON.stringify(currentPrices));
    
    // 화면의 가격 라벨 업데이트
    updatePriceLabels();
    
    // 현재 계산 업데이트
    calculateTotal();
    
    showNotification('가격이 성공적으로 저장되었습니다.', 'success');
}

// 가격 초기화
function resetPrices() {
    if (confirm('모든 가격을 기본값으로 재설정하시겠습니까?')) {
        currentPrices = { ...DEFAULT_PRICES };
        localStorage.setItem('interiorPrices', JSON.stringify(currentPrices));
        updatePriceLabels();
        updateAdminSettings();
        calculateTotal();
        showNotification('가격이 기본값으로 재설정되었습니다.', 'success');
    }
}

// 로컬 스토리지에서 가격 불러오기
function loadPricesFromStorage() {
    const savedPrices = localStorage.getItem('interiorPrices');
    if (savedPrices) {
        try {
            currentPrices = { ...DEFAULT_PRICES, ...JSON.parse(savedPrices) };
        } catch (error) {
            console.error('가격 데이터 로드 실패:', error);
            currentPrices = { ...DEFAULT_PRICES };
        }
    }
}

// 화면의 가격 라벨 업데이트
function updatePriceLabels() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        const item = checkbox.dataset.item;
        const category = checkbox.dataset.category;
        const price = currentPrices[item];
        const label = checkbox.parentElement;
        
        let unit = '';
        if (category === 'lighting') {
            unit = '개당';
        } else {
            unit = '평당';
        }
        
        const formattedPrice = price.toLocaleString();
        label.innerHTML = `<input type="checkbox" data-category="${category}" data-item="${item}" data-price="${price}"> ${item} (${unit} ${formattedPrice}원)`;
        
        // 체크박스 상태 유지
        const newCheckbox = label.querySelector('input[type="checkbox"]');
        newCheckbox.checked = checkbox.checked;
        newCheckbox.addEventListener('change', calculateTotal);
    });
}

// 관리자 설정창 업데이트
function updateAdminSettings() {
    Object.keys(currentPrices).forEach(item => {
        const input = document.getElementById(`price-${item}`);
        if (input) {
            input.value = currentPrices[item];
        }
    });
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 알림 스타일
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // 타입별 색상
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        default:
            notification.style.background = '#667eea';
    }
    
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 숫자 입력 검증
function validateNumberInput(input) {
    const value = parseInt(input.value);
    if (isNaN(value) || value < 0) {
        input.value = 0;
    }
}

// 모든 숫자 입력 필드에 검증 이벤트 추가
document.addEventListener('DOMContentLoaded', function() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('blur', () => validateNumberInput(input));
    });
});
