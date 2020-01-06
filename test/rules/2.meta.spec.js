const { setup, teardown } = require('./helpers');
const { assertFails, assertSucceeds } = require('@firebase/testing');

describe("Meta", () => {
  afterEach(async () => {
    await teardown();
  });
  
  context("Create", () => {
    it("prevent un-authenticated user from creating meta documents", async () => {
      const db = await setup();
      await assertFails(db.collection("meta").add({}));
    });
    it("prevent authenticated user from creating meta documents", async () => {
      const db = await setup({ uid: 'user1' });
      await assertFails(db.collection("meta").add({}));
    });
    it("prevent authenticated user with verified @judicialappointments.digital email from creating meta", async () => {
      const db = await setup({ uid: 'user1', email: 'user@judicialappointments.digital', email_verified: true });
      await assertFails(db.collection("meta").add({}));
    });
    it("prevent authenticated user with verified @judicialappointments.gov.uk email from creating meta", async () => {
      const db = await setup({ uid: 'user1', email: 'user@judicialappointments.gov.uk', email_verified: true });
      await assertFails(db.collection("meta").add({}));
    });
  });

  context("Read", () => {
    it("prevent un-authenticated user from reading meta", async () => {
      const db = await setup();
      await assertFails(db.collection("meta").get());
    });    
    it("prevent authenticated user from reading meta", async () => {
      const db = await setup({ uid: 'user1' });
      await assertFails(db.collection("meta").get());
    });
    it("prevent un-authenticated user from reading stats", async () => {
      const db = await setup();
      await assertFails(db.doc("meta/stats").get());
    });    
    it("prevent authenticated user from reading stats", async () => {
      const db = await setup({ uid: 'user1' });
      await assertFails(db.doc("meta/stats").get());
    });
    it("prevent authenticated user with unverified email from reading stats", async () => {
      const db = await setup({ uid: 'user1', email: 'user@email.com', email_verified: true });
      await assertFails(db.doc("meta/stats").get());
    });
    it("prevent authenticated user with verified email from reading stats", async () => {
      const db = await setup({ uid: 'user1', email: 'user@email.com', email_verified: true });
      await assertFails(db.doc("meta/stats").get());
    });
    it("allow authenticated user with verified @judicialappointments.digital email to read stats", async () => {
      const db = await setup({ uid: 'user1', email: 'user@judicialappointments.digital', email_verified: true });
      await assertSucceeds(db.doc("meta/stats").get());
    });    
    it("allow authenticated user with verified @judicialappointments.gov.uk email to read stats", async () => {
      const db = await setup({ uid: 'user1', email: 'user@judicialappointments.gov.uk', email_verified: true });
      await assertSucceeds(db.doc("meta/stats").get());
    });    
  });

  context("Update", () => {
    it("prevent un-authenticated user from updating stats", async () => {
      const db = await setup();
      await assertFails(db.doc("meta/stats").update({}));
    });
    it("prevent authenticated user from updating stats", async () => {
      const db = await setup({ uid: 'user1' });
      await assertFails(db.doc("meta/stats").update({}));
    });
    it("prevent authenticated user with verified @judicialappointments.digital email from updating stats", async () => {
      const db = await setup({ uid: 'user1', email: 'user@judicialappointments.digital', email_verified: true });
      await assertFails(db.doc("meta/stats").update({}));
    });
    it("prevent authenticated user with verified @judicialappointments.gov.uk email from updating stats", async () => {
      const db = await setup({ uid: 'user1', email: 'user@judicialappointments.gov.uk', email_verified: true });
      await assertFails(db.doc("meta/stats").update({}));
    });   
    it("allow authenticated JAC user to increment exercisesCount by 1", async () => {
      const db = await setup(
        { uid: 'user1', email: 'user@judicialappointments.gov.uk', email_verified: true },
        { 'meta/stats': { exercisesCount: 4 } }
      );
      await assertSucceeds(db.doc("meta/stats").update({exercisesCount: 5}));
    });
    it("prevent authenticated JAC user from changing exercisesCount by anything other than an increment of 1", async () => {
      const db = await setup(
        { uid: 'user1', email: 'user@judicialappointments.gov.uk', email_verified: true },
        { 'meta/stats': { exercisesCount: 4 } }
      );
      await assertFails(db.doc("meta/stats").update({exercisesCount: 4}));
      await assertFails(db.doc("meta/stats").update({exercisesCount: 3}));
      await assertFails(db.doc("meta/stats").update({exercisesCount: 6}));
      await assertFails(db.doc("meta/stats").update({exercisesCount: null}));
    });
  });

  context("Delete", () => {
    it("prevent un-authenticated user from deleting stats", async () => {
      const db = await setup();
      await assertFails(db.doc("meta/stats").delete());
    });
    it("prevent authenticated user from deleting stats", async () => {
      const db = await setup({ uid: 'user1' });
      await assertFails(db.doc("meta/stats").delete());
    });
    it("prevent authenticated user with verified @judicialappointments.digital email from deleting stats", async () => {
      const db = await setup({ uid: 'user1', email: 'user@judicialappointments.digital', email_verified: true });
      await assertFails(db.doc("meta/stats").delete());
    });
    it("prevent authenticated user with verified @judicialappointments.gov.uk email from deleting stats", async () => {
      const db = await setup({ uid: 'user1', email: 'user@judicialappointments.gov.uk', email_verified: true });
      await assertFails(db.doc("meta/stats").delete());
    }); 
  });



});
