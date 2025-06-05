

import  Sequelize from "sequelize";

const db = new Sequelize('bomitaa7uki9h4tis7ix','ujaqgfl5f8ehfc22','aWHjjiBfvkMu7HSrc9xx',{
    host: 'bomitaa7uki9h4tis7ix-mysql.services.clever-cloud.com',
    port: '3306',
    dialect: 'mysql',
    define: {
        timestamps: false,
    },
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db;