import { USER_URL } from "$lib/js/api-urls.js";
import { PUBLIC_ARTICLES_URL } from "$env/static/public";

/**
 * This load function will load data shared across all pages - the login data.
 *
 * When first loading up this website, we will check if we are logged in or not by fetching from /api/users/me. If we
 * manage to get a 200 OK response, we will store the provided user data. Otherwise, we will set it to undefined.
 */
export async function load({ fetch }) {
  const [userResponse, articlesResponse] = await Promise.all([
    fetch(USER_URL, { credentials: "include" }),
    fetch(PUBLIC_ARTICLES_URL)
  ]);

  //handle user data
  let user;
  let isLoggedIn = false;
  if (userResponse.status === 200) {
    user = await userResponse.json();
    isLoggedIn = !!user;
  } else {
    user = null;
  }

  // Handle articles data
  let articles = [];
  if (articlesResponse.ok) {
    articles = await articlesResponse.json();
  }

  return { user, isLoggedIn, articles };
}
