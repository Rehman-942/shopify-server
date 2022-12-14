require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
app.use("/user", require("./routes/user"));
app.use("/api", require("./routes/category"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/product"));
app.use("/api", require("./routes/payment"));

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", PORT);
});
