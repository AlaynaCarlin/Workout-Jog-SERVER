const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:4e252eccce7c4a18b1cb1fad4832dbc0@localhost:5432/Workout_Log");
// const db = new Sequelize("postgres://postgres:4e252eccce7c4a18b1cb1fad4832dbc0@localhost:5432/animal-server");

module.exports = sequelize;