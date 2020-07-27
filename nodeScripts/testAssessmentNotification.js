'use strict';

const config = require('./shared/config');
const { firebase, app, db } = require('./shared/admin.js');
const { testAssessmentNotification } = require('../functions/actions/assessments.js')(config, firebase, db);

const main = async () => {
  return testAssessmentNotification({
    assessmentId: 'LZxWU3IM2DsaMg7Hb1qS-1',
    email: 'warren@precise-minds.co.uk',
    notificationType: 'request',
  });
};

main()
  .then((result) => {
    console.log(result);
    app.delete();
    return process.exit();
  })
  .catch((error) => {
    console.error(error);
    process.exit();
  });