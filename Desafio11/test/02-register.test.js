import {describe, it, before, afterEach} from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { UserManagerMONGO } from "../src/dao/UserManagerMONGO.js";
import mongoose from "mongoose";

const requester = supertest("http://localhost:8080")

describe("Test register",function(){
    this.timeout(10000);

    before(async function(){
        this.dao=new UserManagerMONGO();
        await mongoose.connection.collection("users").deleteMany({email:"jorge@test.com"});
    })

    it("must register user", async function(){
        const mockUser = {
            "name":"jorge",
            "lastName":"Bergoglio",
            "email":"jorge@test.com",
            "age":"82",
            "password":"123"
        }
        const response = await requester.post("/api/sessions/register")
        .send(mockUser)
        .expect(201);
    expect(JSON.parse(response.text).message).to.equal("Register OK");
    expect(JSON.parse(response.text).newUser.name).to.equal("Jorge");
    expect(JSON.parse(response.text).newUser.lastName).to.equal("Bergoglio");
    expect(JSON.parse(response.text).newUser.email).to.equal("jorge@test.com");
    expect(JSON.parse(response.text).newUser.age).to.equal(82);

        //const user = JSON.parse(response);
        //expect(response.status).to.be(number);
        console.log(JSON.parse(response.text));
    });

});