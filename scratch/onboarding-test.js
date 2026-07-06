const axios = require('axios');

async function run() {
  const email = `test_merchant_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log("Registering...", email);
  try {
    const regRes = await axios.post('https://api.staging.kredar.xyz/api/v1/auth/register', {
      email,
      password,
      confirmPassword: password
    });
    console.log("Register Res:", regRes.status, regRes.data);
  } catch (err) {
    console.error("Register Error:", err.response ? err.response.data : err.message);
    return;
  }

  console.log("Attempting Login...");
  try {
    const loginRes = await axios.post('https://api.staging.kredar.xyz/api/v1/auth/login', {
      email,
      password
    });
    console.log("Login Res:", loginRes.status, loginRes.data);
  } catch (err) {
    console.error("Login Error:", err.response ? err.response.data : err.message);
  }
}

run();
