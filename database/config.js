const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/disney.db'
})

const dbConnection = async() => {

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully to the database.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    dbConnection,
    sequelize
}



