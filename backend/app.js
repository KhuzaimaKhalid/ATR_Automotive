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
const pagesRoutes = require("./routes/pagesRoutes");

const app = express();

const allowedOrigins = [
    "https://atr-automotive-vdkp-ruddy.vercel.app",
    "http://localhost:5173",
    "file://"
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("file://")) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("welcome");
});

app.use("/api/user", userRoutes);
app.use("/user", userRoutes);

app.use("/api/categories", categoriesRoutes);
app.use("/categories", categoriesRoutes);

app.use("/api/product", productRoutes);
app.use("/product", productRoutes);

app.use("/api/sales", salesRoutes);
app.use("/sales", salesRoutes);

app.use("/api/report", reportRoutes);
app.use("/report", reportRoutes);

app.use("/api/return", returnRoutes);
app.use("/return", returnRoutes);

app.use("/api/pages", pagesRoutes);
app.use("/pages", pagesRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT || 5000, () => {
        console.log(`Listening on ${PORT || 5000}`);
    });
}

module.exports = app;