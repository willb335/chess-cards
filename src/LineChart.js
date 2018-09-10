import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries
} from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import format from 'date-fns/format';
import Proptypes from 'prop-types';
// import styled from 'styled-components';

import { getRandomInt } from './ChessCard';

class LineChart extends React.Component {
  static propTypes = { blitzRating: Proptypes.number, plus: Proptypes.number };
  state = { startOfHotStreak: '', data: [] };

  /**
   * Generates mock data and sets it to state
   * @returns {void} Adds the start date and ratings data to state
   */
  componentDidMount() {
    const randomMonth = getRandomInt(5, 7);
    const randomDay = getRandomInt(1, 30);
    const startOfHotStreak = format(
      new Date(2018, randomMonth, randomDay),
      'MM/DD'
    );
    this.setState({
      startOfHotStreak,
      data: this.createData(this.props.blitzRating, this.props.plus)
    });
  }

  /**
   * It creates mock data for the player's rating over time
   * @param {number} rating The player's rating
   * @param {number} plus The player's rating increase since start of streak
   * @returns {Array} Array of data objects to be used by bar graph
   */
  createData = (rating, plus) => {
    const { startOfHotStreak } = this.state;
    let playerRating = rating - plus;
    return [...Array(40)].map((_, i) => {
      const randomOffDay = getRandomInt(3, 5);
      let date = i;

      if (date === 0) date = startOfHotStreak;
      if (date === [...Array(40)].length - 1) date = currentDate;

      playerRating =
        i % randomOffDay === 0
          ? playerRating - i * 3.5
          : playerRating + i * 2.0;

      return {
        x: date,
        y: playerRating,
        color: i % randomOffDay === 0 ? '#4286f4' : '#f12711'
      };
    });
  };

  // eslint-disable-next-line require-jsdoc
  render() {
    const { startOfHotStreak, data } = this.state;
    return (
      <div>
        <XYPlot
          margin={{ left: 37, right: 15, top: 20, bottom: 30 }}
          xType="ordinal"
          yType="linear"
          width={150}
          height={150}
          stroke="white"
          yDomain={[1000, 3200]}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickValues={[startOfHotStreak, currentDate]} />
          <YAxis tickPadding={0} />
          <VerticalBarSeries colorType="literal" data={data} />
        </XYPlot>
      </div>
    );
  }
}

export default LineChart;

const currentDate = format(new Date(), 'MM/DD');
