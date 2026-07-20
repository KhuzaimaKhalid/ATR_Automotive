const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/connectDB");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("welcome");
});

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});