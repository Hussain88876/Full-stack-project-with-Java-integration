import { ART_URL } from "$lib/js/api-urls.js";

export async function load({ fetch, params }) {
  const articleResponse = await fetch(`${ART_URL}/${params.id}`);
  const currentArticle = await articleResponse.json();

  return currentArticle;
}
