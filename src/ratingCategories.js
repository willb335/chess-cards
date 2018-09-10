/**
 * Gets label for player's card
 * @param {number} rating The player's rating
 * @returns {string} The label to be used on the player's card
 */
export function getLevel(rating) {
  let label;
  switch (true) {
    case rating > 2700:
      label = 'Legendary';
      break;
    case rating > 2500:
      label = 'Epic';
      break;
    case rating > 2000:
      label = 'Rare';
      break;
    case rating > 1800:
      label = 'Class A';
      break;
    case rating > 1600:
      label = 'Class B';
      break;
    case rating > 1400:
      label = 'Class C';
      break;
    case rating > 1200:
      label = 'Class D';
      break;
    default:
      label = 'Novice';
  }
  return label;
}

/**
 * Gets gradient for player's card
 * @param {number} rating The player's rating
 * @returns {string} The background gradient
 */
export function getGradient(rating) {
  let gradient;
  switch (true) {
    case rating > 2700:
      gradient = `radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),
                radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)`;
      break;
    case rating > 2500:
      gradient = 'linear-gradient(to right, #8e2de2, #4a00e0)';
      break;
    case rating > 2000:
      gradient = 'linear-gradient(to right, #36d1dc, #5b86e5)';
      break;
    case rating > 1800:
      gradient = 'linear-gradient(to left, #76b852, #8dc26f)';
      break;
    case rating > 1600:
      gradient = 'linear-gradient(to left, #cb2d3e, #ef473a)';

      break;
    case rating > 1400:
      gradient = 'linear-gradient(to left, #ece9e6, #ffffff)';
      break;
    case rating > 1200:
      gradient = 'Class D';
      break;
    default:
      gradient = 'Novice';
  }
  return gradient;
}

/**
 * Gets color for card's level label
 * @param {number} rating The player's rating
 * @returns {string} The color for card's level label
 */
export function getLevelColor(rating) {
  let color;
  switch (true) {
    case rating > 2700:
      color = `#8A6E2F`;
      break;
    case rating > 2500:
      color = '#8e2de2';
      break;
    case rating > 2000:
      color = '#5b86e5';
      break;
    case rating > 1800:
      color = '#8dc26f';
      break;
    case rating > 1600:
      color = '#cb2d3e';
      break;
    case rating > 1400:
      color = '#ece9e6';
      break;
    case rating > 1200:
      color = 'Class D';
      break;
    default:
      color = 'Novice';
  }
  return color;
}
