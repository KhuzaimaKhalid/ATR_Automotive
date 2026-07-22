const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/connectDB");

const userRoutes = require("./routes/userRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const productRoutes = require("./routes/productRoutes");
const salesRoutes = require("./routes/saleRoutes");
const reportRoutes = require("./routes/reportRoutes");
const returnRoutes = require("./routes/returnRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("welcome");
});

app.use("/api/user", userRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/product", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/return", returnRoutes);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});