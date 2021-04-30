"use strict";
import app from '../app';
import expect from 'expect.js';
import request from 'supertest';
import FactoryGirl from './factory/index';
import User from "../model/user";

let user, factoryUser, token, email;
describe("#User", () => {
    before(async () => {
        factoryUser = await FactoryGirl.attrs('User');
        await User.remove({});
    });
    describe("Add User", () => {
        it("#create a user", async ()=> {
            try {
                const res = await request(app).post('/api/signup')
                .set('Accept', 'application/json')
                .send(factoryUser)
                .expect(201);
                email = res.body.data.email
                expect(res.body).have.property("success");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body).have.property("data");
                expect(res.body.statusCode).to.equal(201);
                expect(res.body.message).to.equal("User created successfully");
                expect(res.body.data).have.property("_id");
                expect(res.body.data).have.property("isDeleted");
                expect(res.body.data).have.property("email");
                expect(res.body.data).have.property("createdAt");
                expect(res.body.data).have.property("updatedAt");
            } catch (error) {
                throw new Error(error);
            }
        });
        it("#create a user with a registered email", async ()=> {
            try {
                const res = await request(app).post('/api/signup')
                .set('Accept', 'application/json')
                .send(factoryUser)
                .expect(400);
                expect(res.body).have.property("error");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body.message).to.equal('user already exists');
                expect(res.body.error).to.equal(true);
                expect(res.body.statusCode).to.equal(400);
            } catch (error) {
                throw new Error(error);
            }
        });
        it("#create a user without email or phoneNumber", async ()=> {
            try {
                factoryUser = Object.assign({}, factoryUser, {email: "johndoe@gmail.com"});
                delete factoryUser.email;
                const res = await request(app).post('/api/signup')
                .set('Accept', 'application/json')
                .send(factoryUser)
                .expect(400);
                expect(res.body).have.property("error");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body.message).to.equal('email or phone number is required');
                expect(res.body.error).to.equal(true);
                expect(res.body.statusCode).to.equal(400);
            } catch (error) {
                throw new Error(error);
            }
        });
        it("#create a user with email and/or phoneNumber", async ()=> {
            try {
                factoryUser = Object.assign({}, factoryUser, {email: "example@gmail.com",phoneNumber: "2347012345678"});
                const res = await request(app).post('/api/signup')
                .set('Accept', 'application/json')
                .send(factoryUser)
                .expect(201);
                expect(res.body).have.property("success");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body).have.property("data");
                expect(res.body.statusCode).to.equal(201);
                expect(res.body.message).to.equal("User created successfully");
                expect(res.body.data).have.property("_id");
                expect(res.body.data).have.property("isDeleted");
                expect(res.body.data).have.property("email");
                expect(res.body.data).have.property("phoneNumber");
                expect(res.body.data).have.property("createdAt");
                expect(res.body.data).have.property("updatedAt");
            } catch (error) {
                throw new Error(error);
            }
        });
        it("#Login user", async () => {
            try {
                const loginData = { password: 'password1234!', email}
                const res = await request(app).post('/api/login')
                .set('Accept', 'application/json')
                .send(loginData)
                .expect(200);
                expect(res.body).have.property("success");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body.message).to.equal('Login successful');
                expect(res.body.statusCode).to.equal(200); 
                expect(res.body.success).to.equal(true);
                expect(res.body.data).have.property("token");
                expect(res.body.data).have.property("user");
                token = res.body.data.token;
            } catch (error) {
                throw new Error(error);  
            }
        })
        it("#Login user with wrong email", async () => {
            try {
                const loginData = { password: 'password1234!', email: "johndoe12@gmail.com"}
                const res = await request(app).post('/api/login')
                .set('Accept', 'application/json')
                .send(loginData)
                .expect(400);
                expect(res.body).have.property("error");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body.message).to.equal("Invalid Login Details");
                expect(res.body.error).to.equal(true);
                expect(res.body.statusCode).to.equal(400);
            } catch (error) {
                throw new Error(error);  
            }
        });
        it("#Login admin with wrong password", async () => {
            try {
                const loginData = { password: 'password1234!!!', email}
                const res = await request(app).post('/api/login')
                .set('Accept', 'application/json')
                .send(loginData)
                .expect(400);
                expect(res.body).have.property("error");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body.message).to.equal('Invalid Credentials');
                expect(res.body.error).to.equal(true);
                expect(res.body.statusCode).to.equal(400);
            } catch (error) {
                throw new Error(error);  
            }
        });
    });
    describe("Find user", () => {
        it("Get user(s)", async () => {
            try {
                const search = "adeyemi"
                const res = await request(app).get(`/api/users?q=${search}`)
                .set('Accept', 'application/json')
                .set('Authorization', token)
                .expect(200);
                expect(res.body).have.property("success");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body.message).to.equal('Record retrieved successfully');
                expect(res.body.success).to.equal(true);
                expect(res.body.statusCode).to.equal(200);
                expect(res.body.data.length).to.greaterThan(0);
            } catch (error) {
                throw new Error(error);  
            }           
        });

        it("No record", async () => {
            try {
                const search = "lorem"
                const res = await request(app).get(`/api/users?q=${search}`)
                .set('Accept', 'application/json')
                .set('Authorization', token)
                .expect(200);
                expect(res.body).have.property("success");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body.message).to.equal('No record');
                expect(res.body.success).to.equal(true);
                expect(res.body.statusCode).to.equal(200);
                expect(res.body.data.length).to.equal(0);
            } catch (error) {
                throw new Error(error);  
            }           
        })
        it("Get all user", async () => {
            try {
                const res = await request(app).get(`/api/users`)
                .set('Accept', 'application/json')
                .set('Authorization', token)
                .expect(200);
                expect(res.body).have.property("success");
                expect(res.body).have.property("statusCode");
                expect(res.body).have.property("message");
                expect(res.body.message).to.equal('Record retrieved successfully');
                expect(res.body.success).to.equal(true);
                expect(res.body.statusCode).to.equal(200);
                expect(res.body.data.length).to.greaterThan(0);
            } catch (error) {
                throw new Error(error);  
            }           
        })        
    })
});
