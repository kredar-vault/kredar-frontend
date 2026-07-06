const fs = require('fs');

const swaggerPath = 'C:\\Users\\codespacecadet\\.gemini\\antigravity-ide\\brain\\e381d2e3-3953-4e54-ae87-d1876220438c\\.system_generated\\steps\\795\\content.md';
const content = fs.readFileSync(swaggerPath, 'utf8');
const jsonStartIndex = content.indexOf('{');
const jsonContent = content.substring(jsonStartIndex);
const parsed = JSON.parse(jsonContent);

console.log("GET ONBOARDING SCHEMA:");
console.log(JSON.stringify(parsed.paths['/api/v1/onboarding']['get'], null, 2));

console.log("\nSCHEMAS RELATED TO ONBOARDING GET RESPONSE:");
Object.keys(parsed.components.schemas).forEach(s => {
  if (s.toLowerCase().includes('onboarding')) {
    console.log(`- ${s}:`, JSON.stringify(parsed.components.schemas[s], null, 2));
  }
});
