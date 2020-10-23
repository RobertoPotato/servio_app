const express = require("express"); //add express
const app = express(); //create the app object
const users = require("./routes/users");
const profiles = require("./routes/profiles");
const categories = require("./routes/categories");
const roles = require("./routes/roles");
const statuses = require("./routes/statuses");
const reviews = require("./routes/reviews");
const tiers = require("./routes/tiers");
const services = require("./routes/services");
const bids = require("./routes/bids");
const jobs = require("./routes/jobs");
const alerts = require("./routes/alerts");
const auth = require("./routes/auth/auth");
const statistics = require("./routes/statistics");

app.use(express.json());

//setup the port to use
const port = process.env.PORT || 3000;

//Routes
app.get("/", async (req, res) => {
  res.send("Hello world.");
});

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/users", users);
app.use("/api/v1/profiles", profiles);
app.use("/api/v1/categories", categories);
app.use("/api/v1/roles", roles);
app.use("/api/v1/statuses", statuses);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/tiers", tiers);
app.use("/api/v1/services", services);
app.use("/api/v1/bids", bids);
app.use("/api/v1/jobs", jobs);
app.use("/api/v1/alerts", alerts);
app.use("/api/v1/auth", auth);
app.use("/api/v1/statistics", statistics);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
