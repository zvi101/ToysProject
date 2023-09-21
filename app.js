const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");

const fileUpload = require("express-fileupload")

const {routesInit} = require("./routes/configRoutes")

require("./db/mongoConnect");

const app = express();

// מאפשר לכל הדומיינים לעשות אלינו בקשה
app.use(cors());

app.use(fileUpload({
  // 1024 BYTES * 1024 KB = 1 MB
  // הגבלה ל5 מב לקובץ אחד שעולה
  limits:{fileSize: 1024 * 1024 * 5}
}))


app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

routesInit(app);


const server = http.createServer(app);
// בודק באיזה פורט להריץ את השרת  , אם בשרת אמיתי אוסף
// את המשתנה פורט מהסביבת עבודה שלו ואם לא 3001
const port = process.env.PORT || 3001;
server.listen(port);