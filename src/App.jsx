<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SATD - Alerta Temprana de Desbordamiento</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #667eea;
      --secondary: #764ba2;
      --danger: #f44336;
      --warning: #ff9800;
      --success: #4caf50;
      --info: #2196f3;
      --light: #f5f7fa;
      --dark: #333;
      --border: #e0e0e0;
    }

    html, body {
      height: 100%;
      width: 100%;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f7fa;
      color: var(--dark);
      overflow-x: hidden;
      position: relative;
      min-height: 100vh;
    }

    #sceneBackground {
      position: fixed;
      inset: 0;
      z-index: -3;
      transition: background 0.9s ease, filter 0.9s ease;
      background: linear-gradient(180deg, #84c7e8 0%, #cde8f3 35%, #b1dce9 70%, #7bb0d4 100%);
    }

    #sceneBackground::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 15%, rgba(255,255,255,0.9), transparent 26%),
                  radial-gradient(circle at 15% 20%, rgba(255,255,255,0.14), transparent 18%),
                  radial-gradient(circle at 85% 18%, rgba(255,255,255,0.1), transparent 16%);
      pointer-events: none;
    }

    #sceneBackground::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 52%;
      background: radial-gradient(circle at 25% 70%, rgba(255,255,255,0.08), transparent 18%),
                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.06), transparent 20%),
                  linear-gradient(180deg, transparent 0%, rgba(18, 75, 111, 0.18) 35%, rgba(12, 58, 92, 0.72) 100%);
      pointer-events: none;
      transform: translateY(8%);
    }

    body.tranquil #sceneBackground {
      background: linear-gradient(180deg, #9fd3e8 0%, #e6f4fb 45%, #d0eef5 100%);
      filter: saturate(1.05);
    }

    body.warning #sceneBackground {
      background: linear-gradient(180deg, #6c8aa3 0%, #718fa8 35%, #95b1c1 100%);
      filter: saturate(0.9) contrast(0.98);
    }

    body.danger #sceneBackground {
      background: linear-gradient(180deg, #2f2d39 0%, #433852 40%, #6b4a52 100%);
      filter: saturate(0.8) contrast(1.1);
    }

    body.warning #sceneBackground::before {
      background: radial-gradient(circle at 25% 20%, rgba(255,255,255,0.15), transparent 18%),
                  radial-gradient(circle at 70% 10%, rgba(255,255,255,0.12), transparent 18%);
    }

    body.danger #sceneBackground::before {
      background: radial-gradient(circle at 20% 20%, rgba(255,120,0,0.18), transparent 18%),
                  radial-gradient(circle at 80% 10%, rgba(255,0,0,0.12), transparent 18%);
    }

    /* ===== LOGIN PAGE ===== */
    .login-page {
      display: none;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 80px 20px 40px;
    }

    .login-page.active {
      display: flex;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 50px 40px;
      width: 100%;
      max-width: 420px;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo-river {
      position: relative;
      width: 72px;
      height: 72px;
      margin: 0 auto 15px;
      border-radius: 22px;
      background: radial-gradient(circle at 35% 35%, #bae6fd, #0ea5e9 55%, #0369a1 100%);
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 4s ease-in-out infinite;
    }

    .logo-river::before {
      content: '🌊';
      font-size: 34px;
    }

    .logo-river::after {
      content: '';
      position: absolute;
      inset: 16px 18px 18px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      opacity: 0.35;
      pointer-events: none;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .login-header h1 {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    .login-header p {
      color: #999;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .form-row .form-group {
      flex: 1 1 calc(50% - 6px);
      min-width: 160px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--dark);
      font-size: 14px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid var(--border);
      border-radius: 10px;
      font-size: 16px;
      transition: all 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--primary);
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
    }

    .login-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 20px;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .login-btn:active {
      transform: translateY(0);
    }

    .error {
      background: #ffebee;
      color: var(--danger);
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      display: none;
      border-left: 4px solid var(--danger);
    }

    .error.show {
      display: block;
      animation: shake 0.4s;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .info-box {
      background: #e3f2fd;
      padding: 16px;
      border-radius: 10px;
      margin-top: 20px;
      font-size: 13px;
      color: #555;
      line-height: 1.8;
      border-left: 4px solid var(--info);
    }

    /* ===== APP PAGE ===== */
    .app-page {
      display: none;
    }

    .app-page.active {
      display: block;
    }

    /* Header/Navbar */
    header {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 16px 20px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-text h1 {
      font-size: 22px;
      font-weight: 700;
      margin: 0;
    }

    .header-text p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }

    .header-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .header-right .status-badge {
      display: none;
    }

    .status-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
      transition: all 0.3s;
      backdrop-filter: blur(10px);
    }

    .logout-btn:hover {
      background: rgba(255, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* Main Container */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 25px;
      color: var(--dark);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Grid Layout */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    }

    .river-video-card {
      overflow: hidden;
      background: linear-gradient(180deg, rgba(7, 60, 95, 0.96), rgba(19, 90, 128, 0.9));
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .river-video-card h3 {
      color: #fff;
    }

    .river-video-player {
      position: relative;
      width: 100%;
      min-height: 320px;
      border-radius: 18px;
      overflow: hidden;
      background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06), transparent 35%),
                  linear-gradient(180deg, #0f3f6b 0%, #113f63 40%, #0b2740 100%);
      box-shadow: inset 0 0 80px rgba(0,0,0,0.25);
    }

    .river-video-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      transition: opacity 0.8s ease;
    }

    .river-sky {
      background: linear-gradient(180deg, rgba(255,255,255,0.4), rgba(47, 68, 92, 0.25));
      opacity: 0.8;
    }

    .river-hills {
      background: radial-gradient(circle at 30% 80%, rgba(14, 54, 88, 0.95), transparent 35%),
                  radial-gradient(circle at 70% 75%, rgba(23, 67, 100, 0.95), transparent 30%);
      opacity: 0.95;
    }

    .river-water {
      bottom: 0;
      height: 45%;
      background: linear-gradient(180deg, #0f4f7a 0%, #144c6e 30%, #0c3a59 100%);
      box-shadow: inset 0 10px 20px rgba(255,255,255,0.08);
      transform: translateY(30%);
      animation: waterFlow 5s ease-in-out infinite;
    }

    .river-foam {
      position: absolute;
      width: 120%;
      height: 35%;
      left: -10%;
      top: 50%;
      background: radial-gradient(circle at 50% 20%, rgba(255,255,255,0.25), transparent 25%);
      filter: blur(3px);
      opacity: 0.45;
      animation: foamMove 4s infinite ease-in-out;
    }

    .river-video-caption {
      position: absolute;
      left: 20px;
      bottom: 18px;
      font-size: 14px;
      line-height: 1.4;
      z-index: 5;
      width: calc(100% - 40px);
    }

    .river-video-caption strong {
      display: block;
      margin-bottom: 8px;
      font-size: 18px;
    }

    .river-video-status {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.15);
      margin-top: 10px;
      font-size: 13px;
    }

    .river-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      gap: 12px;
    }

    .river-controls button {
      min-width: 160px;
    }

    @keyframes waterFlow {
      0%, 100% { transform: translateY(30%); }
      50% { transform: translateY(24%); }
    }

    @keyframes foamMove {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(8%); }
    }

    .card-header {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      font-weight: 700;
    }

    .card h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 20px;
      color: var(--dark);
    }

    .card h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 15px;
      color: var(--dark);
    }

    /* Level Display */
    .level-display {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 35px;
      border-radius: 15px;
      text-align: center;
      margin-bottom: 20px;
    }

    .level-number {
      font-size: 70px;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 5px;
    }

    .level-unit {
      font-size: 16px;
      opacity: 0.9;
    }

    .status-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }

    .status-indicator.yellow {
      background: #ffd700;
    }

    .status-indicator.orange {
      background: #ff9800;
    }

    .status-indicator.red {
      background: #f44336;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-text {
      background: #f5f7fa;
      padding: 16px;
      border-radius: 10px;
      font-size: 14px;
      color: #555;
      line-height: 1.6;
    }

    /* Buttons */
    .btn-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    button {
      padding: 12px 16px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 44px;
    }

    button:active {
      transform: scale(0.95);
    }

    .btn-yellow {
      background: #ffd700;
      color: #333;
    }

    .btn-yellow:hover {
      background: #ffb700;
      box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
    }

    .btn-orange {
      background: #ff9800;
      color: white;
    }

    .btn-orange:hover {
      background: #f57c00;
      box-shadow: 0 5px 15px rgba(255, 152, 0, 0.3);
    }

    .btn-red {
      background: #f44336;
      color: white;
    }

    .btn-red:hover {
      background: #d32f2f;
      box-shadow: 0 5px 15px rgba(244, 67, 54, 0.3);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      grid-column: 1 / -1;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f5f7fa;
      color: var(--dark);
      border: 2px solid var(--border);
    }

    .btn-secondary:hover {
      background: #eee;
      border-color: var(--primary);
    }

    textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid var(--border);
      border-radius: 10px;
      resize: vertical;
      min-height: 120px;
      font-size: 14px;
      color: var(--dark);
      background: #fff;
    }

    input[type="file"] {
      width: 100%;
      padding: 10px 0;
    }

    .report-card {
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 15px;
      padding: 18px;
      margin-bottom: 18px;
      background: #fff;
    }

    .report-meta {
      font-size: 12px;
      color: #777;
      margin-bottom: 10px;
    }

    .report-photo {
      max-width: 100%;
      border-radius: 12px;
      margin-top: 12px;
    }

    .report-comments {
      margin-top: 15px;
      border-top: 1px solid #eee;
      padding-top: 14px;
    }

    .report-comment {
      background: #f9f9fb;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
    }

    .member-card {
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 15px;
      padding: 16px;
      margin-bottom: 14px;
      background: #fff;
    }

    .member-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }

    .warning-badge {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 10px;
      background: #fff4e5;
      color: #a86100;
      font-size: 12px;
      margin-top: 8px;
    }

    .admin-panel {
      border: 1px solid rgba(118, 75, 162, 0.18);
      background: linear-gradient(180deg, #ffffff 0%, #f7f1ff 100%);
    }

    body.admin-mode header {
      background: linear-gradient(135deg, #4b6cb7, #182848);
    }

    body.admin-mode .status-badge {
      background: rgba(255, 255, 255, 0.18);
      border-color: rgba(255, 255, 255, 0.45);
    }

    .admin-mode .card {
      border-color: rgba(118, 75, 162, 0.12);
    }

    .user-panel {
      border: 1px solid rgba(255, 72, 72, 0.16);
      background: #fff5f5;
    }

    /* Chart */
    .chart {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 150px;
      background: #f5f7fa;
      padding: 15px;
      border-radius: 10px;
      margin-top: 20px;
    }

    .bar {
      flex: 1;
      background: linear-gradient(to top, var(--primary), var(--secondary));
      border-radius: 3px;
      min-height: 3px;
    }

    /* List */
    .list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 350px;
      overflow-y: auto;
    }

    .list-item {
      background: #f5f7fa;
      padding: 14px;
      border-radius: 10px;
      border-left: 4px solid var(--primary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .item-info h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--dark);
    }

    .item-info p {
      font-size: 12px;
      color: #999;
    }

    .item-time {
      font-size: 11px;
      color: #999;
    }

    /* Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(5px);
    }

    .modal.active {
      display: flex;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideDown 0.3s ease-out;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .modal-header h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .close-modal {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .close-modal:hover {
      background: #f5f7fa;
      color: var(--dark);
    }

    .modal-body {
      margin-bottom: 25px;
    }

    .modal-body p {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
      margin-bottom: 15px;
    }

    .modal-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--dark);
      color: white;
      padding: 16px 24px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: slideInRight 0.4s ease-out;
      z-index: 2000;
      font-size: 14px;
      max-width: 300px;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content {
        flex-wrap: wrap;
      }

      .header-right {
        width: 100%;
        justify-content: space-between;
      }

      .grid {
        grid-template-columns: 1fr;
      }

      .btn-group {
        grid-template-columns: 1fr;
      }

      .btn-primary {
        grid-column: auto;
      }

      .modal-content {
        padding: 25px;
      }
    }
  </style>
</head>
<body>
  <div id="sceneBackground"></div>
  <!-- LOGIN -->
  <div class="login-page active" id="loginPage">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-river" aria-hidden="true"></div>
        <h1>SATD</h1>
        <p>Sistema de Alerta Temprana de Desbordamiento</p>
      </div>

      <div class="error" id="error"></div>

      <div class="form-group">
        <label>Teléfono</label>
        <input type="tel" id="phone" placeholder="+57 3171297528" onkeypress="if(event.key==='Enter') login()">
      </div>

            <div class="form-group">
        <label>Contraseña</label>
        <input type="password" id="password" placeholder="Tu número completo" onkeypress="if(event.key==='Enter') login()">
      </div>

      <button class="login-btn" onclick="login()">🔓 Ingresar</button>

      <div class="btn-group" style="grid-template-columns: 1fr; margin-top: 20px; gap: 12px;">
        <button class="btn-secondary" onclick="guestLogin()">👤 Entrar como invitado</button>
        <button class="btn-secondary" onclick="openModal('registerModal')">✍️ Crear cuenta</button>
      </div>

<div class="info-box">
        <strong>Administradores ya registrados:</strong> los números pre-registrados tienen acceso especial.
        <br>Regístrate con tu número para usar el panel normal o entra como invitado sin botón de pánico.
      </div>
    </div>
  </div>

  <!-- APP -->
  <div class="app-page" id="appPage">
    <header>
      <div class="header-content">
        <div class="header-left">
          <div class="logo-river" aria-hidden="true"></div>
          <div class="header-text">
            <h1>SATD</h1>
            <p>En tiempo real</p>
          </div>
          <div id="levelBadge" style="font-weight: bold; margin-left: 20px;">📊 3.18 m</div>
        </div>
        <div class="header-right">
          <div id="userBadge" style="margin-right: 15px;">👤 Invitado</div>
          <button class="logout-btn" onclick="openModal('accountModal')" id="accountBtn" aria-label="Gestionar cuenta" style="display:none;">⚙️</button>
          <button class="logout-btn" onclick="openModal('supportModal')" aria-label="Soporte">🆘</button>
          <button class="logout-btn" onclick="logout()" aria-label="Cerrar sesión">🚪</button>
        </div>
      </div>
    </header>

    <div class="container">
      <div class="card" id="panicBanner" style="display:none; background:#fff2f2; border-left: 4px solid #f44336; margin-bottom:20px; padding:20px;">
      </div>
      <!-- MONITORING SECTION -->
      <div class="section-title">📊 Monitoreo en Tiempo Real</div>

      <div class="grid">
        <!-- Nivel del Río -->
        <div class="card">
          <div class="card-header">Nivel Actual</div>
          <h2>Río Cali</h2>

          <div class="level-display">
            <div class="level-number" id="levelValue">3.18</div>
            <div class="level-unit">metros</div>
          </div>

          <div class="status-text" id="statusText">Preparación preventiva y seguimiento constante</div>

          <div class="chart" id="chart"></div>
        </div>

        <!-- Botón de Emergencia para usuarios normales -->
        <div class="card user-panel" id="panicCard" style="display: none;">
          <div class="card-header">Botón de Emergencia</div>
          <h2>Socorro</h2>
          <p style="color: #666; margin-bottom: 20px;">Notifica a todos los usuarios y a los servicios de emergencia cercanos.</p>
          <button class="btn-red" onclick="triggerPanic()">🚨 Botón de pánico</button>
          <p id="panicStatus" style="color:#999; margin-top:12px;">No hay emergencia activa</p>
        </div>

        <!-- Admin panel para alertas y simulación -->
        <div class="card admin-panel" id="adminControls" style="display:none;">
          <div class="card-header">Control de Alertas</div>
          <h2>Administración</h2>

          <div class="btn-group">
            <button class="btn-yellow" onclick="openModal('alertModal', 'yellow')">🟡 Amarilla</button>
            <button class="btn-orange" onclick="openModal('alertModal', 'orange')">🟠 Naranja</button>
            <button class="btn-red" onclick="openModal('alertModal', 'red')">🔴 Roja</button>
          </div>
          <button class="btn-primary" style="margin-top: 12px;" onclick="openModal('simulModal')">⚙️ Simulación</button>

          <div class="card-header" style="margin-top: 20px;">Alertas Recientes</div>
          <div class="list" id="alertList">
            <p style="text-align: center; color: #999; padding: 20px;">Sin alertas aún</p>
          </div>
        </div>

        <!-- Explicación de niveles de alerta -->
        <div class="card">
          <div class="card-header">Significado de los niveles de alerta del SATD</div>
          <div style="font-size: 14px; color: #555; line-height: 1.7;">
            <p>🟡 <strong>Alerta Amarilla — Preparación</strong><br>
            El nivel del río ha comenzado a aumentar y existe la posibilidad de que la situación evolucione a un riesgo mayor. Estado de vigilancia y prevención.</p>
            <p>🟠 <strong>Alerta Naranja — Alistamiento para Evacuar</strong><br>
            El nivel del río está cerca de un punto crítico y existe alta probabilidad de desbordamiento. La comunidad debe estar lista para evacuar.</p>
            <p>🔴 <strong>Alerta Roja — Evacuación Inmediata</strong><br>
            El desbordamiento es inminente o ya se presenta y existe peligro para la vida. Evacuar inmediatamente.</p>
          </div>
        </div>
      </div>

      <div class="section-title"><
 Río 24/7  Transmisión simulada</div>
      <div class="grid">
        <div class="card river-video-card" style="grid-column: 1 / -1;">
          <div class="card-header">Transmisión en vivo simulada del Río</div>
          <div class="river-video-player" id="riverVideoPlayer">
            <div class="river-video-layer river-sky"></div>
            <div class="river-video-layer river-hills"></div>
            <div class="river-video-layer river-water"></div>
            <div class="river-video-layer river-foam"></div>
            <div class="river-video-caption">
              <strong id="riverVideoTitle">Río Cali - Cámara en vivo</strong>
              <span id="riverVideoDescription">Transmisión simulada del río en tiempo real.</span>
              <span class="river-video-status" id="riverVideoStatus">Estado: Tranquilo</span>
            </div>
          </div>
          <div class="river-controls">
            <button class="btn-secondary" onclick="toggleRiverAudio()">Escuchar ambiente</button>
            <button class="btn-primary" onclick="forceRiverScene()">Refrescar transmisión</button>
          </div>
        </div>
      </div>

      <!-- REPORTES SECTION -->
      <div class="section-title">📝 Lo reporto yo</div>
      <div class="grid">
        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-header">Crear reporte</div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea id="reportText" rows="5" placeholder="Describe el incidente relacionado con el río Cali"></textarea>
          </div>
          <div class="form-group">
            <label>Foto (opcional)</label>
            <input type="file" id="reportPhoto" accept="image/*">
          </div>
          <button class="btn-primary" onclick="submitReport()">📣 Publicar reporte</button>
          <p id="reportHint" style="color: #666; margin-top: 12px; font-size: 13px;">Publica solo información relacionada con el río Cali.</p>
        </div>

        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-header">Reportes recientes</div>
          <div id="reportFeed"></div>
        </div>

        <div class="card admin-panel" id="membersPanel" style="display:none; grid-column: 1 / -1;">
          <div class="card-header">Miembros registrados</div>
          <div id="membersList"></div>
        </div>
      </div>

      <!-- ACTIONS SECTION -->
      <div class="section-title">âš��ï¸ Herramientas</div>

      <div class="grid">
        <div class="card">
          <h3>📋 Ver Estadísticas</h3>
          <p style="color: #666; margin-bottom: 20px;">Consulta datos históricos y estadísticas del sistema</p>
          <button class="btn-primary" onclick="openModal('statsModal')">📊 📊 Ver estadísticas</button>
        </div>

        <div class="card">
          <h3>📊 Zonas Seguras</h3>
          <p style="color: #666; margin-bottom: 20px;">Encuentra los puntos de refugio más cercanos</p>
          <button class="btn-primary" onclick="openModal('zonesModal')">�ºï¸ 📍 Ver zonas seguras</button>
        </div>

        <div class="card">
          <h3>⚙️ Configuración</h3>
          <p style="color: #666; margin-bottom: 20px;">Ajusta las preferencias de tu cuenta</p>
          <button class="btn-primary" onclick="openModal('settingsModal')">âš��ï¸ ⚙️ Configuración</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODALS -->

  <!-- Alert Modal -->
  <div class="modal" id="alertModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="alertModalTitle">Activar Alerta</h2>
        <button class="close-modal" onclick="closeModal('alertModal')">✕⬢</button>
      </div>
      <div class="modal-body" id="alertModalBody"></div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('alertModal')">Cancelar</button>
        <button class="btn-primary" onclick="confirmAlert()">Confirmar</button>
      </div>
    </div>
  </div>

  <!-- Simulación Modal -->
  <div class="modal" id="simulModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>⚙️ Modo Simulación</h2>
        <button class="close-modal" onclick="closeModal('simulModal')">✕⬢</button>
      </div>
      <div class="modal-body">
        <p>El modo simulación permite que el nivel del río cambie automáticamente para probar el sistema.</p>
        <p style="font-weight: 600; color: var(--primary);">Estado: <span id="simulStatus">Desactivado</span></p>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('simulModal')">Cerrar</button>
        <button class="btn-primary" onclick="toggleSimulation()">✕¶ï¸ Activar/Desactivar</button>
      </div>
    </div>
  </div>

  <!-- Estadísticas Modal -->
  <div class="modal" id="statsModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>📊 Estadísticas</h2>
        <button class="close-modal" onclick="closeModal('statsModal')">✕⬢</button>
      </div>
      <div class="modal-body" id="statsBody"></div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="closeModal('statsModal')">Entendido</button>
      </div>
    </div>
  </div>

  <!-- Registro Modal -->
  <div class="modal" id="registerModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>✍️ Crear cuenta</h2>
        <button class="close-modal" onclick="closeModal('registerModal')">✕⬢</button>
      </div>
      <div class="modal-body">
          <div class="form-row">
          <div class="form-group">
            <label>País</label>
            <select id="registerCountry">
              <option value="Colombia" data-code="+57" selected>🇨🇴 Colombia (+57)</option>
              <option value="México" data-code="+52">🇲🇽 México (+52)</option>
              <option value="Perú" data-code="+51">🇵🇪 Perú (+51)</option>
              <option value="Chile" data-code="+56">🇦¨🇦± Chile (+56)</option>
              <option value="Argentina" data-code="+54">🇦¦🇦· Argentina (+54)</option>
              <option value="España" data-code="+34">🇪🇸 España (+34)</option>
              <option value="Brasil" data-code="+55">🇦§🇦· Brasil (+55)</option>
              <option value="Estados Unidos" data-code="+1">🇦º🇦¸ Estados Unidos (+1)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Teléfono local</label>
            <input type="tel" id="registerPhone" placeholder="3171234567">
          </div>
        </div>
        <div class="form-group">
          <button class="btn-primary" style="width:100%;" onclick="sendVerificationCode()">Enviar código de verificación</button>
        </div>
        <div class="form-group">
          <label>Verificación humana</label>
          <input type="text" id="captchaAnswer" placeholder="Ej. 7">
          <p id="captchaHint" style="color: #666; font-size: 13px; margin-top: 8px;">Resuelve el captcha para continuar</p>
        </div>
        <div class="form-group">
          <label>Código de verificación</label>
          <input type="text" id="verificationCode" placeholder="12345">
        </div>
        <p id="registerHint" style="color: #666; font-size: 13px; line-height: 1.5;">Recibirás un código SMS para verificar tu número. (En desarrollo: código fijo <strong>123</strong>)</p>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('registerModal')">Cancelar</button>
        <button class="btn-primary" onclick="verifyRegistration()">Verificar y crear</button>
      </div>
    </div>
  </div>

  <!-- Pánico Modal -->
  <div class="modal" id="panicModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>🚨 Emergencia activa</h2>
        <button class="close-modal" onclick="closeModal('panicModal')">✕⬢</button>
      </div>
      <div class="modal-body" id="panicModalBody"></div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('panicModal')">Cerrar</button>
        <button class="btn-primary" onclick="openPanicMap()">Ver ruta en Maps</button>
      </div>
    </div>
  </div>

  <!-- Zonas Seguras Modal -->
  <div class="modal" id="zonesModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>📍 Zonas Seguras</h2>
        <button class="close-modal" onclick="closeModal('zonesModal')">✕⬢</button>
      </div>
      <div class="modal-body" id="zonesBody">
        <p style="color: #666; margin-bottom: 15px;">Abre las zonas seguras para solicitar permiso de ubicación y obtener rutas en tiempo real.</p>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="closeModal('zonesModal')">Cerrar</button>
      </div>
    </div>
  </div>

  <!-- Configuración Modal -->
  <div class="modal" id="settingsModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>⚙️ Configuración</h2>
        <button class="close-modal" onclick="closeModal('settingsModal')">✕⬢</button>
      </div>
      <div class="modal-body">
        <h3 style="margin-bottom: 10px;">Tu Perfil</h3>
        <p><strong>Teléfono:</strong> <span id="userPhone">3171297528</span></p>
        <p><strong>Estado:</strong> Activo ✕�S</p>
        <p><strong>Sesión:</strong> <span id="sessionTime">Ahora</span></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
        <h3 style="margin-bottom: 10px;">Preferencias</h3>
        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; cursor: pointer;">
          <input type="checkbox" checked> Notificaciones SMS
        </label>
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
          <input type="checkbox" checked> Notificaciones en app
        </label>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('settingsModal')">Cancelar</button>
        <button class="btn-primary" onclick="saveSettings()">💾 Guardar</button>
      </div>
    </div>
  </div>

  <!-- Gestionar Cuenta Modal -->
  <div class="modal" id="accountModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>👤 Mi Cuenta</h2>
        <button class="close-modal" onclick="closeModal('accountModal')">✕⬢</button>
      </div>
      <div class="modal-body">
        <h3 style="margin-bottom: 15px;">Información de Cuenta</h3>
        <p><strong>Identificador:</strong> <span id="accountId">-</span></p>
        <p><strong>Tipo:</strong> <span id="accountType">-</span></p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
        
        <h3 style="margin-bottom: 15px;">Cambiar Contraseña</h3>
        <div class="form-group">
          <label>Contraseña Actual</label>
          <input type="password" id="currentPassword" placeholder="Tu contraseña actual">
        </div>
        <div class="form-group">
          <label>Nueva Contraseña</label>
          <input type="password" id="newPassword" placeholder="Nueva contraseña">
        </div>
        <div class="form-group">
          <label>Confirmar Contraseña</label>
          <input type="password" id="confirmPassword" placeholder="Confirma la contraseña">
        </div>
        <button class="btn-primary" style="width: 100%; margin-bottom: 15px;" onclick="changePassword()">🔒 Cambiar Contraseña</button>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
        
        <h3 style="margin-bottom: 15px;">Cambiar Nombre de Usuario</h3>
        <div class="form-group">
          <label>Nuevo Nombre de Usuario</label>
          <input type="text" id="newUsername" placeholder="Nuevo nombre de usuario">
          <div id="usernameHint" style="color: #666; font-size: 13px; margin-top: 8px;">El nombre de usuario debe ser único y no puede contener espacios.</div>
          <div id="usernameRecommendations" style="margin-top: 10px;"></div>
        </div>
        <button class="btn-primary" style="width: 100%;" onclick="changeUsername()">✏️ Cambiar Nombre de Usuario</button>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('accountModal')">Cerrar</button>
      </div>
    </div>
  </div>

  <!-- Soporte Modal -->
  <div class="modal" id="supportModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>🆘 Soporte y Ayuda</h2>
        <button class="close-modal" onclick="closeModal('supportModal')">✕⬢</button>
      </div>
      <div class="modal-body">
        <h3 style="margin-bottom: 15px;">📞 Números de Administradores</h3>
        <p style="color: #666; margin-bottom: 15px;">Contacta con los administradores del sistema SATD para reportar problemas técnicos o solicitar asistencia.</p>
        
        <div style="background: #f5f7fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <div id="adminContactsList" style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Se llena dinámicamente con los números de admin -->
          </div>
        </div>

        <h3 style="margin-bottom: 15px;">ℹ️ Información del Sistema</h3>
        <p><strong>Versión:</strong> 1.0.0</p>
        <p><strong>Sistema:</strong> SATD - Sistema de Alerta Temprana de Desbordamiento</p>
        <p><strong>Ubicación:</strong> Río Cali, Colombia</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
        
        <h3 style="margin-bottom: 15px;">❓ Preguntas Frecuentes</h3>
        <details style="margin-bottom: 15px; cursor: pointer;">
          <summary style="font-weight: 600; color: var(--primary);">¿Cómo funciona el sistema de alertas?</summary>
          <p style="margin-top: 10px; color: #666;">El sistema monitorea continuamente el nivel del río y emite alertas automáticas. Amarilla: vigilancia, Naranja: prepararse para evacuar, Roja: evacuar inmediatamente.</p>
        </details>
        <details style="margin-bottom: 15px; cursor: pointer;">
          <summary style="font-weight: 600; color: var(--primary);">¿Es obligatorio registrarse?</summary>
          <p style="margin-top: 10px; color: #666;">No, puedes entrar como invitado. Los invitados no pueden enviar reportes ni usar el botón de pánico, pero pueden ver todas las alertas.</p>
        </details>
        <details style="cursor: pointer;">
          <summary style="font-weight: 600; color: var(--primary);">¿Cómo reporto un problema?</summary>
          <p style="margin-top: 10px; color: #666;">Usa la sección "Lo reporto yo" para publicar reportes sobre el estado del río. Los administradores verificarán tu reporte antes de publicarlo.</p>
        </details>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('supportModal')">Cerrar</button>
      </div>
    </div>
  </div>

  <script>
    const ADMIN_NUMBERS = {
      '3171297528': true,
      '3169128151': true,
      '3052805449': true,
      '3173869612': true
    };

    let registeredUsers = {};

    let app = {
      user: null,
      userType: null,
      level: 3.18,
      simulating: false,
      alerts: [],
      sms: [],
      currentAlertType: null,
      lastSMSTime: 0,
      location: null,
      locationError: null,
      pendingVerification: null,
      panicEvent: null,
      panicWatchId: null,
      registerCaptcha: null,
      riverAudioActive: false,
      riverAudio: null,
      riverSceneType: 'tranquil'
    };

    function normalizePhone(phone) {
      return phone.toString().replace(/[^0-9+]/g, '').replace(/^\+?0+/, '+').replace(/\+\+/, '+');
    }

    function digitsOnly(phone) {
      return phone.toString().replace(/\D/g, '');
    }

    function findUserKey(phone) {
      const normalized = normalizePhone(phone);
      if (registeredUsers[normalized]) return normalized;
      const inputDigits = digitsOnly(normalized);
      for (const key in registeredUsers) {
        if (digitsOnly(key).endsWith(inputDigits)) return key;
      }
      return null;
    }

    function loadUserDatabase() {
      registeredUsers = JSON.parse(localStorage.getItem('satdUsers') || '{}');
      Object.keys(ADMIN_NUMBERS).forEach(phone => {
        const key = normalizePhone(phone);
        registeredUsers[key] = registeredUsers[key] || { type: 'admin', pass: key };
        registeredUsers[key].type = 'admin';
      });
      localStorage.setItem('satdUsers', JSON.stringify(registeredUsers));
    }

    function newCaptchaChallenge() {
      const a = Math.floor(Math.random() * 8) + 1;
      const b = Math.floor(Math.random() * 8) + 1;
      const operator = Math.random() < 0.6 ? '+' : '-';
      const question = `${a} ${operator} ${b}`;
      const answer = operator === '+' ? a + b : a - b;
      return { question, answer };
    }

    function saveUserDatabase() {
      localStorage.setItem('satdUsers', JSON.stringify(registeredUsers));
    }

    // SMS sending is simulated in-browser. No external SMS service required.

    function getDeviceId() {
      let id = localStorage.getItem('satdDeviceId');
      if (!id) {
        id = 'device-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
        localStorage.setItem('satdDeviceId', id);
      }
      return id;
    }

    function loadGuestBanRecords() {
      return JSON.parse(localStorage.getItem('satdGuestBlocks') || '{}');
    }

    function saveGuestBanRecords(records) {
      localStorage.setItem('satdGuestBlocks', JSON.stringify(records));
    }

    function getGuestBan(deviceId) {
      const records = loadGuestBanRecords();
      return records[deviceId] || { count: 0, blockedUntil: 0, reportWarnings: 0, commentWarnings: 0, reportBanUntil: 0, commentBanUntil: 0, needsAdminReview: false };
    }

    function setGuestBan(deviceId, ban) {
      const records = loadGuestBanRecords();
      records[deviceId] = ban;
      saveGuestBanRecords(records);
    }

    function isEntityBlocked(id) {
      const now = Date.now();
      const record = registeredUsers[id] || getGuestBan(id);
      return record.blockedUntil && record.blockedUntil > now;
    }

    function getBlockMessage(id) {
      const now = Date.now();
      const record = registeredUsers[id] || getGuestBan(id);
      if (record.blockedUntil && record.blockedUntil > now) {
        const remaining = Math.ceil((record.blockedUntil - now) / 60000);
        return `Bloqueado por ${remaining} min`;
      }
      return '';
    }

    function applyGuestKick(deviceId) {
      const ban = getGuestBan(deviceId);
      ban.count = (ban.count || 0) + 1;
      const durations = [2, 8, 24, 24 * 7, 24 * 365 * 10];
      const durationHours = durations[Math.min(ban.count - 1, durations.length - 1)];
      ban.blockedUntil = Date.now() + durationHours * 60 * 60 * 1000;
      setGuestBan(deviceId, ban);
      return ban;
    }

    function getBanState(id) {
      const record = registeredUsers[id] || getGuestBan(id);
      if (record.blockedUntil && record.blockedUntil > Date.now()) {
        return { blocked: true, message: getBlockMessage(id) };
      }
      return { blocked: false };
    }

    function blockUser(phone, durationMs) {
      registeredUsers[phone] = registeredUsers[phone] || { type: 'user', pass: phone };
      registeredUsers[phone].blockedUntil = Date.now() + durationMs;
      saveUserDatabase();
    }

    function unblockUser(phone) {
      if (registeredUsers[phone]) {
        registeredUsers[phone].blockedUntil = 0;
        saveUserDatabase();
      }
      const deviceId = getDeviceId();
      const guestBan = getGuestBan(deviceId);
      if (guestBan.blockedUntil && guestBan.blockedUntil < Date.now()) {
        guestBan.blockedUntil = 0;
        saveGuestBanRecords({ ...loadGuestBanRecords(), [deviceId]: guestBan });
      }
    }

    const SAFE_ZONES = [
      {
        name: 'Parque del Río',
        description: 'Òrea peatonal segura junto al Río Cali',
        lat: 3.4314,
        lng: -76.5225,
        capacity: '4.500 personas'
      },
      {
        name: 'Estadio Pascual Guerrero',
        description: 'Centro deportivo con acceso rápido desde el río',
        lat: 3.4212,
        lng: -76.5348,
        capacity: '25.000 personas'
      },
      {
        name: 'Parque del Perro',
        description: 'Punto de reunión seguro en el sur de Cali',
        lat: 3.4236,
        lng: -76.5320,
        capacity: '2.000 personas'
      },
      {
        name: 'Jardín Botánico de Cali',
        description: 'Zona verde amplia con rutas de evacuación',
        lat: 3.4509,
        lng: -76.5190,
        capacity: '3.000 personas'
      }
    ];

    let reports = [];

    function loadReports() {
      reports = JSON.parse(localStorage.getItem('satdReports') || '[]');
    }

    function saveReports() {
      localStorage.setItem('satdReports', JSON.stringify(reports));
    }

    function getCurrentAuthor() {
      return {
        id: app.userType === 'guest' ? getDeviceId() : app.user,
        type: app.userType,
        label: app.userType === 'guest' ? 'Invitado' : app.user
      };
    }

    function canPostReport() {
      if (app.userType === 'guest') return { allowed: true };
      if (!app.user) return { allowed: false, message: 'Debes iniciar sesión para reportar.' };

      const user = registeredUsers[app.user];
      const now = Date.now();
      if (user.reportBanUntil && user.reportBanUntil > now) {
        const minutes = Math.ceil((user.reportBanUntil - now) / 60000);
        return { allowed: false, message: `No puedes publicar reportes por ${minutes} minutos.` };
      }
      return { allowed: true };
    }

    function canComment() {
      if (!app.user) return { allowed: false, message: 'Debes iniciar sesión para comentar.' };
      const user = registeredUsers[app.user];
      const now = Date.now();
      if (user.commentBanUntil && user.commentBanUntil > now) {
        const minutes = Math.ceil((user.commentBanUntil - now) / 60000);
        return { allowed: false, message: `No puedes comentar por ${minutes} minutos.` };
      }
      return { allowed: true };
    }

    function getAnalysisResult(text, photoName) {
      const lower = text.toLowerCase();
      const obsceneWords = ['mierda', 'puta', 'puto', 'coño', 'culo', 'pene', 'vagina', 'sexo', 'bolas'];
      const relatedWords = ['río', 'rio', 'cali', 'inundación', 'inundacion', 'desbordamiento', 'lluvia', 'agua', 'corriente', 'orilla', 'orillas', 'caudal', 'nivel', 'desastre', 'evacuación', 'evacuacion', 'embalse', 'barranco'];
      const foundObscene = obsceneWords.some(word => lower.includes(word));
      if (foundObscene) return { status: 'rejected', reason: 'obscene', message: 'Tu publicación tiene imágenes o contexto obsceno no apropiado.' };
      const foundRelated = relatedWords.some(word => lower.includes(word));
      if (!foundRelated) return { status: 'rejected', reason: 'unrelated', message: 'Recuerda el objetivo de la página !! Tu publicación no fue aprobada.' };
      return { status: 'accepted' };
    }

    function applyUserPenalty(author, reason, isComment) {
      const key = isComment ? 'commentWarnings' : 'reportWarnings';
      const banKey = isComment ? 'commentBanUntil' : 'reportBanUntil';
      const now = Date.now();
      const durations = [5, 30, 300, 300, 1440];

      if (author.type === 'guest') {
        const deviceId = author.id;
        const record = getGuestBan(deviceId);
        record[key] = (record[key] || 0) + 1;
        const count = record[key];
        if (count === 1) {
          record[key + 'Message'] = reason === 'obscene'
            ? 'Tu publicación tiene imágenes o contexto obsceno no apropiado.'
            : 'Recuerda el objetivo de la página !! Tu publicación no fue aprobada.';
        } else if (count > 1 && count <= 5) {
          record[banKey] = now + durations[count - 1] * 60000;
        } else {
          record.needsAdminReview = true;
        }
        setGuestBan(deviceId, record);
        return;
      }

      const target = registeredUsers[author.id];
      if (!target) return;
      target[key] = (target[key] || 0) + 1;
      const count = target[key];
      if (count === 1) {
        target[key + 'Message'] = reason === 'obscene'
          ? 'Tu publicación tiene imágenes o contexto obsceno no apropiado.'
          : 'Recuerda el objetivo de la página !! Tu publicación no fue aprobada.';
      } else if (count > 1 && count <= 5) {
        target[banKey] = now + durations[count - 1] * 60000;
      } else {
        target.needsAdminReview = true;
      }
      saveUserDatabase();
    }

    function createReportEntry(text, imageData) {
      const author = getCurrentAuthor();
      const now = Date.now();
      const report = {
        id: 'rpt-' + now + '-' + Math.random().toString(36).slice(2, 8),
        author: author.label,
        authorId: author.id,
        authorType: author.type,
        deviceId: author.type === 'guest' ? getDeviceId() : null,
        text,
        imageData,
        timestamp: now,
        status: 'pending',
        analysis: 'En revisión automática',
        comments: [],
        warnings: 0,
        result: null
      };
      reports.unshift(report);
      saveReports();
      scheduleReportAnalysis(report.id);
      renderReportFeed();
      renderMemberPanel();
      toast('Reporte publicado. Se analizará en 2 minutos.');
    }

    function scheduleReportAnalysis(reportId) {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;
      const delay = Math.max(0, 120000 - (Date.now() - report.timestamp));
      setTimeout(() => analyzeReport(reportId), delay);
    }

    function analyzeReport(reportId) {
      const report = reports.find(r => r.id === reportId);
      if (!report || report.status !== 'pending') return;
      const analysis = getAnalysisResult(report.text, report.imageData ? 'photo' : '');
      if (analysis.status === 'accepted') {
        report.status = 'approved';
        report.analysis = 'Aprobado automáticamente';
      } else {
        report.status = 'rejected';
        report.analysis = analysis.message;
        report.result = analysis.reason;
        applyUserPenalty({ id: report.authorId, type: report.authorType }, analysis.reason, false);
      }
      saveReports();
      renderReportFeed();
    }

    function analyzePendingMedia() {
      reports.filter(r => r.status === 'pending').forEach(report => scheduleReportAnalysis(report.id));
    }

    function submitReport() {
      const text = document.getElementById('reportText').value.trim();
      const photoInput = document.getElementById('reportPhoto');
      const permission = canPostReport();
      if (!permission.allowed) {
        showError(permission.message);
        return;
      }
      if (!text) {
        showError('Escribe una descripción del problema.');
        return;
      }

      const file = photoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          createReportEntry(text, e.target.result);
          document.getElementById('reportText').value = '';
          photoInput.value = '';
        };
        reader.readAsDataURL(file);
      } else {
        createReportEntry(text, null);
        document.getElementById('reportText').value = '';
      }
    }

    function renderReportFeed() {
      const feed = document.getElementById('reportFeed');
      if (!feed) return;
      if (reports.length === 0) {
        feed.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay reportes aun.</p>';
        return;
      }

      const grouped = {};
      reports.slice().sort((a, b) => b.timestamp - a.timestamp).forEach(report => {
        const d = new Date(report.timestamp);
        const year = d.getFullYear();
        const month = d.toLocaleString('es-CO', { month: 'long' });
        const day = d.getDate();
        const hour = ('0' + d.getHours()).slice(-2) + ':00';
        grouped[year] = grouped[year] || {};
        grouped[year][month] = grouped[year][month] || {};
        grouped[year][month][day] = grouped[year][month][day] || {};
        grouped[year][month][day][hour] = grouped[year][month][day][hour] || [];
        grouped[year][month][day][hour].push(report);
      });

      let html = '';
      Object.keys(grouped).sort((a, b) => b - a).forEach(year => {
        html += `<div class="report-card"><strong>Año ${year}</strong></div>`;
        Object.keys(grouped[year]).forEach(month => {
          html += `<div class="report-card" style="background:#f7f7fa;"><strong>Mes: ${month}</strong></div>`;
          Object.keys(grouped[year][month]).forEach(day => {
            html += `<div class="report-card" style="background:#f2f2ff;"><strong>Día: ${day}</strong></div>`;
            Object.keys(grouped[year][month][day]).forEach(hour => {
              html += `<div class="report-card" style="background:#eef5ff;"><strong>Hora: ${hour}</strong></div>`;
              grouped[year][month][day][hour].forEach(report => {
                html += renderReportItem(report);
              });
            });
          });
        });
      });
      feed.innerHTML = html;
    }

    function renderReportItem(report) {
      const isOwn = app.userType !== 'guest' && report.authorId === app.user;
      const canAdmin = app.userType === 'admin';
      const statusLabel = report.status === 'pending' ? 'â³ En revisión' : report.status === 'approved' ? '✕⬦ Aprobado' : 'â� Rechazado';
      const moderation = report.status === 'rejected' ? `<div class="warning-badge">${report.analysis}</div>` : `<div class="report-meta">${report.analysis}</div>`;
      const comments = report.comments.slice().sort((a,b)=>a.timestamp-b.timestamp).map(comment => `
        <div class="report-comment">
          <div class="report-meta"><strong>${comment.author}</strong> �· ${new Date(comment.timestamp).toLocaleString('es-CO')}</div>
          <div>${comment.text}</div>
          <div class="report-meta">${comment.status === 'pending' ? 'Pendiente de análisis' : comment.status === 'rejected' ? 'Rechazado' : 'Aprobado'}</div>
          ${canAdmin ? `<button class="btn-secondary" style="margin-top:8px;" onclick="deleteComment('${report.id}', '${comment.id}')">Eliminar comentario</button>` : ''}
        </div>
      `).join('');
      return `
        <div class="report-card">
          <div class="report-meta">${report.authorType === 'guest' ? 'Invitado' : report.author} �· ${new Date(report.timestamp).toLocaleString('es-CO')}</div>
          <div>${report.text}</div>
          ${report.imageData ? `<img class="report-photo" src="${report.imageData}" alt="Foto del reporte">` : ''}
          <div class="report-meta">Estado: ${statusLabel}</div>
          ${moderation}
          <div class="report-actions" style="margin-top: 12px; display:flex; gap:10px; flex-wrap:wrap;">${canAdmin ? `<button class="btn-secondary" onclick="deleteReport('${report.id}')">Eliminar reporte</button>` : ''}${canAdmin && report.status === 'pending' ? `<button class="btn-primary" onclick="approveReport('${report.id}')">Aprobar</button>` : ''}</div>
          <div class="report-comments">
            <strong>Comentarios</strong>
            ${comments || '<p style="color:#999;">No hay comentarios aun.</p>'}
            <div style="margin-top:12px;">
              <textarea id="commentText-${report.id}" rows="3" placeholder="Escribir comentario..." style="width:100%;"></textarea>
              <button class="btn-primary" style="margin-top:8px;" onclick="addComment('${report.id}')">Enviar comentario</button>
            </div>
          </div>
        </div>
      `;
    }

    function addComment(reportId) {
      const commentText = document.getElementById(`commentText-${reportId}`).value.trim();
      if (!commentText) {
        showError('Escribe un comentario antes de enviar.');
        return;
      }
      const permission = canComment();
      if (!permission.allowed) {
        showError(permission.message);
        return;
      }
      const report = reports.find(r => r.id === reportId);
      if (!report) return;
      const author = getCurrentAuthor();
      const comment = {
        id: 'cmt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        author: author.label,
        authorId: author.id,
        authorType: author.type,
        text: commentText,
        timestamp: Date.now(),
        status: 'pending'
      };
      report.comments.push(comment);
      saveReports();
      document.getElementById(`commentText-${reportId}`).value = '';
      renderReportFeed();
      setTimeout(() => analyzeComment(reportId, comment.id), 120000);
    }

    function analyzeComment(reportId, commentId) {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;
      const comment = report.comments.find(c => c.id === commentId);
      if (!comment || comment.status !== 'pending') return;
      const result = getAnalysisResult(comment.text, 'comment');
      if (result.status === 'accepted') {
        comment.status = 'approved';
      } else {
        comment.status = 'rejected';
        applyUserPenalty({ id: comment.authorId, type: comment.authorType }, result.reason, true);
        toast(result.message);
      }
      saveReports();
      renderReportFeed();
    }

    function deleteReport(reportId) {
      reports = reports.filter(r => r.id !== reportId);
      saveReports();
      renderReportFeed();
    }

    function deleteComment(reportId, commentId) {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;
      report.comments = report.comments.filter(c => c.id !== commentId);
      saveReports();
      renderReportFeed();
    }

    function approveReport(reportId) {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;
      report.status = 'approved';
      report.analysis = 'Aprobado por administrador';
      saveReports();
      renderReportFeed();
    }

    function renderMemberPanel() {
      const container = document.getElementById('membersList');
      if (!container) return;
      const users = Object.keys(registeredUsers).sort();
      const guestRecords = loadGuestBanRecords();
      let html = '';
      users.forEach(phone => {
        const user = registeredUsers[phone];
        const ban = getBanState(phone);
        const warnings = (user.reportWarnings || 0) + (user.commentWarnings || 0);
        html += `<div class="member-card">
          <div><strong>${phone}</strong> (${user.type})</div>
          <div style="margin-top:6px; color:#555;">${ban.blocked ? `Bloqueado: ${getBlockMessage(phone)}` : 'Activo'}${warnings ? ` ✕�¢ Advertencias: ${warnings}` : ''}</div>
          <div class="member-actions">
            ${ban.blocked ? `<button class="btn-secondary" onclick="unblockUser('${phone}')">Desbloquear</button>` : `<button class="btn-red" onclick="blockUser('${phone}', 3600000)">Bloquear 1h</button>`}
            ${ban.blocked ? '' : `<button class="btn-secondary" onclick="blockUser('${phone}', 86400000)">Bloquear 24h</button><button class="btn-secondary" onclick="blockUser('${phone}', 31536000000)">Bloquear permanente</button>`}
          </div>
        </div>`;
      });
      Object.keys(guestRecords).forEach(deviceId => {
        const guest = guestRecords[deviceId];
        const warnings = (guest.reportWarnings || 0) + (guest.commentWarnings || 0);
        html += `<div class="member-card">
          <div><strong>Invitado</strong> �· ${deviceId}</div>
          <div style="margin-top:6px; color:#555;">${guest.blockedUntil && guest.blockedUntil > Date.now() ? `Bloqueado: ${Math.ceil((guest.blockedUntil - Date.now()) / 60000)} min` : 'Activo'}${warnings ? ` ✕�¢ Advertencias: ${warnings}` : ''}</div>
          <div class="member-actions">
            <button class="btn-red" onclick="kickGuest('${deviceId}')">Kick</button>
            <button class="btn-secondary" onclick="unblockGuest('${deviceId}')">Desbloquear</button>
          </div>
        </div>`;
      });
      container.innerHTML = html || '<p style="color:#999;">No hay miembros registrados o invitados aun.</p>';
    }

    function kickGuest(deviceId) {
      const ban = applyGuestKick(deviceId);
      toast(`Invitado bloqueado por ${Math.ceil((ban.blockedUntil - Date.now()) / 60000)} minutos.`);
      renderMemberPanel();
    }

    function unblockGuest(deviceId) {
      const records = loadGuestBanRecords();
      if (records[deviceId]) {
        records[deviceId].blockedUntil = 0;
        saveGuestBanRecords(records);
      }
      renderMemberPanel();
    }

    function analyzePendingItems() {
      reports.forEach(report => {
        if (report.status === 'pending') scheduleReportAnalysis(report.id);
        report.comments.forEach(comment => {
          if (comment.status === 'pending' && Date.now() - comment.timestamp >= 120000) {
            analyzeComment(report.id, comment.id);
          }
        });
      });
    }

    // ===== LOGIN =====
    function login() {
      const phone = document.getElementById('phone').value.trim();
      const pass = document.getElementById('password').value;

      if (!phone || !pass) {
        showError('Completa los campos');
        return;
      }

      const key = findUserKey(phone);
      if (!key || registeredUsers[key].pass !== pass) {
        showError('Datos incorrectos');
        return;
      }

      const ban = getBanState(key);
      if (ban.blocked) {
        showError(`Usuario bloqueado. ${ban.message}`);
        return;
      }

      app.user = key;
      app.userType = registeredUsers[key].type;
      localStorage.setItem('satdUser', key);
      document.getElementById('loginPage').classList.remove('active');
      document.getElementById('appPage').classList.add('active');
      initApp();
      toast('✕�S �¡Bienvenido ' + phone + '!');
    }

    function guestLogin() {
      const deviceId = getDeviceId();
      const ban = getBanState(deviceId);
      if (ban.blocked) {
        showError(`Invitado bloqueado. ${ban.message}`);
        return;
      }

      app.user = 'Invitado';
      app.userType = 'guest';
      localStorage.removeItem('satdUser');
      document.getElementById('loginPage').classList.remove('active');
      document.getElementById('appPage').classList.add('active');
      initApp();
      toast('��⬹ Bienvenido invitado');
    }

    function logout() {
      app.user = null;
      app.userType = null;
      localStorage.removeItem('satdUser');
      document.getElementById('appPage').classList.remove('active');
      document.getElementById('loginPage').classList.add('active');
      document.getElementById('phone').value = '';
      document.getElementById('password').value = '';
      toast('Sesión cerrada');
    }

    function sendVerificationCode() {
      const countrySelect = document.getElementById('registerCountry');
      const country = countrySelect.value;
      const countryCode = countrySelect.selectedOptions[0].dataset.code || '+57';
      const localPhone = document.getElementById('registerPhone').value.trim();
      const captchaAnswer = document.getElementById('captchaAnswer').value.trim();

      if (!localPhone) {
        showError('Ingresa un numero de teléfono local válido');
        return;
      }

      if (!captchaAnswer || !app.registerCaptcha || Number(captchaAnswer) !== app.registerCaptcha.answer) {
        showError('Verificación humana incorrecta. Resuelve el captcha.');
        app.registerCaptcha = newCaptchaChallenge();
        document.getElementById('captchaHint').textContent = `Resuelve: ${app.registerCaptcha.question}`;
        return;
      }

      const phone = normalizePhone(countryCode + localPhone);
      if (registeredUsers[phone]) {
        showError('Ese numero ya está registrado');
        return;
      }

      const code = '123'; // Código fijo para entorno simulado
      app.pendingVerification = {
        phone,
        country,
        countryCode,
        localPhone,
        code,
        expires: Date.now() + 86400000 // válido 24h en modo simulado
      };

      document.getElementById('registerHint').innerHTML = `Código (simulado) asignado: ${code}. Escribe ${code} para verificar tu número.`;
    }

    function verifyRegistration() {
      const code = document.getElementById('verificationCode').value.trim();
      if (!app.pendingVerification) {
        showError('Primero solicita un código de verificación');
        return;
      }
      if (Date.now() > app.pendingVerification.expires) {
        showError('El código expiró. Solicita uno nuevo');
        app.pendingVerification = null;
        return;
      }
      if (code !== app.pendingVerification.code) {
        showError('Código incorrecto');
        return;
      }

      const phone = app.pendingVerification.phone;
      registeredUsers[phone] = {
        type: 'user',
        pass: phone,
        country: app.pendingVerification.country,
        countryCode: app.pendingVerification.countryCode,
        localPhone: app.pendingVerification.localPhone
      };
      saveUserDatabase();
      app.pendingVerification = null;
      closeModal('registerModal');
      document.getElementById('phone').value = phone;
      document.getElementById('password').value = phone;
      toast('✕�S Cuenta creada. Inicia sesión con tu numero.');
    }

    function showError(msg) {
      const el = document.getElementById('error');
      el.textContent = 'âš ï¸ ' + msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 3000);
    }

    // ===== APP =====
    function initApp() {
      if (document.getElementById('userBadge')) document.getElementById('userBadge').textContent = app.userType === 'guest' ? '👤 Invitado' : '👤 ' + app.user;
      if (document.getElementById('userPhone')) document.getElementById('userPhone').textContent = app.userType === 'guest' ? 'Invitado' : app.user;
      document.body.classList.toggle('admin-mode', app.userType === 'admin');
      document.body.classList.toggle('user-mode', app.userType === 'user');
      document.body.classList.toggle('guest-mode', app.userType === 'guest');
      if (document.getElementById('panicCard')) document.getElementById('panicCard').style.display = app.userType === 'user' || app.userType === 'admin' ? 'block' : 'none';
      if (document.getElementById('adminControls')) document.getElementById('adminControls').style.display = app.userType === 'admin' ? 'block' : 'none';
      if (document.getElementById('membersPanel')) document.getElementById('membersPanel').style.display = app.userType === 'admin' ? 'block' : 'none';
      if (document.getElementById('panicStatus')) document.getElementById('panicStatus').textContent = 'No hay emergencia activa';
      update();
      renderMemberPanel();
      renderReportFeed();
      setInterval(update, 3000);
      syncPanicFromStorage();
      window.addEventListener('storage', event => {
        if (event.key === 'satdPanicEvent') {
          syncPanicFromStorage();
        }
      });
    }

    function getAlert(level) {
      if (level >= 3.5) return { emoji: '🔴', title: 'Roja', msg: '�¡EVACUAR INMEDIATAMENTE!', color: '#f44336', type: 'red', scene: 'danger' };
      if (level >= 2.8) return { emoji: '🟠', title: 'Naranja', msg: 'Preparación para evacuación inmediata', color: '#ff9800', type: 'orange', scene: 'warning' };
      return { emoji: '🟡', title: 'Amarilla', msg: 'Estar atento a cambios', color: '#ffd700', type: 'yellow', scene: 'tranquil' };
    }

    function initRiverAudio() {
      if (app.riverAudio || !(window.AudioContext || window.webkitAudioContext)) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i += 1) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 700;

        const gain = audioCtx.createGain();
        gain.gain.value = 0;

        noise.connect(filter).connect(gain).connect(audioCtx.destination);
        noise.start();

        app.riverAudio = { audioCtx, noise, filter, gain };
      } catch (error) {
        console.warn('No se pudo inicializar audio del río:', error);
      }
    }

    function updateRiverAudio(type) {
      if (!app.riverAudio) return;
      const settings = {
        yellow: { freq: 600, gain: 0.12 },
        orange: { freq: 780, gain: 0.18 },
        red: { freq: 920, gain: 0.28 }
      };
      const config = settings[type] || settings.yellow;
      app.riverAudio.filter.frequency.setTargetAtTime(config.freq, app.riverAudio.audioCtx.currentTime, 0.2);
      app.riverAudio.gain.gain.setTargetAtTime(app.riverAudioActive ? config.gain : 0, app.riverAudio.audioCtx.currentTime, 0.1);
    }

    function updateRiverScene(type) {
      const scene = type === 'red' ? 'danger' : type === 'orange' ? 'warning' : 'tranquil';
      app.riverSceneType = scene;
      document.body.classList.remove('tranquil', 'warning', 'danger');
      document.body.classList.add(scene);

      const title = 'Río Cali - Cámara en vivo';
      const descriptions = {
        yellow: 'Corriente moderada y niveles bajo vigilancia constante.',
        orange: 'Corriente agitada y riberas en alerta máxima.',
        red: 'Aguas crecidas, movimientos peligrosos y riesgo inminente.'
      };
      const statuses = {
        yellow: 'Estado: Tranquilo',
        orange: 'Estado: Alerta Naranja',
        red: 'Estado: Alerta Roja'
      };
      document.getElementById('riverVideoTitle').textContent = title;
      document.getElementById('riverVideoDescription').textContent = descriptions[type] || descriptions.yellow;
      document.getElementById('riverVideoStatus').textContent = statuses[type] || statuses.yellow;

      const player = document.getElementById('riverVideoPlayer');
      player.dataset.scene = scene;
      player.style.boxShadow = scene === 'danger'
        ? 'inset 0 0 120px rgba(255, 80, 80, 0.35)'
        : scene === 'warning'
          ? 'inset 0 0 90px rgba(255, 200, 80, 0.25)'
          : 'inset 0 0 80px rgba(0, 150, 255, 0.2)';

      initRiverAudio();
      updateRiverAudio(type);
    }

    function toggleRiverAudio() {
      initRiverAudio();
      if (!app.riverAudio) {
        toast('Audio del río no disponible en este navegador');
        return;
      }

      app.riverAudioActive = !app.riverAudioActive;
      if (app.riverAudio.audioCtx.state === 'suspended') {
        app.riverAudio.audioCtx.resume();
      }
      updateRiverAudio(app.riverSceneType === 'danger' ? 'red' : app.riverSceneType === 'warning' ? 'orange' : 'yellow');

      const btn = document.querySelector('.river-controls button.btn-secondary');
      if (btn) {
        btn.textContent = app.riverAudioActive ? 'Pausar sonido' : 'Reproducir sonido';
      }
      toast(app.riverAudioActive ? '📋Š Sonido del río activado' : '📋⬡ Sonido del río pausado');
    }

    function forceRiverScene() {
      updateRiverScene(app.riverSceneType === 'danger' ? 'red' : app.riverSceneType === 'warning' ? 'orange' : 'yellow');
      toast('Actualización de cámara del río realizada');
    }

    function rand(prev) {
      const change = (Math.random() * 0.26) - 0.13;
      let next = prev + change;
      return Math.max(1.2, Math.min(4.4, parseFloat(next.toFixed(2))));
    }

    function update() {
      if (app.simulating) app.level = rand(app.level);

      const alert = getAlert(app.level);
      if (document.getElementById('levelValue')) document.getElementById('levelValue').textContent = app.level.toFixed(2);
      if (document.getElementById('levelBadge')) document.getElementById('levelBadge').textContent = '📊 ' + app.level.toFixed(2) + ' m';
      if (document.getElementById('alertBadge')) document.getElementById('alertBadge').textContent = alert.emoji + ' ' + alert.title;
      if (document.getElementById('alertBadge')) document.getElementById('alertBadge').style.background = alert.color;
      if (document.getElementById('statusText')) document.getElementById('statusText').textContent = alert.msg;
      updateRiverScene(alert.type);

      drawChart();

      // Auto SMS
      if (app.level >= 2.8) {
        const now = Date.now();
        if (now - app.lastSMSTime > 5000) {
          const type = app.level >= 3.5 ? 'red' : 'orange';
          sendSMS(type);
          app.lastSMSTime = now;
        }
      }
    }

    function drawChart() {
      const chart = document.getElementById('chart');
      chart.innerHTML = '';
      const bars = [28, 36, 44, 50, 60, 68, 76, 88, 82, 94];
      bars.forEach(h => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = h + '%';
        chart.appendChild(bar);
      });
    }

    // ===== MODAL FUNCTIONS =====
    function openModal(modalId, data) {
      document.getElementById(modalId).classList.add('active');

      if (modalId === 'alertModal') {
        app.currentAlertType = data;
        const alerts = {
          yellow: { emoji: '🟡', title: 'Alerta Amarilla', msg: 'Se enviará notificación a los 4 numeros registrados' },
          orange: { emoji: '🟠', title: 'Alerta Naranja', msg: 'Nivel del río en aumento. Preparar evacuación.' },
          red: { emoji: '🔴', title: 'Alerta Roja', msg: '�¡PELIGRO! Nivel crítico. EVACUAR INMEDIATAMENTE.' }
        };
        const a = alerts[data];
        document.getElementById('alertModalTitle').textContent = a.emoji + ' ' + a.title;
        document.getElementById('alertModalBody').innerHTML = `<p style="font-size: 16px; color: var(--dark); font-weight: 600; margin-bottom: 15px;">${a.msg}</p><p style="color: #666;">Nivel actual: <strong>${app.level.toFixed(2)}m</strong></p>`;
      }

      if (modalId === 'statsModal') {
        document.getElementById('statsBody').innerHTML = `
          <p><strong>📊Š Alertas enviadas:</strong> ${app.sms.length}</p>
          <p><strong>📋⬝ Eventos registrados:</strong> ${app.alerts.length}</p>
          <p><strong>📊�  Nivel máximo:</strong> 4.2 m</p>
          <p><strong>📊⬰ Nivel mínimo:</strong> 1.5 m</p>
          <p><strong>â±ï¸ Tiempo promedio de respuesta:</strong> 2.3 segundos</p>
        `;
      }

      if (modalId === 'registerModal') {
        app.registerCaptcha = newCaptchaChallenge();
        document.getElementById('captchaHint').textContent = `Resuelve: ${app.registerCaptcha.question}`;
        document.getElementById('captchaAnswer').value = '';
      }

      if (modalId === 'zonesModal') {
        requestLocation();
      }
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
    }

    function getDistance(lat1, lon1, lat2, lon2) {
      const rad = Math.PI / 180;
      const dLat = (lat2 - lat1) * rad;
      const dLon = (lon2 - lon1) * rad;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return 6371 * c;
    }

    function formatDistance(km) {
      return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
    }

    function requestLocation() {
      const body = document.getElementById('zonesBody');
      body.innerHTML = '<p>Solicitando permiso de ubicación... â³</p>';

      if (!navigator.geolocation) {
        app.locationError = 'Tu navegador no soporta geolocalización.';
        renderZones();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          app.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          app.locationError = null;
          renderZones();
        },
        error => {
          app.location = null;
          app.locationError = 'No se pudo obtener la ubicación. Activa el permiso en el navegador.';
          renderZones();
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }

    function renderZones() {
      const body = document.getElementById('zonesBody');

      if (app.locationError) {
        body.innerHTML = `
          <p style="color: #f44336; font-weight: 600;">${app.locationError}</p>
          <p style="color: #666; margin-bottom: 20px;">Abre de nuevo este panel o presiona reintentar para permitir el acceso a tu ubicación.</p>
          <button class="btn-primary" style="width: 100%;" onclick="requestLocation()">📋�~ Reintentar ubicación</button>
        `;
        return;
      }

      const locationDetails = app.location
        ? `<p style="margin-bottom: 15px; color: #444;"><strong>Ubicación actual:</strong> ${app.location.lat.toFixed(5)}, ${app.location.lng.toFixed(5)}</p>`
        : '<p style="margin-bottom: 15px; color: #444;"><strong>Ubicación actual:</strong> No disponible</p>';

      const zoneCards = SAFE_ZONES.map(zone => {
        const distance = app.location ? formatDistance(getDistance(app.location.lat, app.location.lng, zone.lat, zone.lng)) : 'N/D';
        return `
          <div class="card" style="margin-bottom: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            <div class="card-header">${zone.name}</div>
            <h3 style="margin-bottom: 10px;">${zone.description}</h3>
            <p style="margin: 0 0 10px; color: #666;">Distancia: <strong>${distance}</strong></p>
            <p style="margin: 0 0 15px; color: #666;">Capacidad estimada: <strong>${zone.capacity}</strong></p>
            <button class="btn-secondary" style="width: 100%;" onclick="openDirections(${zone.lat}, ${zone.lng}, '${zone.name}')">š� Abrir en Maps</button>
          </div>
        `;
      }).join('');

      body.innerHTML = `${locationDetails}${zoneCards}`;
    }

    function openDirections(lat, lng, label) {
      const destination = `${lat},${lng}`;
      let url;
      if (app.location) {
        const origin = `${app.location.lat},${app.location.lng}`;
        url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
      } else {
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
      }
      window.open(url, '_blank');
    }

    function triggerPanic() {
      if (app.userType !== 'user') {
        toast('Solo usuarios registrados pueden activar el botón de pánico.');
        return;
      }

      if (!navigator.geolocation) {
        toast('Tu navegador no soporta geolocalización.');
        return;
      }

      document.getElementById('panicStatus').textContent = 'Solicitando ubicación de emergencia...';
      navigator.geolocation.getCurrentPosition(
        position => {
          app.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          app.panicEvent = {
            active: true,
            phone: app.user,
            lat: app.location.lat,
            lng: app.location.lng,
            time: new Date().toLocaleTimeString('es-CO'),
            updated: Date.now()
          };

          localStorage.setItem('satdPanicEvent', JSON.stringify(app.panicEvent));
          renderPanicBanner();
          watchPanicLocation();
          simulateEmergencySMS(app.panicEvent);
          toast('🚨 Emergencia activada. Notificando a usuarios y servicios de emergencia.');
        },
        () => {
          toast('No se pudo obtener la ubicación. Activa el permiso de ubicación.');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }

    function watchPanicLocation() {
      if (app.panicWatchId || !navigator.geolocation) return;
      app.panicWatchId = navigator.geolocation.watchPosition(
        position => {
          if (!app.panicEvent || !app.panicEvent.active) return;
          app.panicEvent.lat = position.coords.latitude;
          app.panicEvent.lng = position.coords.longitude;
          app.panicEvent.updated = Date.now();
          localStorage.setItem('satdPanicEvent', JSON.stringify(app.panicEvent));
          renderPanicBanner();
        },
        () => {},
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000
        }
      );
    }

    function endPanic() {
      if (app.panicWatchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(app.panicWatchId);
      }
      app.panicWatchId = null;
      app.panicEvent = null;
      localStorage.removeItem('satdPanicEvent');
      document.getElementById('panicStatus').textContent = 'No hay emergencia activa';
      renderPanicBanner();
      toast('Emergencia finalizada');
    }

    function renderPanicBanner() {
      const banner = document.getElementById('panicBanner');
      if (!app.panicEvent || !app.panicEvent.active) {
        banner.style.display = 'none';
        return;
      }

      banner.style.display = 'block';
      const userNote = app.user === app.panicEvent.phone ? 'Tu ubicación se comparte en tiempo real.' : 'Revisa la ruta y ayuda.';
      banner.innerHTML = `
        <h3>🚨 Usuario en apuros</h3>
        <p><strong>Usuario:</strong> ${app.panicEvent.phone}</p>
        <p><strong>Ubicación:</strong> ${app.panicEvent.lat.toFixed(5)}, ${app.panicEvent.lng.toFixed(5)}</p>
        <p style="color: #666; margin-bottom: 16px;">${userNote}</p>
        <div class="modal-actions" style="grid-template-columns: 1fr ${app.user === app.panicEvent.phone ? '1fr' : 'auto'}; gap: 12px;">
          <button class="btn-primary" onclick="openPanicMap()">Ver ruta en Maps</button>
          ${app.user === app.panicEvent.phone ? '<button class="btn-secondary" onclick="endPanic()">Finalizar emergencia</button>' : ''}
        </div>
      `;

      if (app.userType === 'user' && app.user === app.panicEvent.phone) {
        document.getElementById('panicStatus').textContent = 'Emergencia activa. Compartiendo ubicación en tiempo real.';
      } else if (app.userType !== 'guest') {
        document.getElementById('panicStatus').textContent = 'Hay una emergencia activa. Mira el banner superior.';
      }
    }

    function syncPanicFromStorage() {
      const raw = localStorage.getItem('satdPanicEvent');
      if (!raw) {
        app.panicEvent = null;
        renderPanicBanner();
        return;
      }
      try {
        const event = JSON.parse(raw);
        if (event && event.active) {
          app.panicEvent = event;
          renderPanicBanner();
          return;
        }
      } catch (e) {}
      app.panicEvent = null;
      renderPanicBanner();
    }

    function simulateEmergencySMS(event) {
      const publicServices = [
        { name: 'Bomberos', phone: '+573002221111' },
        { name: 'Policía', phone: '+573002221222' }
      ];
      const message = `[SATD EMERGENCIA] Usuario ${event.phone} necesita ayuda urgente. Ubicación: ${event.lat.toFixed(5)}, ${event.lng.toFixed(5)}.`;
      const now = new Date().toLocaleTimeString('es-CO');

      publicServices.forEach(service => {
        app.sms.unshift({
          phone: service.phone,
          msg: `[SIMULADO ${service.name}] ${message}`,
          time: now,
          type: 'service'
        });
      });

      Object.keys(registeredUsers).forEach(phone => {
        if (registeredUsers[phone].type === 'admin' || registeredUsers[phone].type === 'user') {
          app.sms.unshift({
            phone,
            msg: message,
            time: now,
            type: 'alert'
          });
        }
      });
    }

    function openPanicMap() {
      if (!app.panicEvent) {
        toast('No hay emergencia activa');
        return;
      }
      const destination = `${app.panicEvent.lat},${app.panicEvent.lng}`;
      let url;
      if (app.location) {
        const origin = `${app.location.lat},${app.location.lng}`;
        url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
      } else {
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
      }
      window.open(url, '_blank');
    }

    function confirmAlert() {
      const type = app.currentAlertType;
      addAlert(type);
      sendSMS(type);
      closeModal('alertModal');
      const names = { yellow: 'Amarilla', orange: 'Naranja', red: 'Roja' };
      toast('✕�S Alerta ' + names[type] + ' activada');
    }

    function addAlert(type) {
      const times = { yellow: '🟡', orange: '🟠', red: '🔴' };
      const names = { yellow: 'Amarilla', orange: 'Naranja', red: 'Roja' };
      const now = new Date().toLocaleTimeString('es-CO');

      app.alerts.push({ type, name: names[type], time: now, emoji: times[type] });

      const html = `
        <div class="list-item">
          <div class="item-info">
            <h4>${times[type]} ${names[type]}</h4>
            <p>Nivel: ${app.level.toFixed(2)}m</p>
          </div>
          <div class="item-time">${now}</div>
        </div>
      `;
      document.getElementById('alertList').innerHTML = html + (document.getElementById('alertList').innerHTML === '<p style="text-align: center; color: #999; padding: 20px;">Sin alertas aún</p>' ? '' : document.getElementById('alertList').innerHTML);

      if (document.getElementById('alertList').children.length > 8) {
        document.getElementById('alertList').removeChild(document.getElementById('alertList').lastChild);
      }
    }

    function sendSMS(type) {
      const msgs = {
        yellow: { title: 'ALERTA AMARILLA', text: 'Nivel en aumento. Estar atento.' },
        orange: { title: 'ALERTA NARANJA', text: 'Nivel crítico. Preparar evacuación.' },
        red: { title: 'ALERTA ROJA', text: 'Nivel muy alto. �¡EVACUAR AHORA!' }
      };

      const m = msgs[type];
      const now = new Date().toLocaleTimeString('es-CO');
      const message = `[SATD] ${m.title}: ${app.level.toFixed(2)}m. ${m.text}`;

      // Simulación local: registrar el SMS en el bufer y mostrar notificación
      Object.keys(registeredUsers).forEach(phone => {
        if (registeredUsers[phone].type === 'admin' || registeredUsers[phone].type === 'user') {
          app.sms.unshift({ phone, msg: message, time: now, type: 'alert' });
        }
      });
      toast('Simulación: alertas registradas (no se envió SMS real)');
    }

    function openSMSComposer(phone, msg) {
      const url = `sms:${phone}?body=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    }

    function toggleSimulation() {
      app.simulating = !app.simulating;
      document.getElementById('simulStatus').textContent = app.simulating ? 'Ÿ¢ Activo' : '🔴 Inactivo';
      document.getElementById('simulStatus').style.color = app.simulating ? '#4caf50' : '#f44336';
      toast(app.simulating ? '✕¶ï¸ Simulación activada' : 'â¸ï¸ Simulación pausada');
    }

    function saveSettings() {
      closeModal('settingsModal');
      toast('�"¾ Configuración guardada');
    }

    function toast(msg) {
      const el = document.createElement('div');
      el.className = 'toast';
      el.textContent = msg;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }

    // ===== INIT =====
    window.addEventListener('load', () => {
      loadUserDatabase();
      loadReports();
      analyzePendingItems();
      const user = localStorage.getItem('satdUser');
      if (user && registeredUsers[user]) {
        app.user = user;
        app.userType = registeredUsers[user].type;
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('appPage').classList.add('active');
        initApp();
      }
    });
  </script>
</body>
</html>

