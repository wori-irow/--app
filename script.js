
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
}

h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.admin-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
    padding: 8px 16px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.admin-btn:hover {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
}

.calculator-section {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
}

.item-group {
    margin-bottom: 30px;
    padding: 25px;
    background: linear-gradient(145deg, #f8f9fa, #e9ecef);
    border-radius: 15px;
    border-left: 5px solid #667eea;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.item-group:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.item-group h3 {
    color: #667eea;
    font-size: 1.3rem;
    margin-bottom: 15px;
    font-weight: 600;
}

.input-group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.input-group label {
    font-weight: 500;
    color: #495057;
    min-width: 60px;
}

.input-group input {
    flex: 1;
    min-width: 120px;
    padding: 12px 15px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.input-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.unit {
    font-weight: 500;
    color: #6c757d;
    min-width: 30px;
}

.price-per-unit {
    color: #28a745;
    font-weight: 600;
    font-size: 0.9rem;
    background: rgba(40, 167, 69, 0.1);
    padding: 5px 10px;
    border-radius: 15px;
}

.total-section {
    text-align: center;
    margin-top: 40px;
    padding: 30px;
    background: linear-gradient(145deg, #667eea, #764ba2);
    border-radius: 20px;
    color: white;
}

.total-section h2 {
    font-size: 2rem;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

#totalPrice {
    color: #ffd700;
    font-weight: 700;
}

.calculate-btn {
    background: linear-gradient(145deg, #28a745, #20c997);
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.calculate-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
    background: linear-gradient(145deg, #20c997, #28a745);
}

/* 모달 스타일 */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 0;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: modalSlideIn 0.3s ease;
}

.modal-content.admin-settings {
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    background: linear-gradient(145deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
}

.close {
    color: white;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}

.close:hover {
    color: #ffd700;
}

.modal-body {
    padding: 30px;
}

.login-form .input-group {
    margin-bottom: 20px;
    display: block;
}

.login-form label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #495057;
}

.login-form input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.login-form input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-btn {
    background: linear-gradient(145deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 30px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 10px;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* 관리자 설정 스타일 */
.settings-section {
    margin-bottom: 30px;
    padding: 25px;
    background: #f8f9fa;
    border-radius: 15px;
    border-left: 5px solid #667eea;
}

.settings-section h3 {
    color: #667eea;
    font-size: 1.3rem;
    margin-bottom: 20px;
    font-weight: 600;
}

.price-settings {
    display: grid;
    gap: 20px;
}

.price-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: 10px;
    align-items: center;
    padding: 15px;
    background: white;
    border-radius: 10px;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
}

.price-item:hover {
    border-color: #667eea;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
}

.price-item label {
    font-weight: 500;
    color: #495057;
}

.price-item input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.9rem;
}

.price-item input:focus {
    outline: none;
    border-color: #667eea;
}

.admin-management {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.admin-list h4, .admin-add h4 {
    color: #495057;
    margin-bottom: 15px;
    font-size: 1.1rem;
}

#adminList {
    list-style: none;
    background: white;
    border-radius: 10px;
    padding: 15px;
    border: 2px solid #e9ecef;
    max-height: 200px;
    overflow-y: auto;
}

#adminList li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#adminList li:last-child {
    border-bottom: none;
}

.delete-admin {
    background: #dc3545;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.delete-admin:hover {
    background: #c82333;
    transform: scale(1.05);
}

.admin-add .input-group {
    margin-bottom: 15px;
    display: block;
}

.admin-add label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #495057;
}

.admin-add input {
    width: 100%;
    padding: 8px 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 0.9rem;
}

.admin-add input:focus {
    outline: none;
    border-color: #667eea;
}

.add-btn {
    background: linear-gradient(145deg, #28a745, #20c997);
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.settings-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 30px;
}

.save-btn {
    background: linear-gradient(145deg, #007bff, #0056b3);
    color: white;
    border: none;
    padding: 12px 30px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.logout-btn {
    background: linear-gradient(145deg, #6c757d, #5a6268);
    color: white;
    border: none;
    padding: 12px 30px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .admin-btn {
        position: static;
        margin-top: 15px;
    }
    
    .calculator-section {
        padding: 20px;
    }
    
    .item-group {
        padding: 15px;
    }
    
    .input-group {
        flex-direction: column;
        align-items: stretch;
    }
    
    .input-group label {
        min-width: auto;
    }
    
    .price-item {
        grid-template-columns: 1fr;
        gap: 5px;
    }
    
    .admin-management {
        grid-template-columns: 1fr;
    }
    
    .settings-actions {
        flex-direction: column;
    }
    
    .modal-content {
        margin: 10% auto;
        width: 95%;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 1.5rem;
    }
    
    .total-section h2 {
        font-size: 1.5rem;
    }
    
    .modal-body {
        padding: 20px;
    }
}
