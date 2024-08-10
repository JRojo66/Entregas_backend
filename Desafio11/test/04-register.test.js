import { describe, it, before, afterEach } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { UserManagerMONGO } from "../src/dao/UserManagerMONGO.js";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";

const requester = supertest("http://localhost:8080");

describe("Test register", function () {
  this.timeout(10000);

  after(async function () {
    this.dao = new UserManagerMONGO();
    let mockUserToDelete = await mongoose.connection
      .collection("users")
      .findOne({ email: "jorge@test.com" });

    //console.log(mockUserToDelete);

    await mongoose.connection
      .collection("carts")
      .deleteMany({ _id: mockUserToDelete.cart });

    await mongoose.connection
      .collection("users")
      .deleteMany({ email: "jorge@test.com" });
  });

  it("must register user", async function () {
    const mockUser = {
      name: "jorge",
      lastName: "Bergoglio",
      email: "jorge@test.com",
      age: "82",
      password: "123",
    };
    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser)
      .expect(201);

    const responseExpect = JSON.parse(response.text);
    const newUser = responseExpect.newUser;
    const expectedTimestamp = new Date(responseExpect.CreatedAt);

    expect(responseExpect.message).to.equal("Register OK");
    expect(newUser.name).to.equal("Jorge");
    expect(newUser.lastName).to.equal("Bergoglio");
    expect(newUser.email).to.equal("jorge@test.com");
    expect(newUser.age).to.equal(82);
    expect(newUser.password).to.equal("********");
    expect(isValidObjectId(newUser.cart)).to.exist;
    expect(isValidObjectId(newUser._id)).to.exist;
    expect(expectedTimestamp).to.be.instanceOf(Date);
    expect(newUser.__v).to.exist;
  });
});
