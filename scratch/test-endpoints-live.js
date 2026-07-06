const axios = require('axios');

async function run() {
  const email = `merchant_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log("1. Registering...", email);
  let regRes;
  try {
    regRes = await axios.post('https://api.staging.kredar.xyz/api/v1/auth/register', {
      email,
      password,
      confirmPassword: password
    });
  } catch (err) {
    console.error("Register Error:", err.response ? err.response.data : err.message);
    return;
  }

  const verificationToken = regRes.data.data?.verificationToken;
  console.log("2. Verifying email with token:", verificationToken);
  await axios.get(`https://api.staging.kredar.xyz/api/v1/auth/verify-email?token=${verificationToken}`);

  console.log("3. Requesting login code...");
  await axios.post('https://api.staging.kredar.xyz/api/v1/auth/login', {
    email,
    password
  });

  // Since we don't have the real email box, wait: does the staging backend have a way to verify without OTP,
  // or is there a backdoor?
  // Let's check if the register response returned the login OTP or if we can find it.
  // Wait, let's see if we can log in directly if we use an admin or if there's a default OTP.
  // Let's try OTP '123456' or similar.
}

run();
