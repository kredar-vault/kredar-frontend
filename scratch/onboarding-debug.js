const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjA4N2E5YTQwLTk0YjMtNGM2Yy1iMjgzLWQ1MTk2MjRmNjlhMyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InNoZWlkYWJkdWxhaGFkMEBnbWFpbC5jb20iLCJqdGkiOiI3ZGYxYjQ5NC1jNWI1LTQ5YzYtOWVlMi1jYTUyNjZhM2U1MDIiLCJleHAiOjE3ODMyNDA1NjIsImlzcyI6ImtyZWRhci1hcGkiLCJhdWQiOiJrcmVkYXItY2xpZW50cyJ9.So1y6uOvy1y--u6DQHvQ1oRHna57FQgSvWrlPAJiKlg';

async function testSubmit() {
  const payload = {
    legalName: "Test Merchant",
    registrationNumber: "RC123456",
    businessType: "SoleProprietorship",
    industry: "Fintech",
    country: "Nigeria",
    address: "123 Test Street",
    contactPhone: "+2348012345678", // Correct E.164 phone number
    website: "https://example.com",
    settlementBankName: "Wema Bank",
    settlementBankCode: "035", // Real code for Wema Bank
    settlementAccountName: "Test Account",
    settlementAccountNumber: "0123456789"
  };

  try {
    const res = await axios.post('https://api.staging.kredar.xyz/api/v1/onboarding/submit', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("Success:", res.status, res.data);
  } catch (err) {
    if (err.response) {
      console.log("Error status:", err.response.status);
      console.log("Error headers:", err.response.headers);
      console.log("Error body:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

testSubmit();
