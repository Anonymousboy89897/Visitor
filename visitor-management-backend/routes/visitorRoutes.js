const express = require('express');
const {
  addVisitor,
  getAllVisitors,
  getActiveVisitors,
  checkoutVisitor,
  deleteVisitor,
  searchVisitor,
  exportExcel
} = require('../controllers/visitorController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addVisitor);
router.get('/', protect, getAllVisitors);
router.get('/active', protect, getActiveVisitors);
router.put('/checkout/:id', protect, checkoutVisitor);
router.delete('/:id', protect, deleteVisitor);
router.get('/search', protect, searchVisitor);
router.get('/export/excel', protect, exportExcel);

module.exports = router;
