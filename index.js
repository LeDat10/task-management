const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const database = require("./config/database");
const routesApiVer1 = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

database.connect();

// parse application/json
app.use(bodyParser.json());

// Routes version 1
routesApiVer1(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});