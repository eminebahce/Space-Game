import React, { PureComponent } from "react";
import { Group, Rect } from "react-konva";

export const WIDTH = 800;
export const HEIGHT = 600;

const imageUrl = "http://3.bp.blogspot.com/-FZnYU3pQlbk/T_6B0GeG6fI/AAAAAAAAEuc/d_JPfy5D5oE/s1600/space+wallpaper+(1).jpeg";

export default class Field extends PureComponent {
    constructor(...args) {
        super(...args);
        const image = new window.Image();
        image.onload = () => {
            this.setState({
                fillPatternImage: image
            });
        };
        image.src = imageUrl;
        this.state = {
            color: "green",
            fillPatternImage: null
        };
    }
    render() {
        return (
            <Group>
                <Rect
                    x={0}
                    y={0}
                    width={WIDTH}
                    height={HEIGHT}
                    fill="rgb(0,0,0)"
                    shadowBlur={2}
                />
                <Rect
                    x={2}
                    y={2}
                    width={WIDTH - 4}
                    height={HEIGHT - 4}
                    fillPatternImage={this.state.fillPatternImage}
                />
            </Group>
        );
    }
}
