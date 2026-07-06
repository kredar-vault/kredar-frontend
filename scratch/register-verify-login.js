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
    console.log("Register Res Status:", regRes.status);
    console.log("Register Res Data:", JSON.stringify(regRes.data, null, 2));
    verificationToken = regRes.data.data?.verificationToken;
  } catch (err) {
    console.error("Register Error:", err.response ? err.response.data : err.message);
    return;
  }

  if (!verificationToken) {
    console.error("No verification token returned.");
    return;
  }

  console.log("2. Verifying email with token:", verificationToken);
  try {
    const verifyRes = await axios.get(`https://api.staging.kredar.xyz/api/v1/auth/verify-email?token=${verificationToken}`);
    console.log("Verify Res Status:", verifyRes.status);
    console.log("Verify Res Data:", JSON.stringify(verifyRes.data, null, 2));
  } catch (err) {
    console.error("Verify Error:", err.response ? err.response.data : err.message);
    return;
  }

  console.log("3. Logging in...");
  try {
    const loginRes = await axios.post('https://api.staging.kredar.xyz/api/v1/auth/login', {
      email,
      password
    });
    console.log("Login Res Status:", loginRes.status);
    console.log("Login Res Data:", JSON.stringify(loginRes.data, null, 2));
  } catch (err) {
    console.error("Login Error:", err.response ? err.response.data : err.message);
  }
}

run();
