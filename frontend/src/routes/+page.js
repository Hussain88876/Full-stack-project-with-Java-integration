import { PUBLIC_API_BASE_URL } from "$env/static/public";

const USER_URL = `${PUBLIC_API_BASE_URL}/users`;

/**
 * TODO Load your own data in the homepage here.
 *
 * You will likely need other *.js files with other load functions too.
 */
export async function load({ fetch }) {
  const response = await fetch(USER_URL, { credentials: "include" });
  const messages = await response.json();
  return { messages };
}

// disable server side rendering
export const ssr = false;
