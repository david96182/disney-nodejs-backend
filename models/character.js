const { Sequelize, Model, DataTypes } = require("sequelize")
const { sequelize } = require('../database/config')

const Character = sequelize.define("character", {
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
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    weigth: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    story: {
        type: DataTypes.TEXT
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
        tableName: 'Characters'
  });

  Character.sync()

  module.exports = {
      Character
  }
