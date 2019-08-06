import vacancies from '@/store/vacancies';
// This is required by `jest.mock('vuexfire...`, but the linter can't interpret the mock.
// eslint-disable-next-line
import { firestoreAction } from 'vuexfire';
import { firestore } from '@/firebase';

jest.mock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return { firestore };
});

jest.mock('vuexfire', () => ({
  firestoreAction: jest.fn(callback => {
    const context = {
      bindFirestoreRef: (name, firebaseRef) => {
        return [name, firebaseRef];
      },
    };
    return callback(context);
  }),
}));

describe('store/vacancies', () => {
  const actions = vacancies.actions;

  describe('bindVacancies', () => {
    it('binds to the firestore vacancies collection', () => {
      expect(actions.bindVacancies[0]).toEqual('vacancies');
      expect(actions.bindVacancies[1]).toEqual(firestore.collection('vacancies'));
    });
  });
});


