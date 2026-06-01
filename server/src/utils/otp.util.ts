function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
  return { otp, expiresAt };
}

function getOtpHtml(otp: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 480px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 24px;
    }
    h1 {
      font-size: 20px;
      color: #202124;
      margin-bottom: 16px;
      text-align: center;
    }
    .otp-box {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 4px;
      color: #1a73e8;
      background: #f1f3f4;
      padding: 12px;
      border-radius: 6px;
      text-align: center;
      margin: 20px 0;
    }
    p {
      font-size: 14px;
      color: #5f6368;
      text-align: center;
    }
    .footer {
      font-size: 12px;
      color: #9aa0a6;
      text-align: center;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <div class="otp-box">${otp}</div>
    <p>Please use this code to complete your verification. It will expire in 5 minutes.</p>
    <div class="footer">If you didn’t request this, you can safely ignore this email.</div>
  </div>
</body>
</html>`;
}

export { generateOtp, getOtpHtml };
