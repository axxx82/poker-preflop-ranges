import { readFileSync } from 'fs';
const data = JSON.parse(readFileSync('parsed_blocks.json', 'utf8'));
let summary = "";
for (const [sheetName, blocks] of Object.entries(data)) {
  summary += `Sheet: ${sheetName} (Grids: ${blocks.length})\n`;
  for (let i = 0; i < blocks.length; i++) {
    summary += `  Grid ${i}: r=${blocks[i].r}, c=${blocks[i].c}, context=${JSON.stringify(blocks[i].context)}\n`;
  }
}
console.log(summary);
