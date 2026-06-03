const { getSheetData, updateSheetData, appendSheetData } = require('./services/googleSheetService');

async function testCheckout() {
  try {
    const id = 'VIS-2203';
    const data = await getSheetData('Visitors!A2:N');
    let rowIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 2;
        break;
      }
    }
    
    if (rowIndex === -1) {
      console.log('Visitor not found');
      return;
    }
    
    console.log('Updating row', rowIndex);
    await updateSheetData(`Visitors!L${rowIndex}:M${rowIndex}`, [['2026-06-02T12:00:00.000Z', 'Completed']]);
    
    console.log('Appending log');
    await appendSheetData('Activity Logs!A:D', [['LOG-test', id, 'CHECK_OUT', '12:00']]);
    
    console.log('Success');
  } catch(e) {
    console.error('Error:', e.message);
  }
}

testCheckout();
