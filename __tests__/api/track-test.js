const frisby = require("frisby");

describe("track", function(){
  it("should return a status 404 when a track is not found", function(){
    return frisby
      .fetch("http://localhost:8000/api/tracks/doesnotexist", {
        method:"PATCH",
        body:JSON.stringify({
          name: "A name that won’t work"
        })
      })
      .expect("status", 404);
  });

  it("should return a status 200 when a track is updated", function(){
    return frisby
      .fetch("http://localhost:8000/api/tracks/7", {
        method:"PATCH",
        body:JSON.stringify({
          name:"A new name"
        })
      })
      .expect("status", 200);
  });

  it("should return a status 422 with validation errors if request body is invalid", function(){
    return frisby
      .fetch("http://localhost:8000/api/tracks/7", {
        method:"PATCH",
        body:JSON.stringify({
          name:"",
          milliseconds:"a",
          unitPrice:"b"
        })
      })
      .expect("status", 422)
      .expect("json", "errors[0].message", "Name is required")
      .expect("json", "errors[1].message", "Milliseconds must be numeric")
      .expect("json", "errors[2].message", "Unit Price must be numeric")
  });
});
