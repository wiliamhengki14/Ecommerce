const fs = require('fs');
const path = require('path');
const dir = 'resources/js/Components/ui';
const files = ['tooltip.tsx', 'tabs.tsx', 'skeleton.tsx', 'sidebar.tsx', 'sheet.tsx', 'separator.tsx', 'alert-dialog.tsx'];

files.forEach(f => {
  const p = path.join(dir, f);
  if (fs.existsSync(p)) {
      let c = fs.readFileSync(p, 'utf8');
      c = c.replace(/import\s*\{\s*cn\s*\}\s*from\s*["']cn["']/g, 'import { cn } from "@/lib/utils"');
      fs.writeFileSync(p, c);
  }
});
console.log('Done replacing cn imports');
