const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // In a real app, query Admin Users sheet. We'll simulate for now.
    // const admins = await getSheetData('Admin Users!A2:E');
    // const admin = admins.find(row => row[2] === email && bcrypt.compareSync(password, row[3]));

    // Hardcoded dummy authentication based on requirements
    if (email === 'admin@gmail.com' && password === '123456') {
      const token = jwt.sign({ id: 'ADM-001', role: 'superadmin' }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
