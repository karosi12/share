import JWT from "jsonwebtoken";
import Response from "../helper/responses";
const SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  try {
    let token =
      req.headers.authorization === undefined ? "" : req.headers.authorization;
    if (token.includes("Bearer")) {
      const checkBearer = req.headers.authorization.split(" ");
      token = checkBearer[1];
    } else {
      token = req.headers.authorization;
    }
    if (!token)
      return res.status(401).send(Response.error(401, "Unauthorised access"));
    const authVerify = await JWT.verify(token, SECRET);
    if (!authVerify)
      return res.status(401).send(Response.error(401, "JWT token has expired"));
    req.decoded = authVerify;
    next();
  } catch (error) {
    if (error.message === "jwt expired")
      return res.status(401).send(Response.error(401, error.message));
    if (error.message)
      return res.status(401).send(Response.error(401, error.message));
    if (error)
      return res
        .status(401)
        .send(
          Response.error(401, "Something is wrong with user login token")
        );
  }
};
export default authenticate;
