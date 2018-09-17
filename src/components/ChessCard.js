import React from 'react';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import { Spring } from 'react-spring';
import Proptypes from 'prop-types';

import getLevel from '../ratingCategories';
import LineChart from './LineChart';
import { getPlayer, getRating } from '../api/chess_com';

class ChessCard extends React.Component {
  static propTypes = {
    showCards: Proptypes.bool,
    name: Proptypes.string,
    loadCard: Proptypes.func,
    game: Proptypes.string,
    animationSettled: Proptypes.bool,
    size: Proptypes.number,
    fakeFetch: Proptypes.func,
    cardNumber: Proptypes.number
  };

  static defaultProps = { size: 1 };

  state = {
    avatar: '',
    playerName: '',
    blitzRating: 1000,
    title: '',
    plus: 0,
    front: true
  };

  /**
   * Fetches card data from chess.com api
   * @returns {void} Makes two async calls to api.chess.com
   */
  componentDidMount() {
    this.fetchCardInfo();
  }

  /**
   * Called after update
   * @param {Object} prevProps The previous props
   * @returns {void} Updates state if showCards button was toggled
   */
  componentDidUpdate(prevProps) {
    if (prevProps.showCards !== this.props.showCards) {
      setTimeout(() => this.setState({ front: true }), 400);
    }
  }

  /**
   * The two fetch requests called on mount
   * @returns {void} calls setState after recieving json data from api.chess.com
   * or after recieving mock data from this.props.fakeFetch
   */
  fetchCardInfo = () => {
    // setup for mocking fetch
    const isFakeFetch = this.props.fakeFetch() !== undefined;
    const request = isFakeFetch ? this.props.fakeFetch : fetch;

    getPlayer(request, this.props.name).then(json =>
      this.setState(
        {
          avatar: json.avatar,
          username: json.username,
          location: json.location,
          title: json.title ? json.title.toLowerCase() : '',
          plus: getRandomInt(100, 250)
        },
        () => this.props.loadCard({ [this.state.username]: true })
      )
    );

    getRating(request, this.props.name).then(json =>
      this.setState({
        blitzRating: isFakeFetch
          ? json.blitzRating
          : parseInt(json[this.props.game].last.rating, 10)
      })
    );
  };

  /**
   * Flips the card via toggling state
   * @returns {void} Updates front in state if the transition is finished
   */
  flipCard = () => {
    this.props.animationSettled &&
      this.setState(({ front }) => ({ front: !front }));
  };

  // eslint-disable-next-line require-jsdoc
  render() {
    const { title, username, blitzRating, avatar, plus, front } = this.state;
    const { animationSettled, game, size, cardNumber } = this.props;

    return animationSettled ? (
      <Spring
        config={{ tension: 180, friction: 27 }}
        to={{ rotateY: !front ? 180 : 360, x: !front ? 180 : 0 }}
      >
        {styles => (
          <div style={interpolateStyles(styles)}>
            {styles.rotateY >= 270 &&
              styles.x < 90 && (
                <Front
                  flipCard={this.flipCard}
                  front={front}
                  blitzRating={blitzRating}
                  avatar={avatar}
                  title={title}
                  username={username}
                  plus={plus}
                  game={game}
                  size={size}
                  dataId={`front-${cardNumber}`}
                />
              )}
            {styles.rotateY < 270 &&
              styles.x > 90 && (
                <Back
                  flipCard={this.flipCard}
                  front={front}
                  blitzRating={blitzRating}
                  avatar={avatar}
                  username={username}
                  size={size}
                  plus={plus}
                  dataId={`back-${cardNumber}`}
                />
              )}
          </div>
        )}
      </Spring>
    ) : (
      <div>
        {front && (
          <Front
            flipCard={this.flipCard}
            front={front}
            blitzRating={blitzRating}
            avatar={avatar}
            title={title}
            username={username}
            plus={plus}
            game={game}
            size={size}
          />
        )}
        {!front && (
          <Back
            flipCard={this.flipCard}
            front={front}
            blitzRating={blitzRating}
            avatar={avatar}
            username={username}
            size={size}
            plus={plus}
          />
        )}
      </div>
    );
  }
}

export default ChessCard;

Front.propTypes = {
  flipCard: Proptypes.func,
  front: Proptypes.bool,
  blitzRating: Proptypes.number,
  avatar: Proptypes.string,
  title: Proptypes.string,
  username: Proptypes.string,
  plus: Proptypes.number,
  game: Proptypes.string,
  size: Proptypes.number,
  getLevel: Proptypes.func,
  dataId: Proptypes.string
};

// eslint-disable-next-line require-jsdoc
function Front({
  flipCard,
  front,
  blitzRating,
  avatar,
  title,
  username,
  plus,
  game,
  size,
  dataId
}) {
  return (
    <StyledPaperFront onClick={flipCard} zindex={front ? 2 : 0} size={size}>
      <Header
        gradient={getLevel(blitzRating).gradient}
        size={size}
        shadow={getLevel(blitzRating).shadow}
      >
        <Avatar src={avatar} alt={`${username}`} size={size} />
      </Header>
      <CardBody data-testid={dataId} size={size}>
        <PlayerName size={size}>{`${title} ${username}`}</PlayerName>
        <PlayerLevel size={size} color={getLevel(blitzRating).color}>
          {blitzRating && getLevel(blitzRating).level}
        </PlayerLevel>

        <PlayerStats
          style={playerStatsStyle(blitzRating)}
          size={size}
          shadow={getLevel(blitzRating).shadow}
        >
          <StatsCategory size={size} left>
            {getGame(game)}
          </StatsCategory>
          <StatsCategory size={size}>{blitzRating}</StatsCategory>
          <StatsCategory size={size} right>{`+${plus}`}</StatsCategory>
        </PlayerStats>
      </CardBody>
    </StyledPaperFront>
  );
}

Back.propTypes = {
  flipCard: Proptypes.func,
  front: Proptypes.bool,
  blitzRating: Proptypes.number,
  avatar: Proptypes.string,
  username: Proptypes.string,
  size: Proptypes.number,
  plus: Proptypes.number,
  dataId: Proptypes.string
};

// eslint-disable-next-line require-jsdoc
function Back({
  flipCard,
  front,
  blitzRating,
  avatar,
  username,
  size,
  plus,
  dataId
}) {
  return (
    <StyledPaperBack onClick={flipCard} zindex={front ? 0 : 2} size={size}>
      <Header
        data-testid={dataId}
        gradient={getLevel(blitzRating).gradient}
        size={size}
        shadow={getLevel(blitzRating).shadow}
      >
        <Avatar src={avatar} alt={`${username}`} size={size} />
      </Header>
      <LineChart blitzRating={blitzRating} plus={plus} />
    </StyledPaperBack>
  );
}

/**
 * Gets a random number for mocking rating increase
 * @param {number} min The min rating increase
 * @param {number} max Thr max rating increase
 * @returns {number} The random rating increase
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gets styles for background and level color based on rating
 * @param {number} rating The players rating
 * @returns {Object} The style object for player stats
 */
const playerStatsStyle = rating => ({
  background: getLevel(rating).gradient,
  color: rating > 1600 ? 'white' : 'black'
});

/**
 * The interpolated styles
 * @param {Object} styles The current style object from React Spring
 * @returns {Object} The current styles for card rotation
 */
const interpolateStyles = styles => ({
  transform: `translateX(${styles.x * -1}px) rotateY(${styles.rotateY}deg)`
});

/**
 * Returns a more readable game format
 * @param {string} game The game type pulled from the api
 * @returns {string} A readable version of the game type
 */
const getGame = game => {
  let gameType;
  switch (game) {
    case 'chess_blitz':
      gameType = 'Blitz';
      break;
    default:
      gameType = 'none';
  }
  return gameType;
};

//////////////////////////////////////////// CSS
export const StyledPaperFront = styled(Paper)`
  position: absolute;
  width: ${props => `${props.size * 15}rem`};
  height: ${props => `${props.size * 20}rem`};
  background-color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  border-radius: 10px 10px 10px 10px;
  box-shadow: 0;
  transform: scale(0.9);
  transition: box-shadow 0.5s, transform 0.5s;
  margin: ${props => `${props.size * 1.5}rem`};
  top: 0;
  right: 0;
  z-index: ${props => props.zindex};
  cursor: pointer !important;

  ${'' /* &:hover {
    transform: scale(1);
    box-shadow: 0.5rem 2rem 3rem rgba(0, 0, 0, 0.2);
  } */};
`;

const StyledPaperBack = styled(StyledPaperFront)`
  z-index: ${props => props.zindex};
  transform: scale(0.9) rotateY(3.142rad);
  transition: box-shadow 0.5s, transform 0.5s;
  backface-visibility: visible;

  ${'' /* &:hover {
    transform: scale(1) rotateY(3.142rad);
    transition: box-shadow 0.5s, transform 0.5s;
    box-shadow: 0.5rem 2rem 3rem rgba(0, 0, 0, 0.2);
  } */};
`;

export const Header = styled.header`
  background: gradient;
  margin-top: ${props => `${props.size * 0.1}rem`};
  width: ${props => `${props.size * 15}rem`};
  height: ${props => `${props.size * 8}rem`};
  position: relative;
  background: ${props => props.gradient};
  border-radius: 4px 4px 4px 4px;
  transform: scale(0.9);
  box-shadow: ${props => `0rem 0.2rem 0.35rem ${props.shadow}`};
`;

export const Avatar = styled.img`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: ${props => `${props.size * 3}px solid white`};
  border-radius: 50%;
  width: ${props => `${props.size * 9.0}rem`};
  height: ${props => `${props.size * 9.0}rem`};
  margin: 5;
`;

const CardBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: ${props => `${props.size * 15}rem`};
  height: auto;
  transform: scale(0.9);
  transition: transform 0.5s;

  ${'' /* ${StyledPaperFront}:hover {
    transform: scale(1);
  } */};
`;

const PlayerName = styled.div`
  font-size: ${props => `${props.size * 1.85}rem`};
  color: black;
  font-weight: 900;
  margin-bottom: ${props => `${props.size * 0.15}rem`};
`;

const PlayerLevel = styled.div`
  text-transform: uppercase;
  font-size: ${props => `${props.size * 1.2}rem`};
  font-weight: 700;
  margin-bottom: ${props => `${props.size * 0.66}rem`};
  color: ${props => props.color};
  text-decoration: underline;
`;

const PlayerStats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => `${props.size * 15}rem`};
  font-weight: 700;
  border-radius: 4px 4px 4px 4px;
  height: ${props => `${props.size * 7.5}rem`};
  box-shadow: ${props => `0rem 0.1rem 0.35rem ${props.shadow}`};
`;

const StatsCategory = styled.div`
  padding: ${props =>
    `${props.size * 0.5}rem ${props.size * 0.75}rem ${props.size *
      0.5}rem ${props.size * 0.75}rem`};
  text-align: center;
  font-size: ${props => `${props.size * 1.6}rem`};
`;
