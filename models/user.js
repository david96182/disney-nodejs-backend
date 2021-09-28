const { Sequelize, Model, DataTypes } = require("sequelize")
const { sequelize } = require('../database/config')

const User = sequelize.define("user", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }}, 
    {
        tableName: 'Users'
  });

  User.sync()

  module.exports = {
      User
  }
