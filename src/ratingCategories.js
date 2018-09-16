/**
 * Gets styles for player's card based on rating
 * @param {number} rating The player's rating
 * @returns {Object} The cards styling properties
 */
export default function getLevel(rating) {
  switch (true) {
    case rating > 2700:
      return {
        level: 'Legendary',
        gradient: `linear-gradient(to left, #C6920D, #D09D1F)`,
        color: '#C6920D',
        shadow: 'rgba(198, 146, 13, 0.5)'
      };
    case rating > 2500:
      return {
        level: 'Epic',
        gradient: `linear-gradient(to right, #8e2de2, #4a00e0)`,
        color: '#8e2de2',
        shadow: 'rgba(142, 45, 226, 0.5)'
      };
    case rating > 2000:
      return {
        level: 'Rare',
        gradient: `linear-gradient(to right, #36d1dc, #5b86e5)`,
        color: '#5b86e5',
        shadow: 'rgba(91, 134, 229, 0.5)'
      };
    case rating > 1800:
      return {
        level: 'Class A',
        gradient: `linear-gradient(to left, #76b852, #8dc26f)`,
        color: '#8dc26f',
        shadow: 'rgba(141, 194, 111, 0.5)'
      };
    case rating > 1600:
      return {
        level: 'Class B',
        gradient: `linear-gradient(to left, #cb2d3e, #ef473a)`,
        color: '#cb2d3e',
        shadow: 'rgba(203, 45, 62, 0.5)'
      };
    case rating > 1400:
      return {
        level: 'Class C',
        gradient: `linear-gradient(to left, #ece9e6, #ffffff)`,
        color: '#ece9e6',
        shadow: 'rgba(236, 233, 230, 0.5)'
      };
    case rating > 1200:
      return {
        level: 'Class D',
        gradient: `linear-gradient(to left, #ece9e6, #ffffff)`,
        color: '#ece9e6',
        shadow: 'rgba(236, 233, 230, 0.5)'
      };
    default:
      return {
        level: 'Class D',
        gradient: `linear-gradient(to left, #ece9e6, #ffffff)`,
        color: '#ece9e6',
        shadow: 'rgba(236, 233, 230, 0.5)'
      };
  }
}
