import { getDatabase } from "./database.js";

export async function postComment(desc, date, time, user_id, article_id, parent_comment_id) {
  const db = await getDatabase();
  const postResult = await db.run(`INSERT INTO Comments (desc, date, time, user_id, article_id, parent_comment_id) VALUES (?, ?, ?, ?, ?, ?)`,
  desc, date, time, user_id, article_id, parent_comment_id);

  // Return true if changes applied, false otherwise
  return postResult.changes > 0;
}

export async function getAllComments() {
  const db = await getDatabase();
  const comments = await db.all(`SELECT Comments.*, Users.username FROM Comments JOIN Users ON Comments.user_id = Users.user_id`);
  return comments;
}

export async function getCommentsByArt(article_id){

  const db = await getDatabase();
  const comments = await db.all(`SELECT Comments.*, Users.username, Users.avatar FROM Comments INNER JOIN Users ON Comments.user_id = Users.user_id WHERE article_id = ?`,
  article_id
  );
  let commentTree = unflatten(comments);
  return commentTree;
}

const unflatten = data => {
  const tree = data.map(e => ({...e}))
    .sort((a, b) => a.comment_id - b.comment_id)
    .reduce((a, e) => {
      a[e.comment_id] = a[e.comment_id] || e;
      a[e.parent_comment_id] = a[e.parent_comment_id] || {};
      const parent = a[e.parent_comment_id];
      parent.children = parent.children || [];
      parent.children.push(e);
      return a;
    }, {})
  ;
  return Object.values(tree)
    .find(e => e.comment_id === undefined).children;
};

export async function deleteComment(comment_id) {
  const db = await getDatabase();
  const deleteComm = await db.run(`DELETE FROM Comments WHERE comment_id = ?`, comment_id);
    // Return true if changes applied, false otherwise
  return deleteComm.changes > 0;
}

export async function isArticleAuth(article_id, user_id){
  const db = await getDatabase();
  let article_author = await db.get(`SELECT user_id FROM Articles WHERE article_id = ?`, article_id);
  if(article_author.user_id == user_id){
    console.log(1);
    return true;
  }else{
    console.log(2);
    return false;
  }
}

export async function isCommentAuth(comment_id, user_id) {
  const db = await getDatabase();
  let comment_author = await db.get(`SELECT user_id FROM Comments WHERE comment_id = ?`, comment_id);
  if (comment_author.user_id == user_id) {
    console.log(3);
    return true;
  }else{
    console.log(4);
    return false;
  }
}