require("sails-test-helper");

describe(TEST_NAME, function() {
  describe("generalStats", function() {
    it("should return with no contracts", function() {
      StatsService.generalStats([]);
    });
  });
});
