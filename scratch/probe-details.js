const fs = require('fs');

const swaggerPath = 'C:\\Users\\codespacecadet\\.gemini\\antigravity-ide\\brain\\e381d2e3-3953-4e54-ae87-d1876220438c\\.system_generated\\steps\\795\\content.md';
const content = fs.readFileSync(swaggerPath, 'utf8');
const jsonStartIndex = content.indexOf('{');
const jsonContent = content.substring(jsonStartIndex);
const parsed = JSON.parse(jsonContent);

console.log("FULL SPEC FOR /api/v1/dedicated-accounts:");
console.log(JSON.stringify(parsed.paths['/api/v1/dedicated-accounts'], null, 2));

console.log("\nFULL SPEC FOR /api/v1/dedicated-accounts/{id}:");
console.log(JSON.stringify(parsed.paths['/api/v1/dedicated-accounts/{id}'], null, 2));

console.log("\nALL PATHS CONTAINING 'account' OR 'settlement':");
Object.keys(parsed.paths).forEach(p => {
  if (p.toLowerCase().includes('account') || p.toLowerCase().includes('settlement')) {
    console.log(`- ${p}`);
  }
});
