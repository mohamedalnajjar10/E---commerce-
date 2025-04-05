const{Sequelize} = require ("sequelize");            

const connection = new Sequelize ({
    port : process.env.DATABASE_PORT, 
    host : process.env.DATABASE_HOST ,
    username : process.env.USER_NAME ,
    password : process.env.PASSWORD ,
    dialect : process.env.DIALECT ,
    database : process.env.DATABASE
});
module.exports = connection;