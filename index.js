const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.prod" });
} else {
  dotenv.config({ path: ".env.dev" });
}
/// /////////////////////
require("./config/database").connect();
require("./config/mailing").setMailing();
const {
  logError,
  isOperationalError,
  returnError,
} = require("./middlewares/centralizedError");
const NotFoundError = require("./config/notFoundError");

/// ////////////////////
require("./models/ParcelStatus");
require("./models/User");
require("./models/Parcel");
require("./models/Role");

/// ////////////////////
const checkAuth = require("./middlewares/auth");

/// ////////////////////

const authRoutes = require("./routes/authRoutes");
const parcelsRoutes = require("./routes/parcelsRoutes");
const userRoutes = require("./routes/userRoutes");

/// ////////////////////

const app = express();
app.use(bodyParser.json());
const port = 3000;
app.use("/api/auth", authRoutes);
app.use("/api/parcels", checkAuth, parcelsRoutes);
app.use("/api/user", checkAuth, userRoutes);

/// ////////////////////

app.use(
  cors({
    origin: "http://localhost:8000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use((_req, _res, next) => {
  next(new NotFoundError("Not found rout"));
});

app.use(logError);
app.use(returnError);
process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", (error) => {
  logError(error);

  if (!isOperationalError(error)) {
    process.exit(1);
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${port}`);
});
