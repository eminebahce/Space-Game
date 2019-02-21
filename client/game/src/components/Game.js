import React, { Component } from "react";
import { Layer } from "react-konva";
import Field from "./Field";
import Ball from "./Ball";
import Konva from "konva";
import KeyHandler from "react-key-handler";
import io from "socket.io-client";

export default class Game extends Component {

    constructor(props){
        super(props);

        this.state = {
            color: Konva.Util.getRandomColor(),
            vertical: 0,
            horizontal: 0,
            players: []
        };

        this.socket = io('localhost:4000');

        this.socket.emit('new player');
        setInterval(()=> {
            this.socket.emit('movement', this.state)
        }, 1000/60);

        this.socket.on('state', (players) => {
            this.setState({players});
        })
    }

    keys = ["w", "a", "s", "d"];

    handleKeyDown = event => {
        switch (event.key) {
            case "w":
                this.setState({ horizontal : -10 });
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
                    //console.log(player);
                    return(
                            <Ball
                                color={this.state.color}
                                vertical={this.state.players[player].x}
                                horizontal={this.state.players[player].y}
                                key={player}
                            />
                    );
                })}
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
