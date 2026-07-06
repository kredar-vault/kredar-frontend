const axios = require('axios');

async function run() {
  const email = `test_merchant_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log("1. Registering...", email);
  let verificationToken = '';
  try {
    const regRes = await axios.post('https://api.staging.kredar.xyz/api/v1/auth/register', {
      email,
      password,
      confirmPassword: password
    });
    verificationToken = regRes.data.data?.verificationToken;
  } catch (err) {
    console.error("Register Error:", err.response ? err.response.data : err.message);
    return;
  }

  console.log("2. Verifying email...");
  await axios.get(`https://api.staging.kredar.xyz/api/v1/auth/verify-email?token=${verificationToken}`);

  console.log("3. Logging in...");
  const loginRes = await axios.post('https://api.staging.kredar.xyz/api/v1/auth/login', {
    email,
    password
  });
  console.log("Login headers:", loginRes.headers);
  console.log("Login data:", loginRes.data);

  const otps = ["123456", "000000", "111111", "999999", "654321"];
  for (const otp of otps) {
    console.log(`Trying OTP: ${otp}...`);
    try {
      const verifyRes = await axios.post('https://api.staging.kredar.xyz/api/v1/auth/login/verify', {
        email,
        otp
      });
      console.log(`SUCCESS with OTP ${otp}! Response:`, verifyRes.data);
      return;
    } catch (err) {
      console.log(`Failed for OTP ${otp}:`, err.response ? err.response.data : err.message);
    }
  }
}

run();
