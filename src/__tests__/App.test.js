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

describe('shows and closes cards on button click', () => {
  fetch.mockResponse(
    JSON.stringify({
      avatar: 'avatar',
      username: 'realMagnusCarlsen',
      blitzRating: 1500,
      title: 'gm',
      plus: 100
    })
  );

  it('reveals cards on button click', () => {
    const { getByText, getByTestId } = render(<App fakeFetch={fetch} />);

    const button = getByText('Hot?', { exact: false });
    fireEvent.click(getByText('Hot?', { exact: false }));

    // wait for spring animation to translate cards onto screen
    setTimeout(() => {
      const settledCard = getByTestId('card-settled');
      expect(settledCard).toBeInTheDocument();
      expect(button).toHaveTextContent("Who's Hot");
    }, 500);
  });
});
