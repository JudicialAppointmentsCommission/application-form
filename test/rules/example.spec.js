const { setup, teardown } = require('./helpers');
const { assertFails, assertSucceeds } = require('@firebase/testing');

describe("Example", () => {
  afterEach(async () => {
    await teardown();
  });

  context("Simple test", () => {
    it("should agree that 1 == 1", async () => {
      const db = await setup();
      await assertSucceeds(1 == 1);
    });
  });

});