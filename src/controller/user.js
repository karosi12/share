import logger from '../utils/logger';
import Responses from "../helper/responses";
import UserService from "../services/userServices";
import EmailService from '../services/emailService'
import { uploadContent } from '../services/uploadService'
import User from "../model/user";
const SECRET = process.env.JWT_SECRET;

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

const find =  async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUser({_id: id})
    if(!user.data) return res.status(400).send(Responses.error(400, user.message));
    if(user.data) return res.status(200).send(Responses.success(200, 'Record retrieved', user.data))
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const register = async (req, res) => { 
  try {
    const  { fullName, password, email, phoneNumber } = req.body;
    if(!fullName) return res.status(400).send(Responses.error(400, "fullname is required"));    
    if(!password) return res.status(400).send(Responses.error(400, "password is required"));    
    if(email || phoneNumber) {
      await UserService.createService(res, req.body, req.get('host'));
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

const sendResetPasswordLink = async (req, res) => {
  try {
    const { email, domain } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .send(Responses.error(400, "invalid credentials, user not found"))
    const linkcode = jwt.sign(
      {
        email: email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      credential.jwtSecret
    );
    const link = `${domain}/change-password/${linkcode}`;
    const tempAlais = "password-reset-20210430";
    const data = {
      sender: Sender,
      reset_link: link,
      user_email: email,
      user_name: user.fullName,
    };
    const sendLink = await EmailService.sendEmailWithTemplate(email, tempAlais, data);
    if (!sendLink) return res.status(400).send(Responses.error(400, `Reset password mail not sent ${sendLink}`))
    return res.status(200).send(Responses.success(200,'Reset password mail sent', sendLink))
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.includes("@"))
      return res.status(400).send(Responses.error(400, "invalid email"));
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send(Responses.error(400, "invalid email"));
    user.generateHash(password);
    await user.save();
    return res.status(200).send(Responses.success(200,'user password reset successfully', user))
  } catch (error) {
    if (error.message === "jwt expired")
      return res
        .status(400)
        .send(Responses.error(400, "token has expired, kindly reset password again"))
    return res.status(500).send("Internal server error");
  }
}

const imageUpload =  async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).send(Responses.error(400, "No file was uploaded"))
    const imageExt = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!imageExt.includes(file.mimetype)) {
      return res.status(400).send(Responses.error(400, 'Invalid Mime Type, only JPEG and PNG Format are allowed'))
    }
    const result = await uploadContent(file);
    if (!result.data) return res.status(400).send(Responses.error(400, result.message))    
    return res.status(200).send(Responses.success(200,result.message, result.data))
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));   
  }
}

export default { login, list, imageUpload, register, find, resetPassword, sendResetPasswordLink }