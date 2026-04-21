const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

/**
 * Append inquiry data to Google Sheet
 */
const appendToSheet = async (data) => {
    try {
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!spreadsheetId || !clientEmail || !privateKey) {
            console.warn('[Google Sheets] Missing credentials in .env. Skipping sync.');
            return;
        }

        // Initialize auth
        const serviceAccountAuth = new JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);

        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByIndex[0]; // Get the first sheet

        // Ensure headers are set if sheet is empty
        try {
            await sheet.loadHeaderRow();
        } catch (err) {
            // If loadHeaderRow fails, it usually means the sheet is empty
            await sheet.setHeaderRow(['Name', 'Email', 'Phone', 'Date']);
        }

        // Append the row
        await sheet.addRow({
            Name: data.name,
            Email: data.email,
            Phone: `'${data.phone}`, // Added apostrophe to ensure it's treated as string
            Date: new Date(data.createdAt || Date.now()).toLocaleString(),
        });

        console.log('[Google Sheets] Sync successful for:', data.email);
    } catch (err) {
        console.error('[Google Sheets] Sync failed:', err.message);
    }
};

module.exports = { appendToSheet };
