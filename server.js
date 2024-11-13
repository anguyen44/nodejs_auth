require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-route");
const homeRoutes = require("./routes/home-route");
const adminRoutes = require("./routes/admin-route");
const uploadImagesRoutes = require("./routes/image-route");

const app = express();
const PORT = process.env.PORT || 3000;

connectToDB();

//middleware
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadImagesRoutes);

app.listen(PORT, () => console.log("the app is listening to port " + PORT));
