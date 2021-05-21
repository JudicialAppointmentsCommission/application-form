'use strict';

const config = require('./shared/config');
const { firebase, app, db } = require('./shared/admin.js');
const updateCharacterChecksStatus = require('../functions/actions/applicationRecords/updateCharacterChecksStatus')(config, firebase, db);

const main = async () => {
  return updateCharacterChecksStatus({ referenceNumbers: ['5fByhzVewdzDNssYvfzA'], exerciseId: 'KOpW1w2nCyVe83rVFlz6', status: 'submitted' });
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
