require('dotenv').config();
const { getSheetsClient } = require('./config/googleSheets');
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

const headers = [
  'VisitorID',
  'FullName',
  'Phone',
  'Email',
  'Purpose',
  'PersonToMeet',
  'Department',
  'IdType',
  'IdNumber',
  'VehicleNumber',
  'PhotoUrl',
  'CheckIn',
  'CheckOut',
  'Status',
  'CreatedAt'
];

async function setupSchema() {
  try {
    const sheets = await getSheetsClient();
    
    // Write headers to Visitors sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Visitors!A1:O1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    });
    console.log('Successfully added headers to Visitors sheet.');

    // Write headers to Activity Logs sheet
    const logHeaders = ['LogID', 'VisitorID', 'Action', 'Timestamp'];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Activity Logs!A1:D1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [logHeaders] },
    });
    console.log('Successfully added headers to Activity Logs sheet.');

  } catch (error) {
    console.error('Error setting up schema:', error.message);
    console.log('\nMake sure your credentials.json is valid and the service account has Editor access to the spreadsheet.');
  }
}

setupSchema();
