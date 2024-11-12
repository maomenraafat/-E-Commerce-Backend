import express from "express";
import { dbConnection } from "./databases/dbConnection.js";
import { bootstrap } from "./src/bootstrap.js";
import morgan from "morgan";
const app = express();
const port = 3000;
app.use(express.json());
app.use(morgan("dev"));
import dotenv from "dotenv";
dotenv.config();
app.use(express.static("uploads"));
bootstrap(app);
dbConnection();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
