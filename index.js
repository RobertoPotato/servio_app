const express = require("express"); //add express
const app = express(); //create the app object
const { User, Address } = require("./models/index");
const users = require("./routes/users");
const profiles = require("./routes/profiles");
const categories = require("./routes/categories");
const addresses = require("./routes/addresses");
const roles = require("./routes/roles")

app.use(express.json());

//setup the port to use
const port = process.env.PORT || 3000;

//Routes
app.get("/", async (req, res) => {
  res.send("Hello world.");
});

app.use("/api/v1/users", users);
app.use("/api/v1/profiles", profiles);
app.use("/api/v1/categories", categories);
app.use("/api/v1/addresses", addresses);
app.use("/api/v1/roles", roles);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
