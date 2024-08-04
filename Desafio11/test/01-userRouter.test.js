import {describe, it, before, afterEach} from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";

const requester = supertest("http://localhost:8080")

const connDB = async () => {
    // Connects to mongoDb
    try {
      await mongoose.connect("mongodb+srv://backendCoderJRb:backend123@jr.rdtaukg.mongodb.net/?retryWrites=true&w=majority&appName=JR", {
        dbName: "ecommerce",
      });
      console.log("DB Online...!!!"); ;
    } catch (error) {
      console.log(error);
    }
  };
  connDB();


describe("Test avanzado",()=>{
    let cookie;
    // it("must correctly register a user",async function(){
    //     const mockUser = {
    //         name:"jorge",
    //         lastName:"Bergoglio",
    //         email:"jorge@test.com",
    //         age:82,
    //         password: 123
    //     };
    //     const {_body} = await requester.post("/api/sessions/register").send(mockUser);
    //     expect(_body.message.to.be.ok)
    // })
    it ("must login user and return COOKIE", async function(){
        const mockUser = {
            email: "adminCoder@coder.com",
            password:"123"
        }
        const result = await requester.post("/api/sessions/loginjwt").send(mockUser);
        //console.log(result);
        const cookieResult = result.headers["set-cookie"][0];
        expect(cookieResult).to.be.ok
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }
        console.log(cookie);
        expect(cookie.name).to.be.ok.and.equal("codercookie")
        expect(cookie.value).to.be.ok
    })
    it("must return products", async function(){
        const products = await requester.get("/api/http://localhost:8080/api/products").set("Cookie",[`${cookie.name}=${cookie.value}`]);
        console.log(products);
    })
})

  
  //let result = await requester.get("/api/products")                         // ,roleMiddleware(["admin","user","premium"])
  //console.log(result);

  