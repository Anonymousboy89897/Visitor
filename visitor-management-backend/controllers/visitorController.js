const { getSheetData, appendSheetData, updateSheetData, clearSheetData } = require('../services/googleSheetService');
const generateVisitorId = require('../utils/generateVisitorId');
const formatDate = require('../utils/dateFormatter');

const addVisitor = async (req, res, next) => {
  try {
    const { fullName, phone, purpose, personToMeet, department, idType, idNumber, vehicleNumber, photoUrl } = req.body;
    
    const visitorId = generateVisitorId();
    const checkIn = formatDate(new Date());
    const status = 'Active';
    const createdAt = checkIn;
    const checkOut = '';

    const newVisitorRow = [
      visitorId, fullName, phone, req.body.email || '', purpose, personToMeet, 
      department, idType || '', idNumber || '', vehicleNumber || '', photoUrl || '', checkIn, checkOut, status, createdAt
    ];

    // Attempt to append to sheet. It will log error and return null if no credentials exist.
    await appendSheetData('Visitors!A:O', [newVisitorRow]);
    
    // Log activity
    const logId = `LOG-${Date.now()}`;
    await appendSheetData('Activity Logs!A:D', [[logId, visitorId, 'CHECK_IN', checkIn]]);

    res.status(201).json({ message: 'Visitor Added Successfully', visitorId });
  } catch (error) {
    next(error);
  }
};

const getAllVisitors = async (req, res, next) => {
  try {
    const data = await getSheetData('Visitors!A2:O');
    const visitors = data
      .filter(row => row[0] && row[0].startsWith('VIS-')) // Ignore headers or blank rows
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
    res.json(visitors);
  } catch (error) {
    next(error);
  }
};

const getActiveVisitors = async (req, res, next) => {
  try {
    const data = await getSheetData('Visitors!A2:O');
    const visitors = data
      .filter(row => row[0] && row[0].startsWith('VIS-')) // Ignore headers or blank rows
      .filter(row => row[12] === '' || row[13] === 'Active')
      .map(row => ({
        visitor_id: row[0],
        full_name: row[1],
        phone: row[2],
        purpose: row[4],
        person_to_meet: row[5],
        department: row[6],
        check_in: row[11],
        status: row[13],
      }));
    res.json(visitors);
  } catch (error) {
    next(error);
  }
};

const checkoutVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getSheetData('Visitors!A2:O');
    let rowIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 2; // +2 for 1-based index and header row
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    const checkOut = formatDate(new Date());
    await updateSheetData(`Visitors!M${rowIndex}:N${rowIndex}`, [[checkOut, 'Completed']]);
    
    const logId = `LOG-${Date.now()}`;
    await appendSheetData('Activity Logs!A:D', [[logId, id, 'CHECK_OUT', checkOut]]);

    res.json({ message: 'Visitor Checked Out Successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getSheetData('Visitors!A2:O');
    let rowIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 2;
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    await clearSheetData(`Visitors!A${rowIndex}:O${rowIndex}`);
    res.json({ message: 'Visitor Deleted Successfully' });
  } catch (error) {
    next(error);
  }
};

const searchVisitor = async (req, res, next) => {
  try {
    const { name, phone } = req.query;
    const data = await getSheetData('Visitors!A2:O');
    const visitors = data.filter(row => {
      let match = false;
      if (name) match = match || (row[1] && row[1].toLowerCase().includes(name.toLowerCase()));
      if (phone) match = match || (row[2] && row[2].includes(phone));
      return match;
    }).map(row => ({
      visitor_id: row[0],
      full_name: row[1],
      phone: row[2],
      purpose: row[4],
      status: row[13],
    }));
    res.json(visitors);
  } catch (error) {
    next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
    // In a real scenario, generate an excel file using exceljs or similar
    res.json({ message: 'Excel export endpoint stub (use exceljs in production)' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addVisitor,
  getAllVisitors,
  getActiveVisitors,
  checkoutVisitor,
  deleteVisitor,
  searchVisitor,
  exportExcel
};
