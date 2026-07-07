const fs = require('fs');

const swaggerPath = 'C:\\Users\\codespacecadet\\.gemini\\antigravity-ide\\brain\\e381d2e3-3953-4e54-ae87-d1876220438c\\.system_generated\\steps\\795\\content.md';
const content = fs.readFileSync(swaggerPath, 'utf8');
const jsonStartIndex = content.indexOf('{');
const jsonContent = content.substring(jsonStartIndex);
const parsed = JSON.parse(jsonContent);

const profileGet = parsed.paths['/api/v1/tenants/profile']?.get;
if (profileGet) {
  console.log("PROFILE GET RESPONSES:");
  console.log(JSON.stringify(profileGet.responses, null, 2));
} else {
  console.log("No GET method for /api/v1/tenants/profile");
}
