"use strict";
import app from '../app';
import expect from 'expect.js';
import request from 'supertest';
import JWT from "jsonwebtoken";
import FactoryGirl from './factory/index';
import Post from "../model/post";
import User from "../model/user";
import UserService from "../services/userServices";
const SECRET = process.env.JWT_SECRET;
let user, postId, factoryUser, factoryPost, token;
describe("#Post", () => {
  before(async function () {
    this.timeout(40000);
    factoryUser = await FactoryGirl.attrs('User');
    factoryPost = await FactoryGirl.attrs('Post');
    await User.remove({});
    await Post.remove({});
    user = await createUser(factoryUser);
    const loginData = await login(factoryUser, factoryUser.password);
    if(!loginData.data) return { message: loginData.message}
    token = loginData.data.token;
    factoryPost = Object.assign({}, {userId: user._id},factoryPost)
  });
  describe("Add post", () => {
    it("#create post", async ()=> {
      try {
        const res = await request(app).post('/api/post')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(factoryPost)
        .expect(201);
        expect(res.body.statusCode).to.equal(201);
        expect(res.body.message).to.equal("post created successfully");
        expect(res.body.data.isDeleted).to.equal(false);
        expect(res.body).have.property("success");
        expect(res.body).have.property("statusCode");
        expect(res.body).have.property("message");
        expect(res.body).have.property("data");
        expect(res.body.data).have.property("_id");
        expect(res.body.data).have.property("userId");
        expect(res.body.data).have.property("subscribe");
        expect(res.body.data).have.property("like");
        expect(res.body.data).have.property("likeUsers");
        expect(res.body.data).have.property("comments");
        expect(res.body.data).have.property("post");
        expect(res.body.data).have.property("isDeleted");
        expect(res.body.data).have.property("createdAt");
        expect(res.body.data).have.property("updatedAt");
        postId = res.body.data._id
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe("Fetch post", () => {
    it("#get all post", async ()=> {
      try {
        const res = await request(app).get('/api/posts')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .expect(200);
        expect(res.body.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal("Record retrieved");
        expect(res.body).have.property("success");
        expect(res.body).have.property("statusCode");
        expect(res.body).have.property("message");
        expect(res.body).have.property("data");
        expect(res.body.data[0]).have.property("_id");
        expect(res.body.data[0]).have.property("userId");
        expect(res.body.data[0]).have.property("subscribe");
        expect(res.body.data[0]).have.property("like");
        expect(res.body.data[0]).have.property("likeUsers");
        expect(res.body.data[0]).have.property("comments");
        expect(res.body.data[0]).have.property("post");
        expect(res.body.data[0]).have.property("isDeleted");
        expect(res.body.data[0]).have.property("createdAt");
        expect(res.body.data[0]).have.property("updatedAt");
      } catch (error) {
        throw new Error(error);
      }
    });
    it("#get a content", async ()=> {
      try {
        const res = await request(app).get(`/api/post/${postId}`)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .expect(200);
        expect(res.body.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal("post retrieved successfully");
        expect(res.body).have.property("success");
        expect(res.body).have.property("statusCode");
        expect(res.body).have.property("message");
        expect(res.body).have.property("data");
        expect(res.body.data).have.property("_id");
        expect(res.body.data).have.property("userId");
        expect(res.body.data).have.property("subscribe");
        expect(res.body.data).have.property("like");
        expect(res.body.data).have.property("likeUsers");
        expect(res.body.data).have.property("comments");
        expect(res.body.data).have.property("post");
        expect(res.body.data).have.property("isDeleted");
        expect(res.body.data).have.property("createdAt");
        expect(res.body.data).have.property("updatedAt");
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe("Like a post, undo post like", () => {
      it("#Like a post", async ()=> {
        try {
          const data = {postId}
          const res = await request(app).patch(`/api/post/like`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .send(data)
          .expect(200);
          expect(res.body.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("liked");
          expect(res.body.data.like).to.greaterThan(0)
          expect(res.body.data.likeUsers.length).to.greaterThan(0)
          expect(res.body).have.property("success");
          expect(res.body).have.property("statusCode");
          expect(res.body).have.property("message");
          expect(res.body).have.property("data");
          expect(res.body.data).have.property("_id");
          expect(res.body.data).have.property("userId");
          expect(res.body.data).have.property("subscribe");
          expect(res.body.data).have.property("like");
          expect(res.body.data).have.property("likeUsers");
          expect(res.body.data).have.property("comments");
          expect(res.body.data).have.property("post");
          expect(res.body.data).have.property("isDeleted");
          expect(res.body.data).have.property("createdAt");
          expect(res.body.data).have.property("updatedAt");
        } catch (error) {
          throw new Error(error);
        }
      });
      it("#Undo post like", async ()=> {
        try {
          const data = {postId}
          const res = await request(app).patch(`/api/post/undolike`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .send(data)
          .expect(200);
          expect(res.body.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("undo like");
          expect(res.body.data.like).to.eql(0)
          expect(res.body.data.likeUsers.length).to.eql(0)
          expect(res.body).have.property("success");
          expect(res.body).have.property("statusCode");
          expect(res.body).have.property("message");
          expect(res.body).have.property("data");
          expect(res.body.data).have.property("_id");
          expect(res.body.data).have.property("userId");
          expect(res.body.data).have.property("subscribe");
          expect(res.body.data).have.property("like");
          expect(res.body.data).have.property("likeUsers");
          expect(res.body.data).have.property("comments");
          expect(res.body.data).have.property("post");
          expect(res.body.data).have.property("isDeleted");
          expect(res.body.data).have.property("createdAt");
          expect(res.body.data).have.property("updatedAt");
        } catch (error) {
          throw new Error(error);
        }
      });
  });
  describe("Comment and subscribe to a post", () => {
      it("#comment on a post", async ()=> {
        try {
          const data = {postId, comment: 'lorem ipsum'}
          const res = await request(app).patch(`/api/post/comment`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .send(data)
          .expect(200);
          expect(res.body.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("user comment was successful");
          expect(res.body.data.comments.length).to.greaterThan(0)
          expect(res.body).have.property("success");
          expect(res.body).have.property("statusCode");
          expect(res.body).have.property("message");
          expect(res.body).have.property("data");
          expect(res.body.data).have.property("_id");
          expect(res.body.data).have.property("userId");
          expect(res.body.data).have.property("subscribe");
          expect(res.body.data).have.property("likeUsers");
          expect(res.body.data).have.property("like");
          expect(res.body.data).have.property("comments");
          expect(res.body.data).have.property("post");
          expect(res.body.data).have.property("isDeleted");
          expect(res.body.data).have.property("createdAt");
          expect(res.body.data).have.property("updatedAt");
        } catch (error) {
          throw new Error(error);
        }
      });
      it("#subscribe to a post", async ()=> {
        try {
          const data = {postId}
          const res = await request(app).patch(`/api/post/subscribe`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .send(data)
          .expect(200);
          expect(res.body.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("user subscribed to this post");
          expect(res.body.data.subscribe.length).to.greaterThan(0)
          expect(res.body).have.property("success");
          expect(res.body).have.property("statusCode");
          expect(res.body).have.property("message");
          expect(res.body).have.property("data");
          expect(res.body.data).have.property("_id");
          expect(res.body.data).have.property("userId");
          expect(res.body.data).have.property("subscribe");
          expect(res.body.data).have.property("likeUsers");
          expect(res.body.data).have.property("like");
          expect(res.body.data).have.property("comments");
          expect(res.body.data).have.property("post");
          expect(res.body.data).have.property("isDeleted");
          expect(res.body.data).have.property("createdAt");
          expect(res.body.data).have.property("updatedAt");
        } catch (error) {
          throw new Error(error);
        }
      });
  });
  describe("#Update and delete a post", () => {
      it("#update a post", async ()=> {
        try {
          const data = { post: 'lorem ipsum' }
          const res = await request(app).put(`/api/post/${postId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .send(data)
          .expect(200);
          expect(res.body.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("post updated");
          expect(res.body.data.comments.length).to.greaterThan(0)
          expect(res.body).have.property("success");
          expect(res.body).have.property("statusCode");
          expect(res.body).have.property("message");
          expect(res.body).have.property("data");
          expect(res.body.data).have.property("_id");
          expect(res.body.data).have.property("userId");
          expect(res.body.data).have.property("subscribe");
          expect(res.body.data).have.property("likeUsers");
          expect(res.body.data).have.property("like");
          expect(res.body.data).have.property("comments");
          expect(res.body.data).have.property("post");
          expect(res.body.data).have.property("isDeleted");
          expect(res.body.data).have.property("createdAt");
          expect(res.body.data).have.property("updatedAt");
        } catch (error) {
          throw new Error(error);
        }
      });
      it("#Delete a post", async ()=> {
        try {
          const data = {postId}
          const res = await request(app).delete(`/api/post/${postId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .send(data)
          .expect(200);
          expect(res.body.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("post deleted");
          expect(res.body.data.subscribe.length).to.greaterThan(0)
          expect(res.body).have.property("success");
          expect(res.body).have.property("statusCode");
          expect(res.body).have.property("message");
          expect(res.body).have.property("data");
          expect(res.body.data).have.property("_id");
          expect(res.body.data).have.property("userId");
          expect(res.body.data).have.property("subscribe");
          expect(res.body.data).have.property("likeUsers");
          expect(res.body.data).have.property("like");
          expect(res.body.data).have.property("comments");
          expect(res.body.data).have.property("post");
          expect(res.body.data).have.property("isDeleted");
          expect(res.body.data).have.property("createdAt");
          expect(res.body.data).have.property("updatedAt");
        } catch (error) {
          throw new Error(error);
        }
      });
  });
});
const login = async (data, password) => {
  const user = await UserService.getUser({email: data.email});
  if(!user.data) return {message: user.message, data: null};
  const loginData = user.data;
  const validPassword =  loginData.validatePassword(password)
  if (!validPassword) return {message: 'Invalid Credentials', data: null};
  const tokenData = { id: user.data._id, fullName: user.data.fullName };
  const token = await JWT.sign(tokenData, SECRET, { expiresIn: process.env.tokenExpiresIn });
  const result = { user: user.data, token };
  return {message: "Login successful", data: result};
}
const createUser = async (data) => {
  const user = new User();
  user.fullName = data.fullName; 
  user.email = data.email; 
  user.generateHash(data.password); 
  return await user.save();
}
