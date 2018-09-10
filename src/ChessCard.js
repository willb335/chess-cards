import React from 'react';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import { Spring } from 'react-spring';
import Proptypes from 'prop-types';

import { getLevel, getGradient, getLevelColor } from './ratingCategories';
import LineChart from './LineChart';

class ChessCard extends React.Component {
  static propTypes = {
    showCards: Proptypes.bool,
    name: Proptypes.string,
    loadCard: Proptypes.func,
    game: Proptypes.string,
    animationSettled: Proptypes.bool,
    size: Proptypes.number
  };

  static defaultProps = { size: 1 };

  state = {
    avatar: '',
    playerName: '',
    blitzRating: 0,
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
   */
  fetchCardInfo = () => {
    fetch(`https://api.chess.com/pub/player/${this.props.name}`)
      .then(response => response.json())
      .then(json =>
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

    fetch(`https://api.chess.com/pub/player/${this.props.name}/stats`)
      .then(response => response.json())
      .then(json =>
        this.setState({
          blitzRating: parseInt(json[this.props.game].last.rating, 10)
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
    const { animationSettled, game, size } = this.props;

    return animationSettled ? (
      <Spring
        config={{ tension: 140, friction: 35 }}
        to={{ rotateY: !front ? 180 : 360, x: !front ? 180 : 0 }}
      >
        {styles => (
          <div style={interpolateStyles(styles)}>
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
  size: Proptypes.number
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
  size
}) {
  return (
    <StyledPaperFront
      onClick={flipCard}
      zindex={front ? 2 : 0}
      scale={front.toString()}
      size={size}
      data-testid={`front-settled`}
    >
      <Header gradient={getGradient(blitzRating)} size={size}>
        <Avatar src={avatar} alt={`${username}`} size={size} />
      </Header>
      <CardBody size={size}>
        <PlayerName size={size}>{`${title} ${username}`}</PlayerName>
        <PlayerLevel size={size} color={getLevelColor(blitzRating)}>
          {blitzRating && getLevel(blitzRating)}
        </PlayerLevel>

        <PlayerStats
          style={playerStatsStyle(getGradient)(blitzRating)}
          size={size}
        >
          <StatsCategory size={size}>{getGame(game)}</StatsCategory>
          <StatsCategory size={size}>{blitzRating}</StatsCategory>
          <StatsCategory size={size}>{`+ ${plus}`}</StatsCategory>
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
  plus: Proptypes.number
};

// eslint-disable-next-line require-jsdoc
function Back({ flipCard, front, blitzRating, avatar, username, size, plus }) {
  return (
    <StyledPaperBack
      onClick={flipCard}
      scale={front.toString()}
      zindex={front ? 0 : 2}
      size={size}
    >
      <Header back gradient={getGradient(blitzRating)} size={size}>
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
 * Uses partial application to create style object for player stats
 * @param {string} gradient The background gradient returned from getGradient helper
 * @param {number} rating The players rating
 * @returns {Object} The style object for player stats
 */
const playerStatsStyle = gradient => rating => ({
  background: gradient(rating),
  color: rating > 1600 ? 'white' : 'black'
});

/**
 * The interpolated styles
 * @param {Object} styles The current style object from React Spring
 * @returns {Object} The current styles for card rotation
 */
const interpolateStyles = styles => ({
  ...styles,
  ...{
    transform: `translateX(${-styles.x}px) rotateY(${styles.rotateY}deg)`
  }
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

// CSS
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
  transform: scale(0.95);
  transition: box-shadow 0.5s, transform 0.5s;
  margin: ${props => `${props.size * 1.5}rem`};
  top: 0;
  right: 0;
  z-index: ${props => props.zindex};
  backface-visibility: hidden;
  cursor: pointer !important;

  &:hover {
    transform: scale(1);
    box-shadow: 0.5rem 2rem 3rem rgba(0, 0, 0, 0.2);
  }
`;

const StyledPaperBack = styled(StyledPaperFront)`
  z-index: ${props => props.zindex};
  transform: scale(0.95) rotateY(3.142rad);
  transition: box-shadow 0.5s, transform 0.5s;
  backface-visibility: visible;

  &:hover {
    transform: scale(1) rotateY(3.142rad);
    transition: box-shadow 0.5s, transform 0.5s;
    box-shadow: 0.5rem 2rem 3rem rgba(0, 0, 0, 0.2);
  }
`;

export const Header = styled.header`
  background: gradient;
  margin-top: ${props => `${props.size * 0.1}rem`};
  width: ${props => `${props.size * 15}rem`};
  height: ${props => `${props.size * 8}rem`};
  position: relative;
  background: ${props => props.gradient};
  border-radius: 4px 4px 0px 0px;
  transform: scale(0.95);
  transform: ${props =>
    props.back ? `scale(0.95) rotateY(180deg)` : `scale(0.95)`};
`;

export const Avatar = styled.img`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: ${props => `${props.size * 2}px solid white`};
  border-radius: 50%;
  width: ${props => `${props.size * 7.33}rem`};
  height: ${props => `${props.size * 7.33}rem`};
  margin: 5;
`;

const CardBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: ${props => `${props.size * 15}rem`};
  height: auto;
  transform: scale(0.95);
  transition: transform 0.5s;

  ${StyledPaperFront}:hover {
    transform: scale(1);
  }
`;

const PlayerName = styled.div`
  font-size: ${props => `${props.size * 1.73}rem`};
  color: black;
  font-weight: 900;
  margin-bottom: ${props => `${props.size * 0.66}rem`};
`;

const PlayerLevel = styled.div`
  text-transform: uppercase;
  font-size: ${props => `${props.size * 1.2}rem`};
  font-weight: 700;
  margin-bottom: ${props => `${props.size * 0.66}rem`};
  color: ${props => props.color};
`;

const PlayerStats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => `${props.size * 15}rem`};
  font-weight: 700;
  border-radius: 2px;
  height: ${props => `${props.size * 7}rem`};
`;

const StatsCategory = styled.div`
  padding: 0.25rem 0.25rem;
  padding: ${props => `${props.size * 0.25}rem ${props.size * 0.25}rem`};
  text-align: center;
  font-size: ${props => `${props.size * 1.2}rem`};
`;
