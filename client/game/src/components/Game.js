import React, { Component } from "react";
import { Layer } from "react-konva";
import Field from "./Field";
import Ball from "./Ball";
import Konva from "konva";
import KeyHandler from "react-key-handler";
import io from "socket.io-client";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: Konva.Util.getRandomColor(),
      vertical: 0,
      horizontal: 0,
      players: [],
      bullets: []
    };

    this.socket = io("localhost:4000");

    this.socket.emit("new player");
    setInterval(() => {
      this.socket.emit("movement", this.state);
    }, 1000 / 60);

    this.socket.on("state", players => {
      this.setState({ players });
    });
  }

  keys = ["w", "a", "s", "d", "t"];

  shootBullet = playerId => {
    return { playerId, id: Math.random() };
  };

  removeBullet = bulletId => {
    const newBulletArray = this.state.bullets.filter(
      bullet => bullet.id !== bulletId
    );
    this.setState({ bullets: newBulletArray });
  };

  /* componentDidUpdate = (prevProps, prevState) => {
    if (this.state.bullets !== prevState.bullets) {
      const bullets = this.state.bullets;
      const bullet = bullets[bullets.length - 1];
      setTimeout(() => {
        this.setState({
          bullets: this.state.bullets.filter(
            element => element.id !== bullet.id
          )
        });
      });
    }
  }; */

  handleKeyDown = event => {
    switch (event.key) {
      case "w":
        this.setState({ horizontal: -10 });
        break;
      case "s":
        this.setState({ horizontal: 10 });
        break;
      case "a":
        this.setState({ vertical: -10 });
        break;
      case "d":
        this.setState({ vertical: 10 });
        break;
      case "t":
        const newBullet = this.shootBullet(this.state.players[0]);
        this.setState({ bullets: [...this.state.bullets, newBullet] });

        const newBulletArray = this.state.bullets.filter(
          bullet => bullet.id !== newBullet.id
        );

        setTimeout(() => this.removeBullet(newBullet.id), 1000);

        break;
      default:
        console.log("down: " + event.key);
    }
  };

  handleKeyUp = event => {
    switch (event.key) {
      case "w":
        this.setState({ horizontal: 0 });
        break;
      case "s":
        this.setState({ horizontal: 0 });
        break;
      case "a":
        this.setState({ vertical: 0 });
        break;
      case "d":
        this.setState({ vertical: 0 });
        break;
      default:
        console.log("up: " + event.key);
    }
  };

  render() {
    return (
      <Layer>
        <Field />
        {Object.keys(this.state.players).map(player => {
          //console.log(this.state.players[player].x);
          //console.log(this.state.players[player].y);
          return (
            <Ball
              key={player}
              color={this.state.color}
              vertical={this.state.players[player].x}
              horizontal={this.state.players[player].y}
            />
          );
        })}
        {this.state.bullets.map(bullet => (
          <Ball
            key={Math.random()}
            color={this.state.color}
            vertical={1}
            horizontal={1}
          />
        ))}
        {this.keys.map(key => (
          <KeyHandler
            keyEventName="keydown"
            key={key}
            keyValue={key}
            onKeyHandle={this.handleKeyDown}
          />
        ))}
        {this.keys.map(key => (
          <KeyHandler
            keyEventName="keyup"
            key={key}
            keyValue={key}
            onKeyHandle={this.handleKeyUp}
          />
        ))}
      </Layer>
    );
  }
}
