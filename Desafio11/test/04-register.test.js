import { describe, it, before, afterEach } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { UserManagerMONGO } from "../src/dao/UserManagerMONGO.js";
import mongoose from "mongoose";
import { isValidObjectId, ObjectId } from "mongoose";

const requester = supertest("http://localhost:8080");

describe("Test register", function () {
  this.timeout(10000);

  after(async function () {
    this.dao = new UserManagerMONGO();
    let mockUserToDelete = await mongoose.connection
      .collection("users")
      .findOne({ email: "jorge@test.com" });

    await mongoose.connection
      .collection("users")
      .deleteMany({ email: mockUserToDelete.email });

    await mongoose.connection
      .collection("carts")
      .deleteMany({ _id: mockUserToDelete.cart });
  });

  it("register must create user", async function () {
    this.dao = new UserManagerMONGO();
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

  it("must create cart", async function () {
    this.dao = new UserManagerMONGO();
    let mockUserFindCart = await mongoose.connection
      .collection("users")
      .findOne({ email: "jorge@test.com" });

    const cart = await mongoose.connection
      .collection("carts")
      .findOne({ _id: mockUserFindCart.cart });

    const expectedTimestamp1 = new Date(cart.CreatedAt);
    const expectedTimestamp2 = new Date(cart.UpdatedAt);

    expect(cart).to.not.be.null;
    expect(Array.isArray(cart.products)).to.be.true;
    expect(cart.products).to.be.empty;
    expect(isValidObjectId(cart._id)).to.exist;
    expect(expectedTimestamp1).to.be.instanceOf(Date);
    expect(expectedTimestamp2).to.be.instanceOf(Date);
  });
});
