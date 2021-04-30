import logger from '../utils/logger';
import Responses from "../helper/responses";
import UserService from "../services/userServices";
import User from "../model/user";

const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    if(email) {
      const user = await UserService.getUser({email});
      return UserService.loginService(res, user, password);
    } else if(phoneNumber) {
      const user = await UserService.getUser({phoneNumber});
      return UserService.loginService(res, user, password);
    } else {
      return res.status(400).send(Responses.error(400, "login with either email or phone number"));
    }
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
};

const register = async (req, res) => { 
  try {
    const  { fullName, password, email, phoneNumber } = req.body;
    if(!fullName) return res.status(400).send(Responses.error(400, "fullname is required"));    
    if(!password) return res.status(400).send(Responses.error(400, "password is required"));    
    if(email || phoneNumber) {
      await UserService.createService(res, req.body)
    } else {
      return res.status(400).send(Responses.error(400, "email or phone number is required"));   
    }
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const list = async (req, res) => {
  try {
    const { q } = req.query;
    const search = q === undefined ? {}: { $text: { $search: `\"${q}\"` } };
    const criteria =  Object.assign({}, search);
    const result = await User.find(criteria)
    if(result.length === 0) return res.status(200).send(Responses.success(200,'No record', result));
    return res.status(200).send(Responses.success(200,'Record retrieved successfully', result));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error")); 
  }
}

export default { login, list, register }