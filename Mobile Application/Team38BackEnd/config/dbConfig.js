const { Sequelize } = require('sequelize');  


const sequelize = new Sequelize('t38database4', 'root', 'Grandcodeauto@2024', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log, 
});

module.exports = sequelize;
