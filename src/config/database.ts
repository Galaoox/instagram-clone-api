import { createPool, Pool } from 'mysql';
import { promisify } from 'util';

const pool: Pool = createPool({
    database: "instagramDb",
    host: "localhost",
    user: "root",
    password: "Gg258789",
});

pool.getConnection((error, connection) => {
    if (error) {
        console.log(error);
    } else {
        pool.releaseConnection(connection);
        console.log("DB IS CONNECTED")
    }
});



export default pool;