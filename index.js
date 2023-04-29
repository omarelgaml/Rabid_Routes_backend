const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.prod" });
} else {
  dotenv.config({ path: ".env.dev" });
}
////////////////////////
require("./config/database").connect();

///////////////////////
const app = express();
app.use(bodyParser.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  cors({
    origin: "http://localhost:8000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
