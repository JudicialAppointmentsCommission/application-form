/*eslint-disable no-unused-vars*/
const functions = require('firebase-functions');
const sendEmail = require('../sharedServices').sendEmail;
const db = require('../sharedServices').db;
const getData = require('../sharedServices').getData;
const slog = require('../sharedServices').slog;

const setApplicationOnCreateData = async (snap, context) => {
  slog(`New Application (${context.params.applicationId}) created`);
  const data = snap.data();

  // pass in exerciseId and candidateId and save it to firestore
  // and initialize a createdAt for easier sorting
  const applicationRef = db.collection('applications').doc(context.params.applicationId);
  const setWithMerge = applicationRef.set({
    createdAt: Date.now(),
    status: 'draft',
    firstAssessorSubmittedAssessment: false,
    secondAssessorSubmittedAssessment: false,      
  }, { merge: true});

  return null;
};

const sendApplicationStartedEmailToCandidate = async (snap, context) => {
  const data = snap.data();

  const candidateData = await getData('candidates', data.userId);
  if (candidateData == null) {
    slog(`ERROR: No data returned from Candidates with docId (${data.userId})`);
    return null;
  }
  const candidateEmail = candidateData.email;
  const candidateFullName = candidateData.fullName;

  const personalizedData = {
    applicantName: candidateFullName,
    applicationUrl: `https://apply.judicialappointments.digital/apply/${data.exerciseId}/`,
  };

  // Check that the firebase config has the key by running:
  // firebase functions:config:get
  //
  // Set notify.templates.application_started in firebase functions like this:
  // firebase functions:config:set notify.templates.application_started="THE_GOVUK_NOTIFY_TEMPLATE_ID"  
  const templateId = functions.config().notify.templates.application_started;
  return sendEmail(candidateEmail, templateId, personalizedData).then((sendEmailResponse) => {
    slog(`${candidateFullName} (${candidateEmail}) has started to apply to exerciseId ${data.exerciseId}`);
    return true;
  });  
};

exports.handleApplicationOnCreate = functions.region('europe-west2').firestore
  .document('applications/{applicationId}')
  .onCreate( (snap, context) => {

    // onCreate set application data with data passed in:
    // - userId
    // - exerciseId
    setApplicationOnCreateData(snap, context);

    // after setting the data, send the candidate an email 
    // so they can track their application to a judgeship vacancy
    sendApplicationStartedEmailToCandidate(snap, context);
  });
