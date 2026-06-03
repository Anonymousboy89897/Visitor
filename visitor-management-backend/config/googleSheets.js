const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const getSheetsClient = async () => {
  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient });
};

module.exports = { getSheetsClient };
