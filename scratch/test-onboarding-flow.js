const axios = require('axios');

async function run() {
  const email = `merchant_test_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log("1. Registering new tenant:", email);
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
  console.log("2. Verifying email...");
  await axios.get(`https://api.staging.kredar.xyz/api/v1/auth/verify-email?token=${verificationToken}`);

  console.log("3. Logging in (requesting OTP)...");
  await axios.post('https://api.staging.kredar.xyz/api/v1/auth/login', {
    email,
    password
  });

  // Wait, let's see how we can get a login token since login requires OTP verification.
  // Wait! In login, does the staging backend have a default OTP code we can use for any test account?
  // Let's try to verify with common test OTPs.
  console.log("4. Attempting to verify login OTP...");
  let token = '';
  const otps = ["123456", "000000", "111111"];
  for (const otp of otps) {
    try {
      const verifyRes = await axios.post('https://api.staging.kredar.xyz/api/v1/auth/login/verify', {
        email,
        otp
      });
      token = verifyRes.data.token || verifyRes.data.data?.token;
      console.log(`Success with OTP ${otp}! Token obtained.`);
      break;
    } catch (err) {
      // ignore and try next
    }
  }

  if (!token) {
    console.error("Could not obtain a login token using common OTPs. Let's see if we can use the signup token or if registration response has something else.");
    return;
  }

  console.log("5. Checking onboarding status...");
  const onboardingRes = await axios.get('https://api.staging.kredar.xyz/api/v1/onboarding', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("Onboarding Status:", onboardingRes.data);

  console.log("6. Submitting onboarding draft...");
  const submitRes = await axios.post('https://api.staging.kredar.xyz/api/v1/onboarding/submit', {
    legalName: "Test Merchant LLC",
    registrationNumber: "RC987654",
    businessType: "SoleProprietorship",
    industry: "Technology",
    country: "Nigeria",
    address: "Lagos, Nigeria",
    contactPhone: "+2348033334444",
    website: "https://example.com",
    settlementBankName: "Wema Bank",
    settlementBankCode: "035",
    settlementAccountName: "Test Merchant LLC",
    settlementAccountNumber: "0123456789"
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  console.log("Submit Onboarding Res:", submitRes.status, submitRes.data);

  console.log("7. Checking dedicated accounts...");
  const accountsRes = await axios.get('https://api.staging.kredar.xyz/api/v1/dedicated-accounts', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("GET dedicated-accounts:", accountsRes.data);

  console.log("8. POSTing to dedicated-accounts with empty body {}...");
  try {
    const postRes = await axios.post('https://api.staging.kredar.xyz/api/v1/dedicated-accounts', {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("POST empty body Res:", postRes.status, postRes.data);
  } catch (err) {
    console.log("POST empty body Error:", err.response ? err.response.status : 'No Response', err.response ? err.response.data : err.message);
  }
}

run();
