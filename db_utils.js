const mysql = require("mysql2/promise");
const { MongoClient, Db } = require("mongodb");
require('dotenv').config()

const pool = mysql.createPool({
	host: process.env.MYSQL_SERVER,
	port: process.env.MYSQL_SVR_PORT,
	user: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_SCHEMA,
	connectionLimit: process.env.MYSQL_CON_LIMIT,
});

const mongoClient = new MongoClient(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const makeQuery = (sqlQuery, pool) => {
	return async (args) => {
		console.log(args);
		const conn = await pool.getConnection();
		try {
			let sqlResults = await conn.query(sqlQuery, [args]);
			return sqlResults[0];
		} catch (e) {
			console.log(e);
		} finally {
			conn.release();
		}
	};
};
module.exports = {pool, mongoClient, makeQuery}