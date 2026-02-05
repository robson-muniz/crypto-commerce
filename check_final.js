
const fs = require('fs');
const path = require('path');

const candidates = [
  "CircleHelp", "CircleQuestion",
  "ChartBar", "ChartColumn"
];

const dtsPath = path.join(process.cwd(), 'node_modules/lucide-react/dist/lucide-react.d.ts');

try {
  const content = fs.readFileSync(dtsPath, 'utf8');

  const found = [];
  candidates.forEach(icon => {
    const regex = new RegExp(`declare const ${icon}:`);
    if (regex.test(content)) {
      found.push(icon);
    }
  });

  console.log("Found icons:", found.join(", "));

} catch (e) {
  console.error("Error reading d.ts file:", e.message);
}
