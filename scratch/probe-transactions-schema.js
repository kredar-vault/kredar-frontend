const fs = require('fs');

const swaggerPath = 'C:\\Users\\codespacecadet\\.gemini\\antigravity-ide\\brain\\e381d2e3-3953-4e54-ae87-d1876220438c\\.system_generated\\steps\\795\\content.md';
const content = fs.readFileSync(swaggerPath, 'utf8');
const jsonStartIndex = content.indexOf('{');
const jsonContent = content.substring(jsonStartIndex);
const parsed = JSON.parse(jsonContent);

console.log("FULL SPEC FOR GET /api/v1/transactions:");
console.log(JSON.stringify(parsed.paths['/api/v1/transactions'], null, 2));

console.log("\nTRANSACTION RELATED SCHEMAS:");
Object.keys(parsed.components.schemas).forEach(s => {
  if (s.toLowerCase().includes('transaction')) {
    console.log(`- ${s}:`, JSON.stringify(parsed.components.schemas[s], null, 2));
  }
});
