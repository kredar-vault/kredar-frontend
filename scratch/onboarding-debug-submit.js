const axios = require('axios');

async function run() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjA4N2E5YTQwLTk0YjMtNGM2Yy1iMjgzLWQ1MTk2MjRmNjlhMyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InNoZWlkYWJkdWxhaGFkMEBnbWFpbC5jb20iLCJqdGkiOiI3YjM3YTM5MC0yODNhLTRhNTEtYWEyYi1lZjZmZjgzOTViMzMiLCJleHAiOjE3ODMyNjYzMzQsImlzcyI6ImtyZWRhci1hcGkiLCJhdWQiOiJrcmVkYXItY2xpZW50cyJ9.clytGs6HDc_CUBOqPHxROZauk3vc072peELYx7buDP8";

  console.log("Submitting onboarding draft using token...");
  try {
    const res = await axios.post('https://api.staging.kredar.xyz/api/v1/onboarding/submit', {
      legalName: "Test Merchant",
      registrationNumber: "RC123456",
      businessType: "SoleProprietorship",
      industry: "Technology",
      country: "Nigeria",
      address: "123 Test Street, Lagos",
      contactPhone: "+2348012345678",
      website: "https://example.com",
      settlementBankName: "Access Bank",
      settlementBankCode: "044",
      settlementAccountName: "Test Account",
      settlementAccountNumber: "0000000000" // We'll test with a mock NUBAN
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Success Response Status:", res.status);
    console.log("Success Response Body:", res.data);
  } catch (err) {
    console.log("Error Response Status:", err.response ? err.response.status : 'No Response');
    console.log("Error Response Body:", err.response ? err.response.data : err.message);
  }
}

run();
