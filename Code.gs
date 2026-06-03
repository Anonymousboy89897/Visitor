const SPREADSHEET_ID = '19uootP4ogeRDJRaYn9P7e6tRyOlNUjk72p32A30R_TU'; 

function getSheet(sheetName) {
  try {
    // Try to get from bound script first
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  } catch (e) {
    // Fallback to ID if provided
    if (SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE') {
      return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
    }
    throw new Error('Spreadsheet not bound and SPREADSHEET_ID not provided.');
  }
}

// ----------------------
// CORS Options Setup
// ----------------------
function doOptions(e) {
  // If your client sends preflight requests (OPTIONS), this handles it.
  // Apps Script automatically returns standard headers, but you can return empty text.
  return ContentService.createTextOutput("");
}

// ----------------------
// Utility Functions
// ----------------------
function jsonResponse(data, statusCode = 200) {
  // Apps Script doesn't natively support sending HTTP status codes other than 200/302 for web apps easily,
  // but we can return the status in the payload if needed.
  // For simplicity, we just return standard JSON.
  const payload = { ...data, status: statusCode };
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function parsePayload(e) {
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return {};
    }
  }
  return {};
}

function generateVisitorId() {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VIS-${timestamp}-${randomStr}`;
}

function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

// ----------------------
// GET Requests Handler
// ----------------------
function doGet(e) {
  try {
    const action = e.parameter.action || 'getAll'; 
    
    // Support mutations via GET to bypass strict POST CORS redirects
    if (['add', 'checkout', 'delete'].includes(action)) {
      let payload = {};
      if (e.parameter.payload) {
        try { payload = JSON.parse(e.parameter.payload); } catch(err) {}
      }
      
      if (action === 'add') return addVisitor(payload);
      if (action === 'checkout') return checkoutVisitor(e.parameter.id || payload.id);
      if (action === 'delete') return deleteVisitor(e.parameter.id || payload.id);
    }

    const sheet = getSheet('Visitors');
    if (!sheet) return jsonResponse({ message: 'Visitors sheet not found' }, 404);

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return jsonResponse([]); // Only headers or empty

    const rows = data.slice(1);
    
    let visitors = rows
      .filter(row => row[0] && row[0].toString().startsWith('VIS-')) // Ignore empty rows
      .map(row => ({
        visitor_id: row[0],
        full_name: row[1],
        phone: row[2],
        email: row[3],
        purpose: row[4],
        person_to_meet: row[5],
        department: row[6],
        id_type: row[7],
        id_number: row[8],
        vehicle_number: row[9],
        photo_url: row[10],
        check_in: row[11],
        check_out: row[12],
        status: row[13],
        created_at: row[14]
      }));

    if (action === 'getActive') {
      visitors = visitors.filter(v => !v.check_out || v.status === 'Active');
    } else if (action === 'search') {
      const name = e.parameter.name ? e.parameter.name.toLowerCase() : null;
      const phone = e.parameter.phone ? e.parameter.phone : null;
      visitors = visitors.filter(v => {
        let match = false;
        if (name && v.full_name) match = match || v.full_name.toLowerCase().includes(name);
        if (phone && v.phone) match = match || v.phone.toString().includes(phone);
        return match;
      });
    }

    return jsonResponse(visitors);
  } catch (error) {
    return jsonResponse({ message: 'Error processing GET request', error: error.message }, 500);
  }
}

// ----------------------
// POST Requests Handler
// ----------------------
function doPost(e) {
  try {
    const payload = parsePayload(e);
    // Determine action: add, checkout, delete
    const action = payload.action || e.parameter.action || 'add';

    if (action === 'add') {
      return addVisitor(payload);
    } else if (action === 'checkout') {
      return checkoutVisitor(payload.id || e.parameter.id);
    } else if (action === 'delete') {
      return deleteVisitor(payload.id || e.parameter.id);
    } else {
      return jsonResponse({ message: 'Invalid action parameter' }, 400);
    }
  } catch (error) {
    return jsonResponse({ message: 'Error processing POST request', error: error.message }, 500);
  }
}

// ----------------------
// Controllers Logic
// ----------------------
function addVisitor(payload) {
  const sheet = getSheet('Visitors');
  const activitySheet = getSheet('Activity Logs');
  
  const visitorId = generateVisitorId();
  const checkIn = formatDate(new Date());
  const status = 'Active';
  const createdAt = checkIn;
  const checkOut = '';

  const newVisitorRow = [
    visitorId,
    payload.fullName || '',
    payload.phone || '',
    payload.email || '',
    payload.purpose || '',
    payload.personToMeet || '',
    payload.department || '',
    payload.idType || '',
    payload.idNumber || '',
    payload.vehicleNumber || '',
    payload.photoUrl || '',
    checkIn,
    checkOut,
    status,
    createdAt
  ];

  sheet.appendRow(newVisitorRow);

  if (activitySheet) {
    const logId = `LOG-${new Date().getTime()}`;
    activitySheet.appendRow([logId, visitorId, 'CHECK_IN', checkIn]);
  }

  return jsonResponse({ message: 'Visitor Added Successfully', visitorId: visitorId }, 201);
}

function checkoutVisitor(id) {
  if (!id) return jsonResponse({ message: 'Visitor ID is required' }, 400);
  
  const sheet = getSheet('Visitors');
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      rowIndex = i + 1; // 1-based index in Apps Script sheet
      break;
    }
  }

  if (rowIndex === -1) {
    return jsonResponse({ message: 'Visitor not found' }, 404);
  }

  const checkOut = formatDate(new Date());
  // M is column 13 (CheckOut), N is column 14 (Status)
  sheet.getRange(rowIndex, 13, 1, 2).setValues([[checkOut, 'Completed']]);

  const activitySheet = getSheet('Activity Logs');
  if (activitySheet) {
    const logId = `LOG-${new Date().getTime()}`;
    activitySheet.appendRow([logId, id, 'CHECK_OUT', checkOut]);
  }

  return jsonResponse({ message: 'Visitor Checked Out Successfully' });
}

function deleteVisitor(id) {
  if (!id) return jsonResponse({ message: 'Visitor ID is required' }, 400);
  
  const sheet = getSheet('Visitors');
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) {
    return jsonResponse({ message: 'Visitor not found' }, 404);
  }

  // Clear the row contents (keeps formatting but removes data)
  sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).clearContent();
  return jsonResponse({ message: 'Visitor Deleted Successfully' });
}
