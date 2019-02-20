import React, { Component } from "react";
import { Layer } from "react-konva";
import Field from "./Field";
import Ship from "./Ship";
import Bullet from "./Bullet";
import Konva from "konva";
import KeyHandler from "react-key-handler";
import io from "socket.io-client";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      velocity: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
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

  keys = ["w", "a", "s", "d"];

  shootBullet = (playerId, position) => {
    const newBullet = { playerId, id: Math.random(), position };
    this.setState({ bullets: [...this.state.bullets, newBullet] });
    setTimeout(() => this.removeBullet(newBullet.id), 1000);
  };

  removeBullet = bulletId => {
    const newBulletArray = this.state.bullets.filter(
      bullet => bullet.id !== bulletId
    );
    this.setState({ bullets: newBulletArray });
  };

  handleKeyDown = event => {
    switch (event.key) {
      case "w":
        this.setState({ velocity: { x: this.state.velocity.x, y: -1 } });
        break;
      case "s":
        this.setState({ velocity: { x: this.state.velocity.x, y: 1 } });
        break;
      case "a":
        this.setState({ velocity: { x: -1, y: this.state.velocity.y } });
        break;
      case "d":
        this.setState({ velocity: { x: 1, y: this.state.velocity.y } });
        break;
      default:
        console.log("down: " + event.key);
    }
  };

  handleKeyUp = event => {
    switch (event.key) {
      case "w":
        this.setState({ velocity: { x: this.state.velocity.x, y: 0 } });
        break;
      case "s":
        this.setState({ velocity: { x: this.state.velocity.x, y: 0 } });
        break;
      case "a":
        this.setState({ velocity: { x: 0, y: this.state.velocity.y } });
        break;
      case "d":
        this.setState({ velocity: { x: 0, y: this.state.velocity.y } });
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
          return (
            <Ship
              key={player}
              player={player}
              color={Konva.Util.getRandomColor()}
              velocity={this.state.players[player].velocity}
              socket={this.socket}
              shootBullet={this.shootBullet}
            />
          );
        })}
        {this.state.bullets.map(bullet => (
          <Bullet
            player={bullet.playerId}
            key={Math.random()}
            color={"red"}
            velocity={{ x: 10, y: 0 }}
            position={bullet.position}
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
