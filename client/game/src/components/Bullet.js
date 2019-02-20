import React, { PureComponent } from "react";
import { Circle } from "react-konva";
import { WIDTH, HEIGHT } from "./Field";

const MIN_X = 12,
  MIN_Y = 12,
  MAX_X = WIDTH - MIN_X,
  MAX_Y = HEIGHT - MIN_Y,
  SPEED = 30;

export default class Ball extends PureComponent {
  state = {
    color: this.props.color,
    x: this.props.position.x,
    y: this.props.position.y,
    direction: { x: this.props.velocity.x, y: this.props.velocity.y }
  };

  componentDidMount() {
    this.animate();
  }

  newCoord = (val, delta, max, min) => {
    let newVal = val + delta;
    let newDelta = delta;

    if (newVal > max) {
      newVal = min + newVal - max;
    }

    if (newVal < min) {
      newVal = max - newVal;
    }

    return { val: newVal, delta: newDelta };
  };

  animate = () => {
    const x = this.state.newX || this.state.x,
      y = this.state.newY || this.state.y,
      horizontal = this.state.direction.x,
      vertical = this.state.direction.y;
    console.log(x, y, horizontal, vertical);

    if (horizontal !== 0 || vertical !== 0) {
      const newX = this.newCoord(x, horizontal, MAX_X, MIN_X);
      const newY = this.newCoord(y, vertical, MAX_Y, MIN_Y);

      console.log(newX, newY);

      this.setState({
        newX: newX.val,
        newY: newY.val
      });
    }

    this.animationTimeout = setTimeout(this.animate, 100);
  };

  render() {
    const { color, x, y, newX, newY } = this.state;

    return (
      <Circle
        ref={comp => {
          this.ball = comp;
        }}
        x={newX || x}
        y={newY || y}
        radius={10}
        fill={color}
        shadowBlur={1}
      />
    );
  }

  componentWillUnmount() {
    clearTimeout(this.animationTimeout);
  }
}
