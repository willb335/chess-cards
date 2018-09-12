/* eslint-disable */

export const getPlayer = (request, name) => {
  return request(`https://api.chess.com/pub/player/${name}`).then(response =>
    response.json()
  );
};

export const getRating = (request, name) => {
  return request(`https://api.chess.com/pub/player/${name}/stats`).then(
    response => response.json()
  );
};
