import express from "express";
import { getArticleByID, postArticle } from "../../db/article-dao.js";
import {getAllArticles} from "../../db/article-dao.js";

const router = express.Router();

//Get user's own article
router.get("/:user_name", async (req, res) => {
});

//Create a new article
router.post("/", async (req, res) => {
try{
    let title = req.body.title;
    let text = req.body.text;
    let image = req.body.image; 
    let user_id = req.body.user_id;
    let dateNow = new Date().toISOString().slice(0, 10);

    const posted = postArticle(title, image, user_id, text, dateNow);
    return res.sendStatus(posted ? 204 : 404);
}catch{
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
    let article = getArticleByID(article_id);
    console.log(article);
    return res.json(article);
});

//Edit article
router.patch("/:article_id", async (req, res) => {
});

//Like article
router.patch("/:article_id/like", async (req, res) => {
});

//Dislike article
router.delete("/:article_id/like", async (req, res) => {
});

//Get number of likes
router.patch("/:article_id/like", async (req, res) => {
});

//Delete article
router.delete("/:article_id", async (req, res) => {
});

//Sort article, need to specify the sort options
router.get("/sort/{sort_options}", async(req, res) => {
});

export default router;