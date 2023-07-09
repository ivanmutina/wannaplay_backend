import express from "express";
import connect from "./db.js";

const app = express();
const port = 3000; // port na kojem će web server slušati

// za koju rutu, trazimo dva objekta, i unutra ide sta se sve ima za izvrsit
app.get("/", (req, res) => {
  console.log(req.query); // sadrzi u sebi sve parametre (domena/?parametar=)
  res.send("Hello World, ovaj puta preko browsera!");
});

app.listen(port, () => console.log(`Slušam na portu ${port}!`));
