const app = require('./app');
const db = require('./config/config');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection successful');
    return db.sequelize.sync({alter: true});
  })
  .then(() => {
    console.log('Tables synchronized');

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
