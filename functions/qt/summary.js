const admin = require("firebase-admin");
const functions = require("firebase-functions");

module.exports = functions.firestore.document("qtSubmissions/{submission}").onCreate((snapshot, context) => {
  const firestore = admin.firestore();
  const data = snapshot.data();
  const record = {
    [data.testName] :
    { [data.testPhase] :
      {
        finishedAt: data.createdAt
      }
    },
    updatedAt: new Date()
  };

  return firestore
    .collection("qtSummaries")
    .doc(data.userId)
    .set(record, { merge: true })
    .then(() => console.info(record))
    .catch(e => console.error({error: e, record}));
});

