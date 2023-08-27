import mongoose from "mongoose";

let connection_string = "mongodb+srv://ivan:nVOVPf23purH6WHO@wannaplay.jubbxd7.mongodb.net/?retryWrites=true&w=majority";
// let connection_string = "mongodb://127.0.0.1:27017/wannaPlay";

// da se ne spaja svaki put
let db = null;

export default async function connect() {
  // provjera pomoću Mongoose-a je li veza uspostavljena
  if (db && mongoose.connection.readyState === 1) {
    return db;
  }

  try {
    await mongoose.connect(connection_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = mongoose.connection.db;
    console.log("Successfully connected to the database");
    return db;
  } catch (error) {
    throw new Error("There was an error while connecting to the database: " + error);
  }
}
