/**
 * Excel Helper
 * Uses the `exceljs` library to create or append rows to the submissions workbook.
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

const HEADERS = [
    { header: 'Timestamp', key: 'timestamp', width: 24 },
    { header: 'Full Name', key: 'fullName', width: 25 },
    { header: 'Student ID', key: 'studentId', width: 16 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Service Type', key: 'serviceType', width: 24 },
    { header: 'Description', key: 'description', width: 50 },
];

/**
 * Append a row of data to the Excel workbook.
 * Creates the file and storage directory if they don't exist.
 * @param {Object} rowData – keys matching HEADERS[].key
 */
exports.appendRow = async (rowData) => {
    const filePath = config.EXCEL_PATH;

    // Ensure the storage directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    let worksheet;

    // Open existing workbook or create a new one
    if (fs.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath);
        worksheet = workbook.getWorksheet('Submissions');
        if (!worksheet) {
            worksheet = workbook.addWorksheet('Submissions');
            worksheet.columns = HEADERS;
            _styleHeader(worksheet);
        }
    } else {
        worksheet = workbook.addWorksheet('Submissions');
        worksheet.columns = HEADERS;
        _styleHeader(worksheet);
    }

    // Add the new row
    const row = worksheet.addRow(rowData);
    row.font = { name: 'Calibri', size: 11 };

    await workbook.xlsx.writeFile(filePath);
};

/**
 * Style the header row with a branded look.
 */
function _styleHeader(worksheet) {
    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6C63FF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 24;
    headerRow.commit();
}
