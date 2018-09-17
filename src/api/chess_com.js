/**
 * It gets the player data for card
 * @param {function} request The request, either fetch or fakeFetch
 * @param {string} name The name of the player
 * @returns {Promise} A promise that resolves with the result of parsing the body text as JSON
 */
export const getPlayer = (request, name) => {
  return request(`https://api.chess.com/pub/player/${name}`).then(response =>
    response.json()
  );
};

/**
 * It gets the player rating for cardd
 * @param {function} request The request, either fetch or fakeFetch
 * @param {string} name The name of the player
 * @returns {Promise} A promise that resolves with the result of parsing the body text as JSON
 */
export const getRating = (request, name) => {
  return request(`https://api.chess.com/pub/player/${name}/stats`).then(
    response => response.json()
  );
};
