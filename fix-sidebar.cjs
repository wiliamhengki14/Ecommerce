const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'resources/js/Components/ui/sidebar.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/w-\(--sidebar-width\)/g, 'w-[--sidebar-width]');
c = c.replace(/w-\(--sidebar-width-icon\)/g, 'w-[--sidebar-width-icon]');
c = c.replace(/\(--spacing\(4\)\)/g, 'theme(spacing.4)');
c = c.replace(/max-w-\(--skeleton-width\)/g, 'max-w-[--skeleton-width]');

fs.writeFileSync(p, c);
console.log('Fixed Tailwind v4 syntax');
