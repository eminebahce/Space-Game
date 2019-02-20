import React, { PureComponent } from "react";
import { Circle } from "react-konva";
import { WIDTH, HEIGHT } from "./Field";

import KeyHandler from "react-key-handler";

const MIN_X = 12,
  MIN_Y = 12,
  MAX_X = WIDTH - MIN_X,
  MAX_Y = HEIGHT - MIN_Y;

export default class Ball extends PureComponent {
  state = {
    color: this.props.color,
    x: Math.random() * (MAX_X - MIN_X) + MIN_X,
    y: Math.random() * (MAX_Y - MIN_Y) + MIN_Y,
    direction: { x: 0, y: 0 }
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
    const { x, y } = this.state,
      horizontal = this.props.velocity ? this.props.velocity.x : 0,
      vertical = this.props.velocity ? this.props.velocity.y : 0;

    if (horizontal !== 0 || vertical !== 0) {
      const newX = this.newCoord(x, horizontal, MAX_X, MIN_X);
      const newY = this.newCoord(y, vertical, MAX_Y, MIN_Y);

      this.setState({
        x: newX.val,
        y: newY.val,
        direction: {
          x: newX.delta,
          y: newY.delta
        }
      });
    }

    this.animationTimeout = setTimeout(this.animate, 1000 / 60);
  };

  render() {
    const { color, x, y } = this.state;

    return (
      <Circle
        ref={comp => {
          this.ball = comp;
        }}
        x={x}
        y={y}
        radius={10}
        fill={color}
        shadowBlur={1}
      >
        <KeyHandler
          keyEventName="keyup"
          key={"t"}
          keyValue={"t"}
          onKeyHandle={() => {
            this.props.shootBullet(this.props.player, {
              x: this.state.x,
              y: this.state.y
            });
          }}
        />
      </Circle>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.animationTimeout);
  }
}
