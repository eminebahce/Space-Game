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
    const ships = this.state.shipPositions;
    const i = ships.findIndex(ship => ship.playerId === playerId);
    if (i === -1) {
      this.setState({ shipPositions: [...ships, { playerId, position }] });
    } else {
      this.setState({
        shipPositions: ships.map((ship, j) =>
          i === j ? { playerId, position } : ship
        )
      });
    }
  };

  getBulletPosition = (playerId, bulletId, position) => {
    const bullets = this.state.bulletPositions.filter(bullet => {
      return (
        this.state.bullets.findIndex(
          element => element.id === bullet.bulletId
        ) !== -1
      );
    });
    const i = bullets.findIndex(bullet => bullet.bulletId === bulletId);
    if (i === -1) {
      this.setState({
        bulletPositions: [...bullets, { playerId, bulletId, position }]
      });
    } else {
      this.setState({
        bulletPositions: bullets.map((bullet, j) =>
          i === j ? { playerId, bulletId, position } : bullet
        )
      });
    }
  };

  detectCollision = () => {
    const bullets = this.state.bulletPositions;
    const ships = this.state.shipPositions;

    bullets.forEach(bullet => {
      ships.forEach(ship => {
        if (
          bullet.playerId !== ship.playerId &&
          Math.abs(
            Math.pow(bullet.position.x - ship.position.x, 2) +
              Math.pow(bullet.position.y - ship.position.y, 2)
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
