import JWT from "jsonwebtoken";
import User from "../model/user";
import Responses from "../helper/responses";
const SECRET = process.env.JWT_SECRET;

const getUser = async (query) => {
  const data =  await User.findOne(query).exec();
  if(data) return {message: "user found", data}
  return {message: "user not found", data: null};
} 

const loginService = async (res, user, password) => {
  if(!user.data) return res.status(400).send(Responses.error(400, "Invalid Login Details"));
  const validPassword = user.data.validatePassword(password);
  if (!validPassword)
    return res.status(400).send(Responses.error(400, "Invalid Credentials"));
  const tokenData = { id: user.data._id, fullName: user.data.fullName };
  const token = await JWT.sign(tokenData, SECRET, { expiresIn: process.env.tokenExpiresIn });
  const data = { user: user.data, token };
  return res.status(200).send(Responses.success(200, "Login successful", data));
}

const createService = async (res, user) => {
  let data = {message: 'not found', data: null};
  if(user.email) {
    data  = await getUser({email: user.email})
  }
  if(user.phoneNumber) {
    data = await getUser({phoneNumber: user.phoneNumber})
  }
  if (data.data) return res.status(400).send(Responses.error(400, "user already exists"));  
  const newUser = new User();
  newUser.fullName = user.fullName;
  newUser.email = user.email;
  newUser.phoneNumber = user.phoneNumber;
  newUser.generateHash(user.password);
  await newUser.save();
  return res.status(201).send(Responses.success(201, "User created successfully", newUser));  
}

export default {getUser, createService, loginService}