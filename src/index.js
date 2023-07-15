import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./auth";

const app = express();
const port = 3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json());

app.get("/tajna", [auth.verify], (req, res) => {
  res.json({ message: "Ovo je tajna " + req.jwt.username });
});

// autentifikacija korisnika
app.post("/auth", async (req, res) => {
  let user = req.body;

  try {
    let result = await auth.authenticateUser(user.username, user.password);
    res.json(result);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.post("/users", async (req, res) => {
  let user = req.body;

  // registracija
  let id;
  try {
    id = await auth.registerUser(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  res.json({ id: id });
});

// za koju rutu, trazimo dva objekta, i unutra ide sta se sve ima za izvrsit
app.get("/", (req, res) => {
  res.json({ status: "Radi :)" });
});

app.listen(port, () => console.log(`Slušam na portu ${port}!`));
