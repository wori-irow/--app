
// 기본 데이터 구조
let itemData = {
    floor: { name: '바닥재', price: 50000, unit: '평' },
    wall: { name: '벽지', price: 30000, unit: '평' },
    tile: { name: '타일', price: 80000, unit: '평' },
    paint: { name: '도배', price: 25000, unit: '평' },
    window: { name: '샷시', price: 150000, unit: '개' },
    island: { name: '섬 공사', price: 300000, unit: '일' },
    electric: { name: '전기 공사', price: 120000, unit: '평' }
};

let adminAccounts = [
    { id: 'suwon1234', password: '1234' }
];

let isLoggedIn = false;

// 로컬 스토리지에서 데이터 로드
function loadData() {
    const savedItemData = localStorage.getItem('interiorItemData');
    const savedAdminAccounts = localStorage.getItem('interiorAdminAccounts');
    
    if (savedItemData) {
        itemData = JSON.parse(savedItemData);
    }
    
    if (savedAdminAccounts) {
        adminAccounts = JSON.parse(savedAdminAccounts);
    }
    
    updatePriceDisplay();
}

// 로컬 스토리지에 데이터 저장
function saveData() {
    localStorage.setItem('interiorItemData', JSON.stringify(itemData));
    localStorage.setItem('interiorAdminAccounts', JSON.stringify(adminAccounts));
}

// 가격 표시 업데이트
function updatePriceDisplay() {
    document.getElementById('floorPricePerUnit').textContent = `${itemData.floor.price.toLocaleString()}원/${itemData.floor.unit}`;
    document.getElementById('wallPricePerUnit').textContent = `${itemData.wall.price.toLocaleString()}원/${itemData.wall.unit}`;
    document.getElementById('tilePricePerUnit').textContent = `${itemData.tile.price.toLocaleString()}원/${itemData.tile.unit}`;
    document.getElementById('paintPricePerUnit').textContent = `${itemData.paint.price.toLocaleString()}원/${itemData.paint.unit}`;
    document.getElementById('windowPricePerUnit').textContent = `${itemData.window.price.toLocaleString()}원/${itemData.window.unit}`;
    document.getElementById('islandPricePerUnit').textContent = `${itemData.island.price.toLocaleString()}원/${itemData.island.unit}`;
    document.getElementById('electricPricePerUnit').textContent = `${itemData.electric.price.toLocaleString()}원/${itemData.electric.unit}`;
    
    // 항목 이름 업데이트
    const itemGroups = document.querySelectorAll('.item-group h3');
    itemGroups[0].textContent = itemData.floor.name;
    itemGroups[1].textContent = itemData.wall.name;
    itemGroups[2].textContent = itemData.tile.name;
    itemGroups[3].textContent = itemData.paint.name;
    itemGroups[4].textContent = itemData.window.name;
    itemGroups[5].textContent = itemData.island.name;
    itemGroups[6].textContent = itemData.electric.name;
}

// 견적 계산
function calculateTotal() {
    const floorArea = parseFloat(document.getElementById('floorArea').value) || 0;
    const wallArea = parseFloat(document.getElementById('wallArea').value) || 0;
    const tileArea = parseFloat(document.getElementById('tileArea').value) || 0;
    const paintArea = parseFloat(document.getElementById('paintArea').value) || 0;
    const windowCount = parseInt(document.getElementById('windowCount').value) || 0;
    const islandDays = parseInt(document.getElementById('islandDays').value) || 0;
    const electricArea = parseFloat(document.getElementById('electricArea').value) || 0;
    
    const total = 
        (floorArea * itemData.floor.price) +
        (wallArea * itemData.wall.price) +
        (tileArea * itemData.tile.price) +
        (paintArea * itemData.paint.price) +
        (windowCount * itemData.window.price) +
        (islandDays * itemData.island.price) +
        (electricArea * itemData.electric.price);
    
    document.getElementById('totalPrice').textContent = `${total.toLocaleString()}원`;
    
    // 계산 애니메이션
    const totalElement = document.getElementById('totalPrice');
    totalElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
    }, 200);
}

// 관리자 로그인
function adminLogin() {
    const inputId = document.getElementById('adminId').value;
    const inputPassword = document.getElementById('adminPassword').value;
    
    const validAdmin = adminAccounts.find(admin => 
        admin.id === inputId && admin.password === inputPassword
    );
    
    if (validAdmin) {
        isLoggedIn = true;
        document.getElementById('adminModal').style.display = 'none';
        openAdminSettings();
        
        // 입력 필드 초기화
        document.getElementById('adminId').value = '';
        document.getElementById('adminPassword').value = '';
    } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
}

// 관리자 설정 모달 오픈
function openAdminSettings() {
    // 현재 설정값으로 폼 초기화
    document.getElementById('floorName').value = itemData.floor.name;
    document.getElementById('floorPrice').value = itemData.floor.price;
    document.getElementById('wallName').value = itemData.wall.name;
    document.getElementById('wallPrice').value = itemData.wall.price;
    document.getElementById('tileName').value = itemData.tile.name;
    document.getElementById('tilePrice').value = itemData.tile.price;
    document.getElementById('paintName').value = itemData.paint.name;
    document.getElementById('paintPrice').value = itemData.paint.price;
    document.getElementById('windowName').value = itemData.window.name;
    document.getElementById('windowPrice').value = itemData.window.price;
    document.getElementById('islandName').value = itemData.island.name;
    document.getElementById('islandPrice').value = itemData.island.price;
    document.getElementById('electricName').value = itemData.electric.name;
    document.getElementById('electricPrice').value = itemData.electric.price;
    
    updateAdminList();
    document.getElementById('adminSettingsModal').style.display = 'block';
}

// 관리자 목록 업데이트
function updateAdminList() {
    const adminList = document.getElementById('adminList');
    adminList.innerHTML = '';
    
    adminAccounts.forEach((admin, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${admin.id}</span>
            <button class="delete-admin" onclick="deleteAdmin(${index})">삭제</button>
        `;
        adminList.appendChild(li);
    });
}

// 관리자 추가
function addAdmin() {
    const newId = document.getElementById('newAdminId').value.trim();
    const newPassword = document.getElementById('newAdminPassword').value.trim();
    
    if (!newId || !newPassword) {
        alert('아이디와 비밀번호를 입력해주세요.');
        return;
    }
    
    if (adminAccounts.find(admin => admin.id === newId)) {
        alert('이미 존재하는 아이디입니다.');
        return;
    }
    
    adminAccounts.push({ id: newId, password: newPassword });
    
    // 입력 필드 초기화
    document.getElementById('newAdminId').value = '';
    document.getElementById('newAdminPassword').value = '';
    
    updateAdminList();
    alert('관리자가 추가되었습니다.');
}

// 관리자 삭제
function deleteAdmin(index) {
    if (adminAccounts.length <= 1) {
        alert('최소 1명의 관리자는 유지되어야 합니다.');
        return;
    }
    
    if (confirm('정말로 이 관리자를 삭제하시겠습니까?')) {
        adminAccounts.splice(index, 1);
        updateAdminList();
        alert('관리자가 삭제되었습니다.');
    }
}

// 설정 저장
function saveSettings() {
    // 항목 이름 및 가격 업데이트
    itemData.floor.name = document.getElementById('floorName').value;
    itemData.floor.price = parseInt(document.getElementById('floorPrice').value);
    itemData.wall.name = document.getElementById('wallName').value;
    itemData.wall.price = parseInt(document.getElementById('wallPrice').value);
    itemData.tile.name = document.getElementById('tileName').value;
    itemData.tile.price = parseInt(document.getElementById('tilePrice').value);
    itemData.paint.name = document.getElementById('paintName').value;
    itemData.paint.price = parseInt(document.getElementById('paintPrice').value);
    itemData.window.name = document.getElementById('windowName').value;
    itemData.window.price = parseInt(document.getElementById('windowPrice').value);
    itemData.island.name = document.getElementById('islandName').value;
    itemData.island.price = parseInt(document.getElementById('islandPrice').value);
    itemData.electric.name = document.getElementById('electricName').value;
    itemData.electric.price = parseInt(document.getElementById('electricPrice').value);
    
    saveData();
    updatePriceDisplay();
    alert('설정이 저장되었습니다.');
}

// 로그아웃
function logout() {
    isLoggedIn = false;
    document.getElementById('adminSettingsModal').style.display = 'none';
    alert('로그아웃되었습니다.');
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // 관리자 모드 버튼
    document.getElementById('adminBtn').addEventListener('click', function() {
        document.getElementById('adminModal').style.display = 'block';
    });
    
    // 견적 계산 버튼
    document.getElementById('calculateBtn').addEventListener('click', calculateTotal);
    
    // 실시간 계산 (입력값 변경시)
    const inputs = ['floorArea', 'wallArea', 'tileArea', 'paintArea', 'windowCount', 'islandDays', 'electricArea'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateTotal);
    });
    
    // 로그인 버튼
    document.getElementById('loginBtn').addEventListener('click', adminLogin);
    
    // 관리자 추가 버튼
    document.getElementById('addAdminBtn').addEventListener('click', addAdmin);
    
    // 설정 저장 버튼
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    
    // 로그아웃 버튼
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // 모달 닫기 버튼들
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // 모달 외부 클릭시 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Enter 키로 로그인
    document.getElementById('adminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adminLogin();
        }
    });
    
    // Enter 키로 관리자 추가
    document.getElementById('newAdminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addAdmin();
        }
    });
});

    }
}
