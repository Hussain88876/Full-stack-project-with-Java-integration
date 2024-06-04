import express from "express";
import { getUserWithCredentials, getUserWithUsername } from "../../db/users-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";

const router = express.Router();


const handleLogin = async (req, res) => {
  // Get user with provided login details; return 401 if not found
  const { username, password } = req.body;
  const userNameValid = await getUserWithUsername (username)
  if (!userNameValid) return res.sendStatus(401);
  const userValid = await getUserWithCredentials(username, password);
  if (!userValid) {
    return res.sendStatus(401);
  } 

  else{
    const jwtToken = createUserJWT(username);

    // Expires 24 hours from now
    const expires = new Date(Date.now() + 86400000);
  
    // Send the JWT token in an HTTP-only cookie named authToken which expires in 24 hours.
    return res.cookie("authToken", jwtToken, { httpOnly: true, expires }).json({ username });
  }

  
}

/**
 * Sending a POST request to /api/auth with a valid username and password will authenticate a user (log that user in) and
 * return the JWT auth token set as the "authToken" HTTP-only cookie. In addition, the user's username will be sent back
 * as JSON, in the response. This can be used to display the user's username on the frontend if required.
 *
 * If the user is already logged in, this will remove any old login details and replace the cookie with the new one.
 *
 * Sending invalid credentials will result in a 401. No difference between invalid username and invalid password.
 */
router.post('/login', handleLogin);

/**
 * Sending a DELETE request to /api/auth will invalidate the authToken cookie, essentially causing that user to be logged out.
 *
 * Since there's no harm in invalidating a cookie which doesn't exist, we don't need to check if the user is actually logged in
 * or not first.
 */
router.post("/logout", (req, res) => {
  const expires = new Date(0); // Setting the expiry time of the cookie to some time in the past will cause it to be deleted.
  return res.cookie("authToken", "", { httpOnly: true, expires }).sendStatus(204);
});

export default router;
