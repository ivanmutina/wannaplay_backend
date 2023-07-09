import mongo from "mongodb";

let connection_string = "mongodb+srv://admin:admin@im-cluster.8fhrzmp.mongodb.net/?retryWrites=true&w=majority";

// objekt koji sluzi za pristup
let client = new mongo.MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = null;

export default () => {
  return new Promise((resolve, reject) => {
    // provjeri jel baza vec spojena
    if (db && client.isConnected()) {
      resolve(db);
    }
    // ako se prvi put spaja
    client.connect((err) => {
      if (err) {
        reject("Došlo je do greške prilikom spajanja!" + err);
      } else {
        console.log("Uspješno spajanje na bazu.");
        let db = client.db("testbaza");
        resolve(db);
      }
    });
  });
};
