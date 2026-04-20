const ExcelJS = require('exceljs');
const fs = require('fs');

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('Preflop V2.xlsx');
  
  const results = {};

  workbook.eachSheet((sheet, sheetId) => {
    const blocks = [];
    
    // Find 'AA' cells to locate grids
    for (let r = 1; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r);
      for (let c = 1; c <= Math.min(row.cellCount, 30); c++) {
        const cell = row.getCell(c);
        if (cell && cell.value && typeof cell.value === 'string' && cell.value.trim() === 'AA') {
          let grid = [];
          for (let i = 0; i < 13; i++) {
            let gridRow = [];
            let rLocal = sheet.getRow(r + i);
            for (let j = 0; j < 13; j++) {
               const cLocal = rLocal.getCell(c + j);
               const val = cLocal && cLocal.value ? String(cLocal.value).trim() : null;
               
               let bg = null;
               if (cLocal && cLocal.fill) {
                 if (cLocal.fill.fgColor && cLocal.fill.fgColor.argb) {
                   bg = cLocal.fill.fgColor.argb;
                 } else if (cLocal.fill.bgColor && cLocal.fill.bgColor.argb) {
                   bg = cLocal.fill.bgColor.argb;
                 }
               }
               gridRow.push({ val, bg });
            }
            grid.push(gridRow);
          }
          blocks.push({ r, c, grid });
        }
      }
    }
    results[sheet.name] = blocks;
  });
  
  fs.writeFileSync('parsed_colors.json', JSON.stringify(results, null, 2));
  console.log('Successfully saved to parsed_colors.json');
}

main().catch(console.error);
