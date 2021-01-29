'use strict';

const config = require('./shared/config');
const { firebase, app, db } = require('./shared/admin.js');
const { getDocument } = require('../functions/shared/helpers');
const { google } = require('googleapis');
let html = '';

const stylesheet = `
    <style>
      body {
        font-family: Khula, HelveticaNeue, Arial, Helvetica, sans-serif; 
        font-size: 1.1875rem;
      }
      th {
        color: #0B0C14; 
        width: 50%; 
        text-align: left; 
        border-bottom: solid 1px #0B0C14; 
        padding: 8px;
        vertical-align: top;
      }
      td {
        color: #0B0C14; 
        border-bottom: solid 1px #0B0C14; 
        padding: 8px;
      }
      table {
        border-spacing: 0; 
        width: 800px;
      }
      .sectionStart th, .sectionStart td {
        padding: 30px 8px 8px 8px;
      }
   </style>  
  `;


const main = async () =>
{
  const application = await
  getDocument(db.collection('applications').doc('testData-1'));

  html = pageHeader();

  createTitle('Welsh posts');
  createTable([{label: 'Applying for Welsh posts', value: toYesNo(application.applyingForWelshPost)}]);

  createTitle('Qualifications');
  createTable(getQualificationData(application));

  createTable([{label: 'Are you applying under Schedule 2(3)?', value: toYesNo(application.applyingForSchedule2Three)}]);
  createTable([{label: 'Explain how you\'ve gained experience in law', value: application.experienceUnderSchedule2Three}]);

  createTitle('Post-qualification experience');
  createTable(getPostQualificationData(application));

  createTitle('Judicial experience');
  createTable([{label: 'Fee-paid or salaried judge', value: lookup((application.feePaidOrSalariedJudge))}]);

  html += pageFooter();
  console.log(html);
}

const getQualificationData = (application) => {
  const qualificationData = application.qualifications;
  const data = [];
  qualificationData.forEach(q => {
    addField(data,'Qualification', lookup(q.type));
    addField(data, 'Location', lookup(q.location));
    addField(data, 'Date qualified', new Date()); // to do conversion
  })
  return data;
}

const getPostQualificationData = (application) => {
  const experienceData = application.experience;
  const data = [];
  experienceData.forEach((e, idx) => {
    addField(data, 'Job title', e.jobTitle, idx !== 0);
    addField(data, 'Organisation or business', e.orgBusinessName);
    addField(data, 'Dates worked', new Date());
    addField(data,'Law related tasks', formatLawRelatedTasks(e));
})
  return data;
}

const formatLawRelatedTasks = (experience) => {
  let value = '';
  if (experience.tasks) {
    experience.tasks.forEach(task => {
      value += lookup(task) + '<br/>'
    })
  }
  if (experience.otherTasks) {
    value += experience.otherTasks;
  }
  return value;
}

const addField = (array, label, value, lineBreak = false) => {
  if (value === undefined || value === null || value === '') {
    return;
  }
  if (typeof(value) === 'boolean') {
    value = toYesNo(value);
  }
  array.push({value: value, label: label, lineBreak: lineBreak})
}

const pageHeader = () => {
  return `<html><head>${stylesheet}</head><body>`;
};

const pageFooter = () => {
  return '</body></html>';
};

const createTitle = (data) => {
  html += `<h2>${data}</h2>`;
};

const createHeading = (data) => {
  data = data.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
  return `<h4>${data}</h4>`;
};

const createTable = (data) => {
  const tableStart = '<table>';
  const tableEnd = '</table>';
  const rowStartSectionStart = '<tr class="sectionStart">';
  const rowStart = '<tr>';
  const rowEnd = '</tr>';
  const headingStart = '<th>';
  const headingEnd = '</th>';
  const dataStart = '<td>';
  const dataEnd = '</td>';

  const rowHtml = [];
  data.forEach(each => {
    const heading = each.label;
    let value = each.value;

    let html = each.lineBreak ? rowStartSectionStart : rowStart;
    html += headingStart + heading + headingEnd + dataStart + value + dataEnd + rowEnd;
    rowHtml.push(html);
  });

  rowHtml.unshift(tableStart);
  rowHtml.push(tableEnd);
  html += rowHtml.join('');
};

const createParagraph = (data) => {
  return `<p>${data}</p>`;
};

const toYesNo = (input) => {
  return input ? 'Yes' : 'No';
}

const formatDate = (value, type) => {
  if (value) {
    const objDate = new Date(Date.parse(value));
    switch (type) {
      case 'month':
        return `${objDate.toLocaleString('en-GB', { month: 'long' })} ${objDate.getUTCFullYear()}`;
      case 'datetime':
        return objDate.toLocaleString('en-GB');
      default:
        return objDate.toLocaleDateString('en-GB');
    }
  }
};

const lookup = (value) => {
  if (typeof value === 'string') {
    // @TODO: extract lookup values
    const lookup = {
      'academic': 'Academic',
      'acting-arbitrator': 'Acting as an arbitrator',
      'acting-mediator-in-resolving-issues-that-are-of-proceedings': 'Acting as mediator in connection with attempts to resolve issues that are, or if not resolved could be, the subject of proceedings',
      'administrative-appeals-chamber': 'Administrative Appeals Chamber',
      'advising-application-of-law': 'Advising on the application of the law',
      'advocate-scottish-bar': 'Advocate – enrolled with the Scottish bar',
      'advocate-scotland': 'Advocate - Scotland',
      'african': 'African',
      'another-commonwealth-country': 'Another Commonwealth country',
      'approved': 'Approved',
      'assisting-in-proceedings-for-resolution-of-issues-under-law': 'Assisting persons involved in proceedings for the resolution of issues arising under the law',
      'athiest': 'Atheist',
      'atheist': 'Atheist',
      'bangladeshi': 'Bangladeshi',
      'barrister': 'Barrister',
      'bisexual': 'Bisexual',
      'both': 'Both',
      'buddhist': 'Buddhist',
      'caribbean': 'Caribbean',
      'chartered-association-of-building-engineers': 'Chartered Association of Building Engineers',
      'chartered-institute-of-building': 'Chartered Institute of Building',
      'chartered-institute-of-environmental-health': 'Chartered Institute of Environmental Health',
      'chinese': 'Chinese',
      'christian': 'Christian',
      'cilex': 'CILEx fellow (this might be called Fellow ILEX)',
      'CILEx': 'Fellow of the Chartered Institute of Legal Executives (CILEx)',
      'civil': 'Civil',
      'closed': 'Closed',
      'court': 'Court',
      'crime': 'Crime',
      'critical-analysis-qualifying-test': 'Critical analysis qualifying test (QT)',
      'devolution-questions': 'Devolution questions',
      'draft': 'Draft',
      'drafting-documents-that-affect-rights-obligations': 'Drafting documents intended to affect persons\' rights or obligations',
      'employment-appeals-tribunal': 'Employment Appeals Tribunal',
      'employment-tribunal': 'Employment Tribunal',
      'england-wales': 'England and Wales',
      'false': 'No',
      'family': 'Family',
      'fee-paid': 'Fee paid',
      'fee-paid-court-judge': 'Fee-paid court judge',
      'fee-paid-court-post': 'Fee-paid court post',
      'fee-paid-tribunal-judge': 'Fee-paid tribunal judge',
      'fee-paid-tribunal-post': 'Fee-paid tribunal post',
      'female': 'Female',
      'gay-man': 'Gay man',
      'gay-woman-lesbian': 'Gay woman or lesbian',
      'gender-neutral': 'Gender neutral',
      'general-medical-council': 'General Medical Council',
      'general-regulatory-chamber': 'General Regulatory Chamber',
      'group-1': 'Group 1 - £262,264',
      'group-1.1': 'Group 1.1 - £234,184',
      'group-2': 'Group 2 - £226,193',
      'group-3': 'Group 3 - £215,094',
      'group-4': 'Group 4 - £188,901',
      'group-5': 'Group 5 - £151,497',
      'group-5+': 'Group 5+ - £160,377',
      'group-6.1': 'Group 6.1 - £140,289',
      'group-6.2': 'Group 6.2 - £132,075',
      'group-7': 'Group 7 - £112,542',
      'group-8': 'Group 8 - £89,428',
      'gypsy-irish-traveller': 'Gypsy or Irish Traveller',
      'health-education-and-social-care-chamber': 'Health, Education and Social Care Chamber',
      'heterosexual-straight': 'Heterosexual or straight',
      'hindu': 'Hindu',
      'immigration-and-asylum-chamber': 'Immigration and Asylum Chamber',
      'indian': 'Indian',
      'irish': 'Irish',
      'jac-website': 'JAC Website',
      'jewish': 'Jewish',
      'judicial-office-extranet': 'Judicial Office Extranet',
      'judicial-functions': 'The carrying-out of judicial functions of any court or tribunal',
      'judging-your-future-newsletter': 'Judging Your Future Newsletter',
      'lands-chamber': 'Lands Chamber',
      'leadership-non-legal': 'Leadership - non legal',
      'leadership': 'Leadership',
      'legal': 'Legal',
      'linked-in': 'LinkedIn',
      'lord-chancellor': 'Lord Chancellor',
      'lord-chief-justice': 'Lord Chief Justice',
      'male': 'Male',
      'multiple-choice': 'Multiple choice',
      'muslim': 'Muslim',
      'name-blind-paper-sift': 'Name blind paper sift',
      'no': 'No',
      'no-religion': 'No religion',
      'none': 'None',
      'non-legal': 'Non legal',
      'non-uk-educated': 'I did not go to school in the UK',
      'non-university-educated': 'I did not go to university',
      'northern-ireland': 'Northern Ireland',
      'open': 'Open',
      'other': 'Other',
      'other-asian': 'Any other Asian background',
      'other-black': 'Any other Black/African/Caribbean background',
      'other-current-legal-role': 'Other',
      'other-ethnic-group': 'Other',
      'other-fee-paid-judicial-office': 'Other fee-paid Judicial Office',
      'other-fee-paid-judicial-office-holder': 'Other fee-paid judicial office holder',
      'other-gender': 'Other',
      'other-mixed': 'Any other mixed or multiple ethnic backgrounds',
      'other-professional-background': 'Other professional background',
      'other-religion': 'Other',
      'other-salaried-judicial-office-holder': 'Other salaried Judicial Office holder',
      'other-white': 'Any other White background',
      'other-sexual-orientation': 'Other',
      'paper-sift': 'Paper sift',
      'pakistani': 'Pakistani',
      'practice-or-employment-as-lawyer': 'Practice or employment as a lawyer',
      'pre-launch': 'Pre launch',
      'prefer-not-to-say': 'Prefer not to say',
      'professional-body-website-or-email': 'Professional body website or email (eg The Law Society)',
      'professional-body-magazine': 'Professional body magazine',
      'property-chamber': 'Property Chamber',
      'ranked-choice': 'Ranked choice',
      'read': 'Read',
      'ready': 'Ready for approval',
      'republic-of-ireland': 'Republic of Ireland',
      'royal-college-of-psychiatrists': 'Royal College of Psychiatrists',
      'royal-institute-of-british-architects': 'Royal Institute of British Architects',
      'royal-institution-of-chartered-surveyors': 'Royal Institution of Chartered Surveyors',
      'salaried': 'Salaried',
      'salaried-court-judge': 'Salaried court judge',
      'salaried-tribunal-judge': 'Salaried tribunal judge',
      'scenario-test-qualifying-test': 'Scenario test qualifying test (QT)',
      'schedule-23': 'Schedule 2(3)',
      'schedule-2d': 'Schedule 2(d)',
      'scotland': 'Scotland',
      'scottish-ministers': 'Scottish ministers',
      'second-tier-immigration-and-asylum-chamber': 'Immigration and Asylum Chamber (second-tier)',
      'self-assessment-with-competencies': 'Self Assessment with competencies',
      'senior-president-of-tribunals': 'Senior President of Tribunals (SPT)',
      'senior': 'Senior',
      'sikh': 'Sikh',
      'single-choice': 'Single choice',
      'situational-judgement-qualifying-test': 'Situational judgement qualifying test (QT)',
      'social-entitlement-chamber': 'Social Entitlement Chamber',
      'solicitor': 'Solicitor',
      'statement-of-eligibility': 'Statement of eligibility',
      'statement-of-suitability-with-competencies': 'Statement of Suitability with competencies',
      'statement-of-suitability-with-skills-and-abilities-and-cv': 'Statement of Suitability with skills and abilities and CV',
      'statement-of-suitability-with-skills-and-abilities': 'Statement of Suitability with skills and abilities',
      's9-1': 's9(1)',
      's9-4': 's9(4)',
      'tax-and-chancery': 'Tax and Chancery',
      'tax-chamber': 'Tax Chamber',
      'teaching-researching-law': 'Teaching or researching law',
      'telephone-assessment': 'Telephone assessment',
      'tribunal': 'Tribunal',
      'twitter': 'Twitter',
      'uk': 'UK',
      'uk-ethnic': 'English, Welsh, Scottish, Northern Ireland, British',
      'uk-independent-fee': 'UK independent or fee-paying school',
      'uk-independent-fee-with-bursary': 'UK independent or fee-paying school with financial assistance (bursary or means-tested scholarship)',
      'uk-state-non-selective': 'UK state school - non-selective',
      'uk-state-selective': 'UK state school - selective',
      'unpaid': 'Unpaid',
      'war-pension-and-armed-forces-compensation-chamber': 'War Pension and Armed Forces Compensation Chamber',
      'welsh-administration-questions': 'Welsh administration questions',
      'welsh-government': 'Welsh Government',
      'welsh-language': 'Welsh language',
      'welsh-reading-writing': 'Read and/or write Welsh',
      'welsh-speaking': 'Speak Welsh',
      'word-of-mouth': 'Word of mouth',
      'white-asian': 'White and Asian',
      'white-black-african': 'White and Black African',
      'white-black-caribbean': 'White and Black Caribbean',
      'write': 'Write',
      'schedule-2-d': 'Schedule 2(d)',
      'schedule-2-3': 'Schedule 2(3)',
      // 'xxx': 'xxx',`
    };

    return lookup[value] || value;
  }
  // Default for unanswered question
  if (typeof value === 'undefined' || value === null) {
    return 'Answer not supplied';
  }
  return value;
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
