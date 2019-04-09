const expect = require("chai").expect;
const assert = require("chai").assert;
const Track = require("./../../models/track");

describe("track", function(){
  describe("milliseconds", function(){
    it("should return error if not numeric", async function(){
      try {
        let track = new Track({milliseconds: "a"});
        await track.validate();
      } catch (error) {
        expect(error.errors[0].message).to.equal("Milliseconds must be numeric");
      }
    });

    it("should pass if is numeric", async function(){
        let track = new Track({milliseconds:10});
        return assert.isNumber(track.milliseconds);
    });
  });
});
