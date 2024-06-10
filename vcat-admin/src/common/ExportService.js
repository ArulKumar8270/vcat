import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

// const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const filename_avoiding_chars = ['*', '?', ':', '/', '\\', '[', ']'];

export class ExportService {
    exportExcel(fileName, columns, data, sheetName = fileName) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(sheetName.toString());
        let currentRowIndex = 1;
        columns.forEach((col, index) => {
            const cell = worksheet.getRow(currentRowIndex).getCell(index + 1);
            cell.font = {
                size: 12,
                bold: true,
                color: { argb: 'FFFFFF' }
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '464eb8' },
                bgColor: { argb: '464eb8' },
            };
            cell.value = col.header;
        });
        currentRowIndex++;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((row, rowIndex) => {
                columns.forEach((col, index) => {
                    const cell = worksheet.getRow(currentRowIndex + rowIndex).getCell(index + 1);
                    // cell.font = { size: 12, bold: true, color: { argb: 'FFFFFF' } }
                    // cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '464eb8' }, bgColor: { argb: '464eb8' } }
                    cell.value = row[col.field];
                });
            });
        }

        worksheet.columns = columns;

        // worksheet.addRows(data);

        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, this.filename_corrections(fileName.toString()) + '.xlsx');
        });
    }

    filename_corrections(name) {
        let result_name = '';
        for (let index = 0; index < name.length; index++) {
            let element = name[index];
            if (filename_avoiding_chars.includes(element) === true) {
                element = '-';
            }
            result_name = result_name + element;
        }
        return result_name;
    }
}
