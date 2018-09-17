import React from 'react';
import App from '../App';
import {
  render,
  cleanup,
  waitForElement,
  fireEvent
} from 'react-testing-library';
import 'jest-dom/extend-expect';

import { getPlayer, getRating } from '../api/chess_com';

afterEach(cleanup);

describe('mocking api', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('fake fetches chess.com and returns data to me', () => {
    fetch.mockResponse(JSON.stringify({ data: '12345' }));

    getPlayer(fetch, 'magnus335').then(res => {
      expect(res.data).toEqual('12345');
    });

    getRating(fetch, 'magnus335').then(res => {
      expect(res.data).toEqual('12345');
    });

    //assert on the times called and arguments given to fetch
    expect(fetch.mock.calls.length).toEqual(2);
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://api.chess.com/pub/player/magnus335'
    );
    expect(fetch.mock.calls[1][0]).toEqual(
      'https://api.chess.com/pub/player/magnus335/stats'
    );
  });

  it('renders app and gives cards mock data from fake fetch', async () => {
    fetch.mockResponse(
      JSON.stringify({
        avatar: 'avatar',
        username: 'realMagnusCarlsen',
        blitzRating: 1500,
        title: 'gm',
        plus: 100
      })
    );

    const { getByText } = render(<App fakeFetch={fetch} />);
    const username = await waitForElement(() =>
      getByText('realMagnusCarlsen', { exact: false })
    );
    const rating = await waitForElement(() =>
      getByText('1500', { exact: false })
    );
    const title = await waitForElement(() => getByText('GM', { exact: false }));

    expect(username).toHaveTextContent('realMagnusCarlsen');
    expect(rating).toHaveTextContent('1500');
    expect(title).toHaveTextContent('gm');
  });
});

describe('shows cards, closes cards on button click and flips cards on card click', () => {
  fetch.mockResponse(
    JSON.stringify({
      avatar: 'avatar',
      username: 'realMagnusCarlsen',
      blitzRating: 1500,
      title: 'gm',
      plus: 100
    })
  );

  it('reveals cards on button click and closes cards on second button click', async () => {
    const { getByText, getByTestId } = render(<App fakeFetch={fetch} />);

    const button = await waitForElement(() =>
      getByText('Hot?', { exact: false })
    );

    await setTimeout(() => {}, 1000);

    // show cards
    fireEvent.click(button);

    await setTimeout(() => {}, 1000);

    const front1 = await waitForElement(() => getByTestId('front-0'));
    const card1 = document.querySelector('[data-testid="front-0"]');
    const card4 = document.querySelector('[data-testid="front-3"]');
    const card1Back = document.querySelector('[data-testid="back-0"]');

    expect(button).toBeInTheDocument();
    expect(front1).toBeInTheDocument();
    expect(card1).toBeInTheDocument();
    expect(card4).toBeInTheDocument();
    expect(card1Back).not.toBeInTheDocument();

    // hide cards
    fireEvent.click(button);

    await setTimeout(() => {}, 1000);

    expect(front1).not.toBeInTheDocument();
    expect(card1).not.toBeInTheDocument();
    expect(card4).not.toBeInTheDocument();
    expect(card1Back).not.toBeInTheDocument();
  });

  it('reveals back on front of card click and then front on back of card click and then hides cards and finally reshows cards', async () => {
    const { getByText, getByTestId } = render(<App fakeFetch={fetch} />);

    let card2Back;
    let card5Back;
    let card2Front;
    let card5Front;
    let card6Back;

    const button = await waitForElement(() =>
      getByText('Hot?', { exact: false })
    );

    await setTimeout(() => {}, 1000);

    // reveal cards
    fireEvent.click(button);

    await setTimeout(() => {}, 1000);

    const front2 = await waitForElement(() => getByTestId('front-1'));
    const front5 = await waitForElement(() => getByTestId('front-4'));

    // click front of card 2 and card 5
    fireEvent.click(front2);
    fireEvent.click(front5);

    await setTimeout(() => {}, 1500);

    const card2 = await waitForElement(() => getByTestId('back-1'));
    await waitForElement(() => getByTestId('back-4'));

    card2Back = document.querySelector('[data-testid="back-1"]');
    card5Back = document.querySelector('[data-testid="back-4"]');

    expect(card2Back).toBeInTheDocument();
    expect(card5Back).toBeInTheDocument();

    // click back of card 2
    fireEvent.click(card2);

    await setTimeout(() => {}, 1000);

    await waitForElement(() => getByTestId('front-1'));

    card2Back = document.querySelector('[data-testid="back-1"]');
    card5Back = document.querySelector('[data-testid="back-4"]');
    card2Front = document.querySelector('[data-testid="front-1"]');

    expect(card2Back).not.toBeInTheDocument();
    expect(card5Back).toBeInTheDocument();
    expect(card2Front).toBeInTheDocument();

    //hide cards
    fireEvent.click(button);

    await setTimeout(() => {}, 1500);

    card2Back = document.querySelector('[data-testid="back-1"]');
    card5Back = document.querySelector('[data-testid="back-4"]');
    card2Front = document.querySelector('[data-testid="front-1"]');

    expect(card2Back).not.toBeInTheDocument();
    expect(card2Front).not.toBeInTheDocument();
    expect(card5Back).not.toBeInTheDocument();

    // show cards and
    fireEvent.click(button);

    await setTimeout(() => {}, 1500);

    await waitForElement(() => getByTestId('front-1'));

    card2Back = document.querySelector('[data-testid="back-1"]');
    card5Back = document.querySelector('[data-testid="back-4"]');
    card2Front = document.querySelector('[data-testid="front-1"]');
    card5Front = document.querySelector('[data-testid="front-4"]');
    card6Back = document.querySelector('[data-testid="back-5"]');

    expect(card2Front).toBeInTheDocument();
    expect(card2Back).not.toBeInTheDocument();
    expect(card6Back).not.toBeInTheDocument();
    expect(card5Back).toBeInTheDocument();
  });
});
