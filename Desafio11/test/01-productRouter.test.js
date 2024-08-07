import {describe, it, before, afterEach} from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { json } from "express";
import { productsModel } from "../src/dao/models/productsModel.js";

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
        expect(cookie.name).to.be.ok.and.equal("codercookie")
        expect(cookie.value).to.be.ok
    })
    it("must return products", async function(){
        const response = await requester.get("/api/products").set("Cookie",[`${cookie.name}=${cookie.value}`]);
        const products = JSON.parse(response.text).payload;
        expect(products).to.be.an('array');
        for (const product of products) {
          expect(product).to.be.an('object');
          expect(product).to.have.property('_id');
          expect(product).to.have.property('id');
          expect(product.id).to.equal(product._id);
          expect(product).to.have.property('title');
          expect(product.title).to.be.a('string');
          expect(product).to.have.property('price');
          expect(product.price).to.be.a('number');
          expect(product.price).to.be.above(0);
          expect(product).to.have.property('status');
          expect(product.status).to.be.a('boolean');
          expect(product).to.have.property('category');
          expect(product.category).to.be.a('string');
          expect(product).to.have.property('owner');
          expect(product.owner).to.be.a('string');
          expect(product).to.have.property('thumbnails');
          expect(product.thumbnails).to.be.an('array');
          expect(product).to.have.property('code');
          expect(product.code).to.be.a('string');
          expect(product).to.have.property('stock');
          expect(product.stock).to.be.a('number');
        }       
    })
})

  