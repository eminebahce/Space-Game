import React, { Component } from 'react'
import Game from "./components/Game";
import {Stage, Layer, Image} from "react-konva";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Stage
            className="App"
            width={window.innerWidth}
            height={window.innerHeight}
        >
          <Game/>
        </Stage>
      </div>
    );
  }
}

export default App;
