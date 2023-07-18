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
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// promjena sifre
app.patch("/user", [auth.verify], async (req, res) => {
  let changes = req.body;

  let username = req.jwt.username;

  if (changes.new_password && changes.old_password) {
    let result = await auth.changeUserPassword(username, changes.old_password, changes.new_password);
    if (result) {
      res.status(201).send();
    } else {
      res.status(500).json({ error: "Cannot change password" });
    }
  } else {
    res.status(400).json({ error: "Wrong request!" });
  }
});

app.post("/user", async (req, res) => {
  let user = req.body;

  // registracija
  let id;
  try {
    id = await auth.registerUser(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  res.json({ id: id });
});

// za koju rutu, trazimo dva objekta, i unutra ide sta se sve ima za izvrsit
app.get("/", [auth.verify], (req, res) => {
  res.json({ status: "Radi :)" });
});

app.listen(port, () => console.log(`Slušam na portu ${port}!`));
