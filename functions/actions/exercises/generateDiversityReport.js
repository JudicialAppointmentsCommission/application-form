const { getDocument, getDocuments } = require('../../shared/helpers');

module.exports = (firebase, db) => {
  return {
    generateDiversityReport,
  };

  async function generateDiversityReport(exerciseId) {

    // get exercise
    const exercise = await getDocument(db.collection('exercises').doc(exerciseId));
    if (!exercise) { return false; }

    // get submitted applications
    const applications = await getDocuments(db.collection('applications')
      .where('exerciseId', '==', exerciseId)
      .where('status', 'in', ['applied', 'withdrawn'])
    );

    const report = {
      totalApplications: applications.length,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      applied: diversityReport(applications),
    };

    // get application records
    const applicationRecords = await getDocuments(db.collection('applicationRecords')
      .where('exercise.id', '==', exerciseId)
    );
    if (applicationRecords.length) {
      const handoverIds = applicationRecords.filter(doc => doc.stage === 'handover').map(doc => doc.id);
      const recommendedIds = applicationRecords.filter(doc => doc.stage === 'recommended').map(doc => doc.id);
      const selectedIds = applicationRecords.filter(doc => doc.stage === 'selected').map(doc => doc.id);
      const shortlistedIds = applicationRecords.filter(doc => doc.stage === 'shortlisted').map(doc => doc.id);
      const handoverApplications = applications.filter(doc => handoverIds.indexOf(doc.id) >= 0);
      const recommendedApplications = handoverApplications.concat(applications.filter(doc => recommendedIds.indexOf(doc.id) >= 0));
      const selectedApplications = recommendedApplications.concat(applications.filter(doc => selectedIds.indexOf(doc.id) >= 0));
      const shortlistedApplications = selectedApplications.concat(applications.filter(doc => shortlistedIds.indexOf(doc.id) >= 0));
      report.shortlisted = diversityReport(shortlistedApplications);
      report.selected = diversityReport(selectedApplications);
      report.recommended = diversityReport(recommendedApplications);
      report.handover = diversityReport(handoverApplications);
    }
    await db.collection('exercises').doc(exerciseId).collection('reports').doc('diversity').set(report);
    return report;
  }
};

const diversityReport = (applications) => {
  return {
    totalApplications: applications.length,
    gender: genderStats(applications),
    ethnicity: ethnicityStats(applications),
    disability: disabilityStats(applications),
    professionalBackground: professionalBackgroundStats(applications),
    socialMobility: socialMobilityStats(applications),
  };
};

const calculatePercents = (report) => {
  if (report.total) {
    const keys = Object.keys(report);
    for (let i = 0, len = keys.length; i < len; ++i) {
      if (keys[i] !== 'total') {
        report[keys[i]].percent = 100 * report[keys[i]].total / report.total;
      }
    }
  }
};

const genderStats = (applications) => {
  const stats = {
    total: 0,
    male: {
      total: 0,
    },
    female: {
      total: 0,
    },
    genderNeutral: {
      total: 0,
    },
    preferNotToSay: {
      total: 0,
    },
    other: {
      total: 0,
    },
    noAnswer: {
      total: 0,
    },
  };
  for (let i = 0, len = applications.length; i < len; ++i) {
    const application = applications[i].equalityAndDiversitySurvey ? applications[i].equalityAndDiversitySurvey : applications[i];
    switch (application.gender) {
      case 'male':
        stats.male.total += 1;
        break;
      case 'female':
        stats.female.total += 1;
        break;
      case 'prefer-not-to-say':
        stats.preferNotToSay.total += 1;
        break;
      case 'gender-neutral':
        stats.genderNeutral.total += 1;
        break;
      case 'other-gender':
        stats.other.total += 1;
        break;
      default:
        stats.noAnswer.total += 1;
    }
    stats.total += 1;
  }
  calculatePercents(stats);
  return stats;
};

const ethnicityStats = (applications) => {
  const stats = {
    total: 0,
    bame: {
      total: 0,
    },
    white: {
      total: 0,
    },
    other: {
      total: 0,
    },
    preferNotToSay: {
      total: 0,
    },
    noAnswer: {
      total: 0,
    },
  };
  for (let i = 0, len = applications.length; i < len; ++i) {
    const application = applications[i].equalityAndDiversitySurvey ? applications[i].equalityAndDiversitySurvey : applications[i];
    if (application.ethnicGroup) {
      switch (application.ethnicGroup) {
        case 'uk-ethnic':
        case 'irish':
        case 'gypsy-irish-traveller':
        case 'other-white':
          stats.white.total += 1;
          break;
        case 'prefer-not-to-say':
          stats.preferNotToSay.total += 1;
          break;
        case 'other-ethnic-group':
          stats.other.total += 1;
          break;
        default: // @todo check catch all is appropriate for bame
          stats.bame.total += 1;
      }
    } else {
      stats.noAnswer.total += 1;
    }
    stats.total += 1;
  }
  calculatePercents(stats);
  return stats;
};

const disabilityStats = (applications) => {
  const stats = {
    total: 0,
    yes: {
      total: 0,
    },
    no: {
      total: 0,
    },
    preferNotToSay: {
      total: 0,
    },
    noAnswer: {
      total: 0,
    },
  };
  for (let i = 0, len = applications.length; i < len; ++i) {
    const application = applications[i].equalityAndDiversitySurvey ? applications[i].equalityAndDiversitySurvey : applications[i];
    // @todo amend how we store disability answers to be string only
    if (application.disability === true) {
      stats.yes.total += 1;
    } else if (application.disability === false) {
      stats.no.total += 1;
    } else if (application.disability === 'prefer-not-to-say') {
      stats.preferNotToSay.total += 1;
    } else {
      stats.noAnswer.total += 1;
    }
    stats.total += 1;
  }
  calculatePercents(stats);
  return stats;
};

const professionalBackgroundStats = (applications) => {
  const stats = {
    total: 0,
    barrister: {
      total: 0,
    },
    cilex: {
      total: 0,
    },
    solicitor: {
      total: 0,
    },
    other: {
      total: 0,
    },
    preferNotToSay: {
      total: 0,
    },
    noAnswer: {
      total: 0,
    },
  };
  for (let i = 0, len = applications.length; i < len; ++i) {
    const application = applications[i].equalityAndDiversitySurvey ? applications[i].equalityAndDiversitySurvey : applications[i];
    if (application.professionalBackground && application.professionalBackground.length) {
      if (application.professionalBackground.indexOf('barrister') >= 0) {
        stats.barrister.total += 1;
      }
      if (application.professionalBackground.indexOf('cilex') >= 0) {
        stats.cilex.total += 1;
      }
      if (application.professionalBackground.indexOf('solicitor') >= 0) {
        stats.solicitor.total += 1;
      }
      if (application.professionalBackground.indexOf('other-professional-background') >= 0) {
        stats.other.total += 1;
      }
      if (application.professionalBackground.indexOf('prefer-not-to-say') >= 0) {
        stats.preferNotToSay.total += 1;
      }
    } else {
      stats.noAnswer.total += 1;
    }
    stats.total += 1;
  }
  calculatePercents(stats);
  return stats;
};

const socialMobilityStats = (applications) => {
  const stats = {
    total: 0,
    attendedUKStateSchool: {
      total: 0,
    },
    firstGenerationUniversity: {
      total: 0,
    },
  };
  for (let i = 0, len = applications.length; i < len; ++i) {
    const application = applications[i].equalityAndDiversitySurvey ? applications[i].equalityAndDiversitySurvey : applications[i];
    if (
      application.stateOrFeeSchool === 'uk-state-selective'
      || application.stateOrFeeSchool === 'uk-state-non-selective'
    ) {
      stats.attendedUKStateSchool.total += 1;
    }
    if (application.firstGenerationStudent === true) {
      stats.firstGenerationUniversity.total += 1;
    }
    stats.total += 1;
  }
  calculatePercents(stats);
  return stats;
};
