const env = {
    database: 'database-alarm',
    username: 'postgres',
    password: 'alarm123',
    host: 'localhost',
    port:'5432',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

module.exports = env;