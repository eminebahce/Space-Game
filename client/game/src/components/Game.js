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
      bullets: [],
      shipPositions: [],
      bulletPositions: []
    };

    this.socket = io("localhost:4000");

    this.socket.emit("new player");
    setInterval(() => {
      this.socket.emit("movement", this.state);
    }, 1000 / 60);
    setInterval(this.detectCollision, 100);

    this.socket.on("state", players => {
      this.setState({ players });
    });
  }

  getShipPosition = (playerId, position) => {
    const ships = this.state.players;
    this.setState({
      players: { ...ships, [playerId]: { ...ships[playerId], position } }
    });
  };

  getBulletPosition = (bulletId, position) => {
    const bullets = this.state.bullets;
    this.setState({
      bullets: bullets.map(bullet =>
        bullet.id === bulletId ? { ...bullet, position } : { ...bullet }
      )
    });
  };

  detectCollision = () => {
    const bullets = this.state.bullets;
    const ships = Object.keys(this.state.players);
    const players = this.state.players;

    bullets.forEach(bullet => {
      ships.forEach(id => {
        if (
          bullet.playerId !== id &&
          Math.abs(
            Math.pow(bullet.position.x - players[id].position.x, 2) +
              Math.pow(bullet.position.y - players[id].position.y, 2)
          ) < 144
        ) {
          console.log("someone is dead");
        }
      });
    });
  };

  keys = ["w", "a", "s", "d"];

  shootBullet = (playerId, position, direction) => {
    const newBullet = { playerId, id: Math.random(), position, direction };
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
        this.setState({ velocity: { x: this.state.velocity.x, y: -3 } });
        break;
      case "s":
        this.setState({ velocity: { x: this.state.velocity.x, y: 3 } });
        break;
      case "a":
        this.setState({ velocity: { x: -3, y: this.state.velocity.y } });
        break;
      case "d":
        this.setState({ velocity: { x: 3, y: this.state.velocity.y } });
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
              position={this.state.players[player].position}
              key={player}
              player={player}
              color={Konva.Util.getRandomColor()}
              velocity={this.state.players[player].velocity}
              socket={this.socket}
              shootBullet={this.shootBullet}
              getShipPosition={this.getShipPosition}
            />
          );
        })}
        {this.state.bullets.map(bullet => (
          <Bullet
            player={bullet.playerId}
            key={bullet.id}
            id={bullet.id}
            color={"red"}
            position={bullet.position}
            direction={bullet.direction}
            getBulletPosition={this.getBulletPosition}
          />
        ))}
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
      </Layer>
    );
  }
}
