/**
 * This file contains a dummy DAO for the "Messages" database. You should
 * create your own DAOs for your project, and get rid of this one.
 */

import { getDatabase } from "./database.js";

export async function postArticle(title, image, user_id, text, date) {
  const db = await getDatabase();
  const postResult = await db.run(`INSERT INTO Articles (title, image, user_id, text, date) VALUES (?, ?, ?, ?, ?)`,
  title, image, user_id, text, date);

  // Return true if changes applied, false otherwise
  return postResult.changes > 0;
}

export async function getAllArticles() {
  const db = await getDatabase();
  const articles = await db.all(`
      SELECT Articles.article_id, Articles.title, Articles.user_id, Articles.text, Articles.date, Users.username
      FROM Articles
      INNER JOIN Users ON Articles.user_id = Users.user_id
  `);
  return articles;
}

export async function getArticleByID(id){
  const db = await getDatabase();
  const articleByID = await db.get('SELECT * FROM Articles WHERE article_id = ?', id);
  return articleByID;
}


