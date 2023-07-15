import { MongoClient } from "mongodb";

// let connection_string = "mongodb+srv://admin:admin@im-cluster.8fhrzmp.mongodb.net/?retryWrites=true&w=majority";
let connection_string = "mongodb://127.0.0.1:27017/fipugram";

// objekt koji sluzi za pristup
let client = new MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// da se ne spaja svaki put
let db = null;

export default async function connect() {
  if (db && client.isConnected) {
    return db;
  }

  try {
    await client.connect();
    db = client.db("fipugram");
    console.log("Uspješno spajanje na bazu.");
    return db;
  } catch (error) {
    throw new Error("Došlo je do greške prilikom spajanja na bazu: " + error);
  }
}
