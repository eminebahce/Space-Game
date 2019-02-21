import React, { PureComponent } from "react";
import Konva from "konva";
import {Circle, Group, Rect, Shape, Star} from "react-konva";
import { WIDTH, HEIGHT } from "./Field";

const MIN_X = 12,
    MIN_Y = 12,
    MAX_X = WIDTH - MIN_X,
    MAX_Y = HEIGHT - MIN_Y,
    SPEED = 30;

const imageUrl = "/Users/eminebahce/Desktop/Development/Game/client/game/src/ship.png";

export default class Ball extends PureComponent {

    constructor(...args){
        super(...args);

        this.state = {
            color: this.props.color,
            x: MIN_X,
            y: MIN_Y,
            direction: { x: 0, y: 0 },
        };
    }

    componentDidMount() {
        this.animate();
    }

    newCoord = (val, delta, max, min) => {
        let newVal = val + delta;
        let newDelta = delta;

        if(newVal > max){
            newVal = min + newVal - max
        }

        if(newVal < min ){
            newVal = max - newVal
        }

        return { val: newVal, delta: newDelta };
    };

    animate = () => {
        const { x, y } = this.state,
            { horizontal, vertical } = this.props;

        if (horizontal !== 0 || vertical !== 0) {
            const newX = this.newCoord(x, horizontal, MAX_X, MIN_X);
            const newY = this.newCoord(y, vertical, MAX_Y, MIN_Y);

            //console.log(newX, newY);

            this.setState({
                x: newX.val,
                y: newY.val,
                direction: {
                    x: newX.delta,
                    y: newY.delta
                }
            });
        }

        this.animationTimeout = setTimeout(this.animate, 50);
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
        if(x < 0 && y < 0){return 315} else { return 0
        }}
    render() {
        const { color, x, y, angle } = this.state;

        return (
            <Group>
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
                />
            </Group>
        );
    }

    componentWillUnmount() {
        clearTimeout(this.animationTimeout);
        clearTimeout(this.rotationTimeOut);
    }
}
