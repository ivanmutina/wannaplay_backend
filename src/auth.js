import connect from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// kreiranje indeksa pri pokretanju aplikacije te da nemamo dva korisnika sa istim usernameom
(async () => {
  let db = await connect();
  db.collection("users").createIndex({ username: 1 }, { unique: true });
})();

export default {
  // registracija korisnika
  async registerUser(userData) {
    let db = await connect();

    let doc = {
      username: userData.username,
      password: await bcrypt.hash(userData.password, 8),
    };

    try {
      let result = await db.collection("users").insertOne(doc);

      if (result && result.insertedId) {
        return result.insertedId;
      }
    } catch (e) {
      if (e.code == 11000) {
        throw new Error("Korisnik već postoji");
      }
    }
  },

  // autentifikacija korisnika
  async authenticateUser(username, password) {
    let db = await connect();
    // trazi korisnika
    let user = await db.collection("users").findOne({ username: username });

    // usporedi mi password s frontenda i password s backenda
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      // ako je ok vrati token
      delete user.password;
      let token = jwt.sign(user, process.env.JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "1 week",
      });

      return {
        token,
        username: user.username,
      };
    } else {
      return null;
    }
  },
  // promjena sifre
  async changeUserPassword(username, old_password, new_password) {
    let db = await connect();
    // pronađi postoji li taj username u bazi
    let user = await db.collection("users").findOne({ username: username });

    // provjeri i jeli stara sifra kao ona sto je u bazi
    if (user && user.password && (await bcrypt.compare(old_password, user.password))) {
      let new_password_hashed = await bcrypt.hash(new_password, 8);

      // updejtaj sifru u Mongu
      let result = await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            password: new_password_hashed,
          },
        }
      );
      return result.modifiedCount == 1;
    }
  },
  async deleteUser(username) {
    let db = await connect();
    let user = await db.collection("users").findOne({ username: username });

    if (user) {
      let result = await db.collection("users").deleteOne({ _id: user._id });
      return result.deletedCount == 1;
    } else {
      return false;
    }
  },
  // middleware funkcija
  verify(req, res, next) {
    // provjeri token
    try {
      // izvuci token iz headera (odrezi rijec bearer prije razmaka)
      let authorization = req.headers.authorization.split(" ");
      let type = authorization[0];
      let token = authorization[1];
      console.log(type, token);

      if (type !== "Bearer") {
        return res.status(401).send();
      } else {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET);
        // idi dalje na funkciju u middleware-u
        return next();
      }
    } catch (e) {
      return res.status(401).send();
    }
  },
};
