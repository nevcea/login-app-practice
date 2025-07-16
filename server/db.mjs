import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: '',
    port: 3306,
    user: '',
    password: '',
    database: '',
})