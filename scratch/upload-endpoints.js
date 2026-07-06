const fs = require('fs');

const swaggerPath = 'C:\\Users\\codespacecadet\\.gemini\\antigravity-ide\\brain\\e381d2e3-3953-4e54-ae87-d1876220438c\\.system_generated\\steps\\795\\content.md';
const content = fs.readFileSync(swaggerPath, 'utf8');
const jsonStartIndex = content.indexOf('{');
const jsonContent = content.substring(jsonStartIndex);
const parsed = JSON.parse(jsonContent);

console.log("ENDPOINTS CONTAINING 'upload', 'document', or 'file':");
Object.keys(parsed.paths).forEach(p => {
  const pl = p.toLowerCase();
  if (pl.includes('upload') || pl.includes('document') || pl.includes('file') || pl.includes('media')) {
    console.log(`- ${p}:`, Object.keys(parsed.paths[p]));
  }
});
