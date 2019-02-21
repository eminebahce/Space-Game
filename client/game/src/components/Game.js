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
      players: [], // ships
      bullets: [],
      aPlayerHasDied: false
    };

    this.socket = io("localhost:4000");

    this.socket.emit("new player");
    setInterval(() => {
      this.socket.emit("movement", this.state);
    }, 1000 / 60);
    setInterval(this.detectCollision, 100);

    this.socket.on("state", state => {
      this.setState({
        players: [...state.players],
        bullets: [...state.bullets]
      });
    });
  }

  getShipPosition = (playerId, position) => {
    const ships = this.state.players.map(player =>
      player.id === playerId ? { ...player, position } : { ...player }
    );
    this.setState({ players: ships });
    /* this.setState({
      players: { ...ships, [playerId]: { ...ships[playerId], position } }
    }); */
  };

  getBulletPosition = (bulletId, position) => {
    const bullets = this.state.bullets;
    this.setState({
      bullets: bullets.map(bullet =>
        bullet.id === bulletId ? { ...bullet, position } : { ...bullet }
      )
    });
  };
  j;
  detectCollision = () => {
    const bullets = this.state.bullets;
    const players = this.state.players;

    bullets.forEach(bullet => {
      players.forEach(ship => {
        if (
          bullet.playerId !== ship.id &&
          Math.pow(bullet.position.x - ship.position.x, 2) +
            Math.pow(bullet.position.y - ship.position.y, 2) <
            144
        ) {
          this.killPlayer(ship.id);
          console.log("someone is dead");
          this.setState({ aPlayerHasDied: true });
        }
      });
    });
  };

  killPlayer = id => {
    this.socket.emit("kill_player", id);
  };

  keys = ["w", "a", "s", "d"];

  shootBullet = (playerId, position, direction) => {
    console.log(playerId, position, direction);
    const newBullet = { playerId, id: Math.random(), position, direction };
    this.socket.emit("shoot_bullet", newBullet);
    setTimeout(() => this.socket.emit("remove_bullet", newBullet.id), 1000);
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
        {this.state.players.map(player => {
          return (
            <Ship
              position={player.position}
              key={player.id}
              player={player.id}
              color={Konva.Util.getRandomColor()}
              velocity={player.velocity}
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
