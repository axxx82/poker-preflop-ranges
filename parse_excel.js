import { readFileSync, writeFileSync } from 'fs';
import * as xlsx from 'xlsx';

try {
  const buf = readFileSync('Preflop V2.xlsx');
  const workbook = xlsx.read(buf, { type: 'buffer' });

  const results = {};

  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const blocks = [];

    // Find all 'AA' cells
    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        if (typeof row[c] === 'string' && row[c].trim() === 'AA') {
          // Verify if it's a poker grid
          // A grid typically has AA at top-left, KK at r+1, c+1
          // or AK at r, c+1 or r+1, c
          
          let grid = [];
          for (let i = 0; i < 13; i++) {
            let gridRow = [];
            for (let j = 0; j < 13; j++) {
               const val = data[r + i] && data[r + i][c + j];
               gridRow.push(val ? (typeof val === 'string' ? val.trim() : val) : null);
            }
            grid.push(gridRow);
          }
          
          // Gather some context (text around the grid)
          let context = [];
          // Look at column to the right, or rows below/above
          if (data[r - 1] && data[r - 1][c]) context.push("Above: " + data[r - 1][c]);
          if (data[r] && data[r][c + 14]) context.push("Right: " + data[r][c + 14]);
          if (data[r+2] && data[r+2][c + 14]) context.push("Right+2: " + data[r+2][c + 14]);
          
          blocks.push({ r, c, context: context.filter(Boolean), grid });
        }
      }
    }
    
    results[name] = blocks;
  }
  
  writeFileSync('parsed_blocks.json', JSON.stringify(results, null, 2));
  console.log("Successfully extracted matrices into parsed_blocks.json");
} catch (error) {
  console.error("Error reading file:", error);
}
