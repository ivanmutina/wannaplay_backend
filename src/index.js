import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./auth";

const app = express();
const port = 3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// prefix ruta
app.use("/api/post", require("../routes/routes"));

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

// registracija
app.post("/user", async (req, res) => {
  let user = req.body;

  let id;
  try {
    id = await auth.registerUser(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  res.json({ id: id });
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

// brisanje profila
app.delete("/user/:username", [auth.verify], async (req, res) => {
  let username = req.params.username; // Uzimamo username iz URL parametra

  try {
    let result = await auth.deleteUser(username);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to delete account." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account." });
  }
});

// start server
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
