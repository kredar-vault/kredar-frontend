const axios = require('axios');

async function run() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjA4N2E5YTQwLTk0YjMtNGM2Yy1iMjgzLWQ1MTk2MjRmNjlhMyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InNoZWlkYWJkdWxhaGFkMEBnbWFpbC5jb20iLCJqdGkiOiI3YjM3YTM5MC0yODNhLTRhNTEtYWEyYi1lZjZmZjgzOTViMzMiLCJleHAiOjE3ODMyNjYzMzQsImlzcyI6ImtyZWRhci1hcGkiLCJhdWQiOiJrcmVkYXItY2xpZW50cyJ9.clytGs6HDc_CUBOqPHxROZauk3vc072peELYx7buDP8";

  console.log("Fetching profile using token...");
  try {
    const res = await axios.get('https://api.staging.kredar.xyz/api/v1/tenants/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Profile Response Status:", res.status);
    console.log("Profile Response Body:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log("Error Response Status:", err.response ? err.response.status : 'No Response');
    console.log("Error Response Body:", err.response ? err.response.data : err.message);
  }
}

run();
