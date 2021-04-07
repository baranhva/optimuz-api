module.exports = function(Sequelize) {
    return new Sequelize(process.env.DB_SCHEMA, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        dialect: 'mysql',
        host: process.env.DATABASE_HOST,
        define: {
            freezeTableName: true
        }
    });
};
