const { Pool } = require('pg')

const dbPool = new Pool({
    database: 'db_tugas9',
    port: 5432,
    user: 'postgres',
    password: 'admin'
})

module.exports = dbPool