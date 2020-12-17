const express = require("express");
const {pool, mongoClient} = require("./db_utils")
const morgan = require("morgan");
const apiRouter = require('./api')
require("dotenv").config();
const app = express();
app.use(morgan("combined"));

const PORT =
	parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

app.use('/api', apiRouter)

const startSQL = pool
	.getConnection()
	.then((conn) => {
		conn.ping();
		console.log("pinged");
		return conn;
	})
	.then((conn) => conn.release());

Promise.all([mongoClient.connect(), startSQL]).then(() => {
	app.listen(PORT, () => {
		console.log(`${PORT} started on ${new Date()}`);
	});
});
