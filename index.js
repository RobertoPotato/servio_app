const express = require("express"); //add express
const app = express(); //create the app object
const { User, Address } = require("./models/index");

app.use(express.json());

//setup the port to use
const port = process.env.PORT || 3000;

//Routes
app.get("/", async (req, res) => {
  const user = await User.findAll();
  res.send(user);
});

//test querying via relationships
app.get("/user/address", async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Address,
      },
    ],
  });

  res.send(users);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
