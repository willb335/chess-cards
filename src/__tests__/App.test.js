import React from 'react';
import App from '../App';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
// import mockFetch from '../__mocks__/fetch';

const mockFetch = fetch;

const cards = [
  { name: 'DanielRensch', game: 'chess_blitz' },
  { name: 'magnus335', game: 'chess_blitz' },
  { name: 'Hikaru', game: 'chess_blitz' },
  { name: 'Coltinator5000', game: 'chess_blitz' },
  { name: 'Ginger_GM', game: 'chess_blitz' },
  { name: 'Bookfair', game: 'chess_blitz' }
];

afterEach(cleanup);

it('calls fetch', async () => {
  mockFetch.mockImplementationOnce(() => Promise.resolve(cards));
  const data = await fetch('url');
  console.log(data);
});
