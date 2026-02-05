
const fs = require('fs');
const path = require('path');

const icons = [
  "TrendingUp", "Package", "DollarSign", "Users",
  "Download", "Share2", "Settings", "Bell",
  "BarChart3", "Wallet", "Clock", "Star",
  "ArrowUpRight", "ArrowDownRight", "Eye",
  "PlusCircle", "FileText", "Shield",
  "HelpCircle", "LogOut", "CheckCircle",
  "Filter", "Search", "Calendar", "MoreVertical"
];

const dtsPath = path.join(process.cwd(), 'node_modules/lucide-react/dist/lucide-react.d.ts');

try {
  const content = fs.readFileSync(dtsPath, 'utf8');

  const missing = [];
  icons.forEach(icon => {
    // Check for "declare const IconName"
    const regex = new RegExp(`declare const ${icon}:`);
    if (!regex.test(content)) {
      missing.push(icon);
    }
  });

  if (missing.length > 0) {
    console.log("Missing icons:", missing.join(", "));
  } else {
    console.log("All icons found.");
  }

} catch (e) {
  console.error("Error reading d.ts file:", e.message);
}
