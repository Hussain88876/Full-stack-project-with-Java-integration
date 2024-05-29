import express from "express";
import { postArticle, getAllArticles, getArticleByID, deleteArticle, deleteArticleAsAdmin, updateArticle } from "../../db/article-dao.js";

const router = express.Router();

//Create a new article
router.post("/", async (req, res) => {
  try {
    let title = req.body.title;
    let text = req.body.text;
    let image = req.body.image;
    let user_id = req.body.user_id;
    let dateNow = new Date().toISOString().slice(0, 10);

    const posted = postArticle(title, image, user_id, text, dateNow);
    return res.sendStatus(posted ? 204 : 404);
  } catch {
    return res.sendStatus(422);
  }
});

//Get all articles
router.get("/", async (req, res) => {
  try {
    const allArticles = await getAllArticles();
    return res.json(allArticles);
  } catch {
    return res.sendStatus(422);
  }
});

//Get article by article id
router.get("/:article_id", async (req, res) => {
  let article_id = req.params.article_id;
  let article = await getArticleByID(article_id);
  return res.json(article);
});

//Edit article
router.patch("/:article_id", async (req, res) => {});

//Like article
router.patch("/:article_id/like", async (req, res) => {});

//Dislike article
router.delete("/:article_id/like", async (req, res) => {});

//Get number of likes
router.patch("/:article_id/like", async (req, res) => {});

//Delete article
router.delete("/:article_id", async (req, res) => {
  try {
    const article_id = req.params.article_id;
    const { user_id, is_admin } = req.body;

    let deleted;

    if (is_admin) {
      deleted = await deleteArticleAsAdmin(article_id);
    } else {
      deleted = await deleteArticle(article_id, user_id);
    }
    return res.sendStatus(deleted ? 204 : 404);
  } catch (error) {
    console.error("Error deleting article: ", error);
    return res.sendStatus(422);
  }
});

router.patch("/:article_id", async (req, res) => {
    try {
    let article_id = req.params.article_id;
    let title = req.body.title;
    let text = req.body.text;
    let image = req.body.image;
    let user_id = req.body.user_id;
    let dateNow = new Date().toISOString().slice(0, 10);

    const updated = await updateArticle(article_id, title, image, user_id, text, dateNow);
    return res.sendStatus(updated ? 204 : 404);
    } catch {
    return res.sendStatus(422);
    }
});


//Sort article, need to specify the sort options
router.get("/sort/{sort_options}", async (req, res) => {});

export default router;
