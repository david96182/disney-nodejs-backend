const { Sequelize, Model, DataTypes } = require("sequelize")
const { sequelize } = require('../database/config')

const Movie = sequelize.define("movie", {
    uuid: {
        type: DataTypes.UUIDV4,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    date: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    characters: {
        type: DataTypes.STRING,
        get() {
            return this.getDataValue('characters') != null
                ? this.getDataValue('characters').split(',') 
                : this.getDataValue('characters')
        }
    }

}, 
    {
        tableName: 'Movies'
  });

  Movie.sync()

  module.exports = {
      Movie
  }
