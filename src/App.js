import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Spring, config } from 'react-spring';
import styled from 'styled-components';

import ChessCard, { StyledPaperFront, Header, Avatar } from './ChessCard';
import chessComAvatar from './images/chesscom.png';

const SIZE = 1;

class App extends React.Component {
  state = {
    showCards: false,
    cards: [
      { name: 'DanielRensch', game: 'chess_blitz' },
      { name: 'magnus335', game: 'chess_blitz' },
      { name: 'Hikaru', game: 'chess_blitz' },
      { name: 'Coltinator5000', game: 'chess_blitz' },
      { name: 'Ginger_GM', game: 'chess_blitz' },
      { name: 'Bookfair', game: 'chess_blitz' }
    ],
    loadedCards: [],
    animationSettled: false
  };

  /**
   * It toggles cards on button click
   * @returns {void} Calls setState
   */
  handleShowCardsClick = () => {
    this.setState(({ showCards }) => ({
      showCards: !showCards
    }));
  };

  /**
   * It gets the x-cordinates for cards
   * @param {Object} card Takes a card object { [name]: boolean }
   * @returns {void} Calls setState and merges in the loaded card
   */
  loadCard = card => {
    this.setState(({ loadedCards }) => ({
      loadedCards: [...Object.values(loadedCards), ...Object.values(card)]
    }));
  };

  // eslint-disable-next-line require-jsdoc
  render() {
    const { cards, showCards, loadedCards, animationSettled } = this.state;
    const cardsLoaded =
      loadedCards.map(c => c).length === cards.length ? true : false;

    return (
      <MuiThemeProvider theme={theme}>
        <Container>
          {cards.map((card, i) => (
            <div key={i}>
              <Spring
                config={config.stiff}
                from={{ scale: 0 }}
                to={springTo(showCards, i)}
                onRest={() => this.setState({ animationSettled: true })}
                onStart={() => this.setState({ animationSettled: false })}
              >
                {styles => (
                  <div style={interpolateStyles(styles)}>
                    <ChessCard
                      name={card.name}
                      game={card.game}
                      loadCard={this.loadCard}
                      animationSettled={animationSettled}
                      showCards={showCards}
                      size={SIZE}
                    />
                  </div>
                )}
              </Spring>
            </div>
          ))}
          <Button
            onClick={cardsLoaded ? this.handleShowCardsClick : () => {}}
            size={1}
          >
            <Header
              gradient={`linear-gradient(to bottom, #8e9eab, #eef2f3)`}
              size={1}
            >
              <StyledAvatar src={chessComAvatar} alt="chess.com" size={1} />
            </Header>
            <div style={{ margin: '2rem 0 1rem 0' }}>Who&apos;s Hot?</div>
            <span aria-label="Who's Hot" role="img">
              🔥🔥🔥🔥🔥🔥
            </span>
          </Button>
          <Github />
        </Container>
      </MuiThemeProvider>
    );
  }
}

export default App;

// eslint-disable-next-line require-jsdoc
function Github() {
  return (
    <LinkContainer>
      <a
        rel="noopener noreferrer"
        id="github-link"
        target="_blank"
        href="https://github.com/willb335/chess-cards"
      >
        <svg height="65" width="65" viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="white"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
    </LinkContainer>
  );
}

/**
 * It gets the x-cordinates for cards
 * @param {boolean} showCards Thr showCards toggle
 * @param {number} index The index of the card
 * @returns {number} The x coordinate of the card
 */
const getXCoordinates = (showCards, index) => {
  if (index < 3) {
    return showCards ? -250 * ((index * SIZE) / 1.5) : 60;
  }
  return showCards ? -250 * (((index - 3) * SIZE) / 1.5) : 60;
};

/**
 * It gets the y-cordinates for cards
 * @param {boolean} showCards Thr showCards toggle
 * @param {number} index The index of the card
 * @returns {number} The y coordinate of the card
 */
const getYCoordinates = (showCards, index) => {
  if (index < 3) {
    return showCards ? -500 : 75;
  }
  return showCards ? -250 : 75;
};

/**
 * The end style object after interpolation
 * @param {boolean} showCards Thr showCards toggle
 * @param {number} index The index of the card
 * @returns {Object} The final style object
 */
const springTo = (showCards, index) => ({
  scale: showCards ? 1 : 0,
  x: getXCoordinates(showCards, index),
  y: getYCoordinates(showCards, index)
});

/**
 * The interpolated styles
 * @param {Object} styles The current style object from React Spring
 * @returns {Object} The current styles for the ChessCard container translate transform
 */
const interpolateStyles = styles => ({
  ...styles,
  ...{
    transform: `translate(${styles.x}px, ${styles.y}px) scale(${styles.scale})`,
    position: 'absolute'
  }
});

const theme = createMuiTheme({
  typography: { fontFamily: ['Lato', 'sans-serif'].join(',') }
});

// CSS
const Container = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 3rem;
`;

const StyledAvatar = styled(Avatar)`
  border: 0px solid white;
`;

const Button = styled(StyledPaperFront)`
  z-index: 1;
  background: linear-gradient(to left, #f12711, #f5af19);
  position: relative;
  color: white;
  font-size: 2rem;
  cursor: pointer !important;
`;

const LinkContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 9rem;
  height: 9rem;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.2s ease;
  transform: scale(0.9);
  &:hover {
    opacity: 0.7;
    transform: scale(1);
  }
  margin: 2rem;
`;
