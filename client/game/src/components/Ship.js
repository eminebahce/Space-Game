import React, { PureComponent } from "react";
import {Circle, Star} from "react-konva";
import { WIDTH, HEIGHT } from "./Field";

import KeyHandler from "react-key-handler";

const MIN_X = 12,
  MIN_Y = 12,
  MAX_X = WIDTH - MIN_X,
  MAX_Y = HEIGHT - MIN_Y;

export default class Ship extends PureComponent {
  state = {
    color: this.props.color,
    x: this.props.position.x,
    y: this.props.position.y,
    direction: { x: 0, y: 0 },
    aiming: { x: 0, y: 0 },
    canShoot: true
  };

  keys = ["i", "j", "k", "l"]; //todo: get arrow keys to work instead of ijkl.

  componentDidMount() {
    this.animate();
    setInterval(() =>
      this.props.getShipPosition(
        this.props.player,
        {
          x: this.state.x,
          y: this.state.y
        },
        200
      )
    );
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

  handleKeyDown = event => {
    switch (event.key) {
      case "i":
        this.setState({ aiming: { x: this.state.aiming.x, y: -1 } });
        break;
      case "k":
        this.setState({ aiming: { x: this.state.aiming.x, y: 1 } });
        break;
      case "j":
        this.setState({ aiming: { x: -1, y: this.state.aiming.y } });
        break;
      case "l":
        this.setState({ aiming: { x: 1, y: this.state.aiming.y } });
        break;
      default:
        return false;
    }
  };

  handleKeyUp = event => {
    switch (event.key) {
      case "i":
        this.setState({ aiming: { x: this.state.aiming.x, y: 0 } });
        break;
      case "k":
        this.setState({ aiming: { x: this.state.aiming.x, y: 0 } });
        break;
      case "j":
        this.setState({ aiming: { x: 0, y: this.state.aiming.y } });
        break;
      case "l":
        this.setState({ aiming: { x: 0, y: this.state.aiming.y } });
        break;
      default:
        return false;
    }
  };

  handleKeyPress = () => {
    if (!this.state.canShoot) {
      return false;
    }
    this.props.shootBullet(
      this.props.player,
      {
        x: this.state.x,
        y: this.state.y
      },
      this.state.aiming
    );
    this.setState({ canShoot: false });
    setTimeout(() => {
      this.setState({ canShoot: true });
    }, 200);
  };

  rotation = () => {
    const x = this.state.direction.x;
    const y = this.state.direction.y;

    if (x > 0  && y < 0) {return 45}
    else if (x > 0 && y === 0) {return 90}
    else if (x > 0 && y > 0) {return 135}
    else if (x === 0 && y > 0) {return 180}
    else if (x< 0 && y > 0) {return 225}
    else if (x< 0 && y === 0) {return 270}
    if(x < 0 && y < 0){return 315} else { return 0}
  };

  render() {
    const { color, x, y } = this.state;

    return (
      <Star
          ref={node =>{
            this.str=node;
          }}
          x={x}
          y={y}
          innerRadius={10}
          outerRadius={20}
          numPoints={3}
          fill={color}
          rotation={this.rotation()}
      >
        {this.keys.map(key => (
          <KeyHandler
            keyEventName="keydown"
            key={key + "down"}
            keyValue={key}
            onKeyHandle={this.handleKeyDown}
          />
        ))}
        {this.keys.map(key => (
          <KeyHandler
            keyEventName="keyup"
            key={key + "up"}
            keyValue={key}
            onKeyHandle={this.handleKeyUp}
          />
        ))}
        {this.keys.map(key => (
          <KeyHandler
            keyEventName="keypress"
            key={key + "press"}
            keyValue={key}
            onKeyHandle={this.handleKeyPress}
          />
        ))}
      </Star>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.animationTimeout);
  }
}
