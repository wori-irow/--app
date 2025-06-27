
// 기본 단가 설정
let prices = {
    wallpaper: {
        silk: 25000,
        mixed: 20000
    },
    flooring: {
        laminate: 35000,
        vinyl: 15000
    },
    ceiling: {
        normal: 18000,
        fireproof: 25000
    },
    molding: {
        normal: 8000,
        premium: 15000
    },
    lighting: 50000,
    electrical: {
        outlet: 15000,
        switch: 12000,
        perArea: 30000
    },
    carpentry: {
        wallConstruction: 800000,
        doorFrame: 150000
    },
    door: {
        room: 300000,
        entrance: 800000
    },
    bathroom: {
        full: 3000000,
        partial: 1200000
    },
    window: {
        room: 200000,
        living: 350000
    },
    island: {
        dailyRate: 100000
    }
};

// localStorage에서 설정 불러오기
function loadSettings() {
    const savedPrices = localStorage.getItem('interiorPrices');
    if (savedPrices) {
        prices = JSON.parse(savedPrices);
    }
}

// 설정을 localStorage에 저장
function saveSettings() {
    localStorage.setItem('interiorPrices', JSON.stringify(prices));
}

// 비밀번호 관리
function getAdminPassword() {
    return localStorage.getItem('adminPassword') || 'admin123';
}

function setAdminPassword(newPassword) {
    localStorage.setItem('adminPassword', newPassword);
}

// 숫자를 원화 형식으로 포맷
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

// 견적 계산 함수
function calculateEstimate() {
    const estimate = [];
    let totalAmount = 0;

    // 도배
    const wallpaperType = document.getElementById('wallpaper-type').value;
    const wallpaperArea = parseFloat(document.getElementById('wallpaper-area').value) || 0;
    if (wallpaperType && wallpaperArea > 0) {
        const unitPrice = prices.wallpaper[wallpaperType];
        const amount = unitPrice * wallpaperArea;
        estimate.push({
            item: '도배 (' + (wallpaperType === 'silk' ? '실크' : '합지') + ')',
            unitPrice: unitPrice,
            quantity: wallpaperArea + '평',
            amount: amount
        });
        totalAmount += amount;
    }

    // 바닥재
    const flooringType = document.getElementById('flooring-type').value;
    const flooringArea = parseFloat(document.getElementById('flooring-area').value) || 0;
    if (flooringType && flooringArea > 0) {
        const unitPrice = prices.flooring[flooringType];
        const amount = unitPrice * flooringArea;
        estimate.push({
            item: '바닥재 (' + (flooringType === 'laminate' ? '강마루' : '장판') + ')',
            unitPrice: unitPrice,
            quantity: flooringArea + '평',
            amount: amount
        });
        totalAmount += amount;
    }

    // 천장
    const ceilingType = document.getElementById('ceiling-type').value;
    const ceilingArea = parseFloat(document.getElementById('ceiling-area').value) || 0;
    if (ceilingType && ceilingArea > 0) {
        const unitPrice = prices.ceiling[ceilingType];
        const amount = unitPrice * ceilingArea;
        estimate.push({
            item: '천장 (' + (ceilingType === 'normal' ? '일반' : '방염') + ')',
            unitPrice: unitPrice,
            quantity: ceilingArea + '평',
            amount: amount
        });
        totalAmount += amount;
    }

    // 몰딩
    const moldingType = document.getElementById('molding-type').value;
    const moldingLength = parseFloat(document.getElementById('molding-length').value) || 0;
    if (moldingType && moldingLength > 0) {
        const unitPrice = prices.molding[moldingType];
        const amount = unitPrice * moldingLength;
        estimate.push({
            item: '몰딩 (' + (moldingType === 'normal' ? '일반' : '고급') + ')',
            unitPrice: unitPrice,
            quantity: moldingLength + 'm',
            amount: amount
        });
        totalAmount += amount;
    }

    // 조명
    const lightingCount = parseInt(document.getElementById('lighting-count').value) || 0;
    if (lightingCount > 0) {
        const unitPrice = prices.lighting;
        const amount = unitPrice * lightingCount;
        estimate.push({
            item: '조명',
            unitPrice: unitPrice,
            quantity: lightingCount + '개',
            amount: amount
        });
        totalAmount += amount;
    }

    // 전기 공사
    const outletCount = parseInt(document.getElementById('outlet-count').value) || 0;
    const switchCount = parseInt(document.getElementById('switch-count').value) || 0;
    const electricalArea = parseFloat(document.getElementById('electrical-area').value) || 0;
    
    if (outletCount > 0) {
        const amount = prices.electrical.outlet * outletCount;
        estimate.push({
            item: '콘센트',
            unitPrice: prices.electrical.outlet,
            quantity: outletCount + '개',
            amount: amount
        });
        totalAmount += amount;
    }
    
    if (switchCount > 0) {
        const amount = prices.electrical.switch * switchCount;
        estimate.push({
            item: '스위치',
            unitPrice: prices.electrical.switch,
            quantity: switchCount + '개',
            amount: amount
        });
        totalAmount += amount;
    }
    
    if (electricalArea > 0) {
        const amount = prices.electrical.perArea * electricalArea;
        estimate.push({
            item: '전기공사 (평당)',
            unitPrice: prices.electrical.perArea,
            quantity: electricalArea + '평',
            amount: amount
        });
        totalAmount += amount;
    }

    // 목공
    if (document.getElementById('wall-construction').checked) {
        const amount = prices.carpentry.wallConstruction;
        estimate.push({
            item: '가벽 시공',
            unitPrice: amount,
            quantity: '1식',
            amount: amount
        });
        totalAmount += amount;
    }
    
    if (document.getElementById('door-frame').checked) {
        const amount = prices.carpentry.doorFrame;
        estimate.push({
            item: '문틀 보수',
            unitPrice: amount,
            quantity: '1식',
            amount: amount
        });
        totalAmount += amount;
    }

    // 문 교체
    if (document.getElementById('room-door').checked) {
        const amount = prices.door.room;
        estimate.push({
            item: '방문 교체',
            unitPrice: amount,
            quantity: '1개',
            amount: amount
        });
        totalAmount += amount;
    }
    
    if (document.getElementById('entrance-door').checked) {
        const amount = prices.door.entrance;
        estimate.push({
            item: '현관문 교체',
            unitPrice: amount,
            quantity: '1개',
            amount: amount
        });
        totalAmount += amount;
    }

    // 욕실 리모델링
    const bathroomType = document.getElementById('bathroom-type').value;
    if (bathroomType) {
        const amount = prices.bathroom[bathroomType];
        estimate.push({
            item: '욕실 리모델링 (' + (bathroomType === 'full' ? '전체' : '부분') + ')',
            unitPrice: amount,
            quantity: '1식',
            amount: amount
        });
        totalAmount += amount;
    }

    // 샷시
    const windowType = document.getElementById('window-type').value;
    const windowCount = parseInt(document.getElementById('window-count').value) || 0;
    if (windowType && windowCount > 0) {
        const unitPrice = prices.window[windowType];
        const amount = unitPrice * windowCount;
        estimate.push({
            item: '샷시 (' + (windowType === 'room' ? '방' : '거실') + ')',
            unitPrice: unitPrice,
            quantity: windowCount + '개',
            amount: amount
        });
        totalAmount += amount;
    }

    // 섬 시공
    if (document.getElementById('island-work').checked) {
        const islandDays = parseInt(document.getElementById('island-days').value) || 0;
        if (islandDays > 0) {
            const unitPrice = prices.island.dailyRate;
            const amount = unitPrice * islandDays;
            estimate.push({
                item: '섬 시공 (체류비)',
                unitPrice: unitPrice,
                quantity: islandDays + '일',
                amount: amount
            });
            totalAmount += amount;
        }
    }

    displayEstimate(estimate, totalAmount);
}

// 견적 결과 표시
function displayEstimate(estimate, totalAmount) {
    const tableContainer = document.getElementById('estimate-table');
    
    if (estimate.length === 0) {
        tableContainer.innerHTML = '<p>선택된 항목이 없습니다.</p>';
        return;
    }

    let tableHTML = `
        <div class="estimate-table">
            <table>
                <thead>
                    <tr>
                        <th>항목</th>
                        <th>단가</th>
                        <th>수량</th>
                        <th>금액</th>
                    </tr>
                </thead>
                <tbody>
    `;

    estimate.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.item}</td>
                <td>${formatCurrency(item.unitPrice)}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.amount)}</td>
            </tr>
        `;
    });

    tableHTML += `
                    <tr class="total-row">
                        <td colspan="3"><strong>총 금액</strong></td>
                        <td><strong>${formatCurrency(totalAmount)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    tableContainer.innerHTML = tableHTML;
}

// 견적서 복사
function copyEstimate() {
    const table = document.querySelector('.estimate-table table');
    if (!table) {
        alert('견적을 먼저 계산해주세요.');
        return;
    }

    let text = '인테리어 견적서\n\n';
    const rows = table.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        if (index === 0) {
            text += '항목\t단가\t수량\t금액\n';
            text += '─'.repeat(50) + '\n';
        } else {
            const cells = row.querySelectorAll('td');
            if (cells.length === 4) {
                text += `${cells[0].textContent}\t${cells[1].textContent}\t${cells[2].textContent}\t${cells[3].textContent}\n`;
            }
        }
    });

    navigator.clipboard.writeText(text).then(() => {
        alert('견적서가 클립보드에 복사되었습니다.');
    }).catch(() => {
        alert('복사에 실패했습니다.');
    });
}

// PDF 저장 (간단한 print 기능)
function savePDF() {
    const table = document.querySelector('.estimate-table');
    if (!table) {
        alert('견적을 먼저 계산해주세요.');
        return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>인테리어 견적서</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total-row { background-color: #f9f9f9; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>🏠 인테리어 견적서</h1>
            ${table.outerHTML}
            <p style="margin-top: 30px; text-align: right; color: #666;">
                발행일: ${new Date().toLocaleDateString('ko-KR')}
            </p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// 관리자 패널 생성
function createAdminPanel() {
    const priceSettings = document.getElementById('priceSettings');
    let html = '';

    // 도배
    html += '<div class="price-item"><label>도배 - 실크 (평당):</label><input type="number" id="admin-wallpaper-silk" value="' + prices.wallpaper.silk + '"></div>';
    html += '<div class="price-item"><label>도배 - 합지 (평당):</label><input type="number" id="admin-wallpaper-mixed" value="' + prices.wallpaper.mixed + '"></div>';

    // 바닥재
    html += '<div class="price-item"><label>바닥재 - 강마루 (평당):</label><input type="number" id="admin-flooring-laminate" value="' + prices.flooring.laminate + '"></div>';
    html += '<div class="price-item"><label>바닥재 - 장판 (평당):</label><input type="number" id="admin-flooring-vinyl" value="' + prices.flooring.vinyl + '"></div>';

    // 천장
    html += '<div class="price-item"><label>천장 - 일반 (평당):</label><input type="number" id="admin-ceiling-normal" value="' + prices.ceiling.normal + '"></div>';
    html += '<div class="price-item"><label>천장 - 방염 (평당):</label><input type="number" id="admin-ceiling-fireproof" value="' + prices.ceiling.fireproof + '"></div>';

    // 몰딩
    html += '<div class="price-item"><label>몰딩 - 일반 (미터당):</label><input type="number" id="admin-molding-normal" value="' + prices.molding.normal + '"></div>';
    html += '<div class="price-item"><label>몰딩 - 고급 (미터당):</label><input type="number" id="admin-molding-premium" value="' + prices.molding.premium + '"></div>';

    // 조명
    html += '<div class="price-item"><label>조명 (개당):</label><input type="number" id="admin-lighting" value="' + prices.lighting + '"></div>';

    // 전기
    html += '<div class="price-item"><label>콘센트 (개당):</label><input type="number" id="admin-electrical-outlet" value="' + prices.electrical.outlet + '"></div>';
    html += '<div class="price-item"><label>스위치 (개당):</label><input type="number" id="admin-electrical-switch" value="' + prices.electrical.switch + '"></div>';
    html += '<div class="price-item"><label>전기공사 (평당):</label><input type="number" id="admin-electrical-perArea" value="' + prices.electrical.perArea + '"></div>';

    // 목공
    html += '<div class="price-item"><label>가벽 시공:</label><input type="number" id="admin-carpentry-wall" value="' + prices.carpentry.wallConstruction + '"></div>';
    html += '<div class="price-item"><label>문틀 보수:</label><input type="number" id="admin-carpentry-door" value="' + prices.carpentry.doorFrame + '"></div>';

    // 문
    html += '<div class="price-item"><label>방문 교체:</label><input type="number" id="admin-door-room" value="' + prices.door.room + '"></div>';
    html += '<div class="price-item"><label>현관문 교체:</label><input type="number" id="admin-door-entrance" value="' + prices.door.entrance + '"></div>';

    // 욕실
    html += '<div class="price-item"><label>욕실 리모델링 - 전체:</label><input type="number" id="admin-bathroom-full" value="' + prices.bathroom.full + '"></div>';
    html += '<div class="price-item"><label>욕실 리모델링 - 부분:</label><input type="number" id="admin-bathroom-partial" value="' + prices.bathroom.partial + '"></div>';

    // 샷시
    html += '<div class="price-item"><label>방샷시 (개당):</label><input type="number" id="admin-window-room" value="' + prices.window.room + '"></div>';
    html += '<div class="price-item"><label>거실샷시 (개당):</label><input type="number" id="admin-window-living" value="' + prices.window.living + '"></div>';

    // 섬 시공
    html += '<div class="price-item"><label>섬 시공 체류비 (일당):</label><input type="number" id="admin-island-daily" value="' + prices.island.dailyRate + '"></div>';

    html += '<button onclick="updatePrices()" style="margin-top: 20px; background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">단가 업데이트</button>';

    priceSettings.innerHTML = html;
}

// 단가 업데이트
function updatePrices() {
    prices.wallpaper.silk = parseInt(document.getElementById('admin-wallpaper-silk').value) || 0;
    prices.wallpaper.mixed = parseInt(document.getElementById('admin-wallpaper-mixed').value) || 0;
    prices.flooring.laminate = parseInt(document.getElementById('admin-flooring-laminate').value) || 0;
    prices.flooring.vinyl = parseInt(document.getElementById('admin-flooring-vinyl').value) || 0;
    prices.ceiling.normal = parseInt(document.getElementById('admin-ceiling-normal').value) || 0;
    prices.ceiling.fireproof = parseInt(document.getElementById('admin-ceiling-fireproof').value) || 0;
    prices.molding.normal = parseInt(document.getElementById('admin-molding-normal').value) || 0;
    prices.molding.premium = parseInt(document.getElementById('admin-molding-premium').value) || 0;
    prices.lighting = parseInt(document.getElementById('admin-lighting').value) || 0;
    prices.electrical.outlet = parseInt(document.getElementById('admin-electrical-outlet').value) || 0;
    prices.electrical.switch = parseInt(document.getElementById('admin-electrical-switch').value) || 0;
    prices.electrical.perArea = parseInt(document.getElementById('admin-electrical-perArea').value) || 0;
    prices.carpentry.wallConstruction = parseInt(document.getElementById('admin-carpentry-wall').value) || 0;
    prices.carpentry.doorFrame = parseInt(document.getElementById('admin-carpentry-door').value) || 0;
    prices.door.room = parseInt(document.getElementById('admin-door-room').value) || 0;
    prices.door.entrance = parseInt(document.getElementById('admin-door-entrance').value) || 0;
    prices.bathroom.full = parseInt(document.getElementById('admin-bathroom-full').value) || 0;
    prices.bathroom.partial = parseInt(document.getElementById('admin-bathroom-partial').value) || 0;
    prices.window.room = parseInt(document.getElementById('admin-window-room').value) || 0;
    prices.window.living = parseInt(document.getElementById('admin-window-living').value) || 0;
    prices.island.dailyRate = parseInt(document.getElementById('admin-island-daily').value) || 0;

    saveSettings();
    alert('단가가 업데이트되었습니다.');
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();

    // 섬 시공 체크박스 이벤트
    document.getElementById('island-work').addEventListener('change', function() {
        const daysInput = document.getElementById('island-days');
        daysInput.disabled = !this.checked;
        if (!this.checked) {
            daysInput.value = '';
        }
    });

    // 계산 버튼
    document.getElementById('calculateBtn').addEventListener('click', calculateEstimate);

    // 복사 버튼
    document.getElementById('copyBtn').addEventListener('click', copyEstimate);

    // PDF 버튼
    document.getElementById('pdfBtn').addEventListener('click', savePDF);

    // 관리자 버튼
    document.getElementById('adminBtn').addEventListener('click', function() {
        const password = prompt('관리자 비밀번호를 입력하세요:');
        if (password === getAdminPassword()) {
            document.getElementById('adminPanel').classList.remove('hidden');
            createAdminPanel();
        } else if (password !== null) {
            alert('비밀번호가 올바르지 않습니다.');
        }
    });

    // 관리자 패널 닫기
    document.getElementById('closeAdminBtn').addEventListener('click', function() {
        document.getElementById('adminPanel').classList.add('hidden');
    });

    // 비밀번호 변경
    document.getElementById('changePasswordBtn').addEventListener('click', function() {
        const newPassword = document.getElementById('newPassword').value;
        if (newPassword && newPassword.length >= 4) {
            setAdminPassword(newPassword);
            alert('비밀번호가 변경되었습니다.');
            document.getElementById('newPassword').value = '';
        } else {
            alert('비밀번호는 4자 이상이어야 합니다.');
        }
    });

    // 실시간 계산을 위한 입력 이벤트
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', calculateEstimate);
        input.addEventListener('input', calculateEstimate);
    });
});

