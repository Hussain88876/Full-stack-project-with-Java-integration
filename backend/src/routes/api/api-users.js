import express from "express";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import {
  createUser,
  updateUser,
  getUserList,
  deleteUser,
  deleteUserAsAdmin
} from "../../db/users-dao.js";
import { getArticleByUserID } from "../../db/article-dao.js";

const router = express.Router();

/**
 * Sending a GET request to /api/users/me will return the user info for the currently authenticated user,
 * or return a 401 if there's an authentication error.
 *
 * The authentication functionality is handled by the requiresAuthentication middleware, which adds the user
 * info to req.user. So we just need to return that.
 */
router.get("/me", requiresAuthentication, (req, res) => {
  console.log(req.user);
  return res.json(req.user);
});

/**
 * Sending a PATCH request to /api/users/me will allow requesters to update the currently authenticated user's
 * firstName, lastName, password, and desc.
 *
 * If there is no currently authenticated user, a 401 response is returned (handled by requiresAuthentication middleware).
 *
 * If the "update user" info in req.body is invalid, a 422 response is returned.
 *
 * If the user is not found, a 404 is returned (really should never happen...)
 *
 * Otherwise, the user info is updated and a 204 response is returned.
 */
router.patch("/me", requiresAuthentication, async (req, res) => {
  try {
    const isUpdated = await updateUser(req.user.user_id, req.body);
    return res.sendStatus(isUpdated ? 204 : 404);
  } catch (error) {
    console.error("Error:", error);
    return res.sendStatus(422);
  }
});

//Create new user
router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const created = createUser(req.body);
    return res.sendStatus(created ? 204 : 404);
  } catch {
    return res.sendStatus(422);
  }
});

//Return all user list
router.get("/", requiresAuthentication, async (req, res) => {
  try {
    const is_admin = req.body;
    let userList;

    if (is_admin) {
      userList = await getUserList();
    } else {
      return res.sendStatus(403);
    }
    return res.json(userList);
  } catch (error) {
    console.error("Error: ", error);
    return res.sendStatus(401);
  }
});

router.get("/:user_id/articles", async (req, res) => {
  let user_id = req.params.user_id;
  let userArticles = await getArticleByUserID(user_id);
  return res.json(userArticles);
});

//User login
router.post("/login", async (req, res) => {});

//User logput
router.post("/logout", async (req, res) => {});

//Delete user
router.delete("/:user_id", requiresAuthentication, async (req, res) => {
  try {
    const { user_id, is_admin } = req.body;

    let deleted;

    if (is_admin) {
      deleted = await deleteUserAsAdmin();
    } else {
      deleted = await deleteUser(user_id);
    }
    return res.sendStatus(deleted ? 204 : 403);
  } catch (error) {
    console.error("Error deleting user: ", error);
    return res.sendStatus(401);
  }
});

export default router;
