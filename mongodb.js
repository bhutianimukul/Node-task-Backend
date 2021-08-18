const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const dbName = "task-manager";
//! connection using mongo client
MongoClient.connect(process.env.mongo_url, { useNewUrlParser: true }).then(
  (client) => {
    //!refering to db
    const db = client.db(dbName);
    //! Insert many tasks
    //   db.collection("tasks").insertMany([
    //     { task: "Node", completed: false },
    //     { task: "Os", completed: false },
    //     { task: "DP", completed: false },
    //   ]),
    //     (err, res) => {
    //       if (err) console.log("Unable to Insert");
    //       console.log(res.ops);
    //     };
    //! Find One by object id
    //   db.collection("tasks").findOne(
    //     mongodb.ObjectId("60fefb2e64c2b105d82167ff"),
    //     (err, task) => {
    //       if (err) console.log("error in searching");
    //       else console.log(task);
    //     }
    //   );
    //! update completed to true
    //   db.collection("tasks")
    //     .find({ completed: false })
    //     .toArray((err, res) => console.log(res));
    //   db.collection("tasks")
    //     .updateMany({ completed: true }, { $set: { completed: false } })
    //     .then((res) => console.log(res));
    //!delete one by decription
    //   db.collection("tasks")
    //     .deleteOne({ task: "Os" })
    //     .then((res) => console.log(res));
  }
);
