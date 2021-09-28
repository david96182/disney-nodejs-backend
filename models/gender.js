const { Sequelize, Model, DataTypes } = require("sequelize")
const { sequelize } = require('../database/config')

const Gender = sequelize.define("gender", {
    uuid: {
        type: DataTypes.UUIDV4,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    movies: {
        type: DataTypes.STRING,
        get() {
            return this.getDataValue('movies') != null
                ? this.getDataValue('movies').split(',') 
                : this.getDataValue('movies')
        }
    }

}, 
    {
        tableName: 'Genders'
  });

  Gender.sync()

  module.exports = {
      Gender
  }
