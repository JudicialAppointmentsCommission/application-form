const functions = require('firebase-functions');
const config = require('../shared/config');
const { firebase, db } = require('../shared/admin.js');
const { checkArguments } = require('../shared/helpers.js');
const { updateCharacterChecksStatus } = require('../actions/applicationRecords/updateCharacterChecksStatus')(config, firebase, db);

module.exports = functions.region('europe-west2').https.onCall(async (data, context) => {
  if (!checkArguments({
    exerciseId: { required: true },
    applicationRecordId: { required: false },
    applicationRecordIds: { required: false },
    status: { required: true },
    resend: { required: false },
  }, data)) {
    throw new functions.https.HttpsError('invalid-argument', 'Please provide valid arguments');
  }
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }
  const result = await updateCharacterChecksStatus(data);
  return {
    //result: result,
    result: 'OKAY!',
  };
});
