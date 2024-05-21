import { PUBLIC_ARTICLES_URL, PUBLIC_USERS_URL } from "$env/static/public";

export async function load({ fetch, params }) {
  const articleResponse = await fetch(`${PUBLIC_ARTICLES_URL}/${params.id}`);
  const currentArticle = await articleResponse.json();

  const authorResponse = await fetch(`${PUBLIC_USERS_URL}/${currentArticle.authorId}`);
  const author = await authorResponse.json();

  return { currentArticle, author };
}
