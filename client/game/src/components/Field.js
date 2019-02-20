import React, { PureComponent } from "react";
import { Group, Rect } from "react-konva";

export const WIDTH = 800;
export const HEIGHT = 600;

const imageUrl = "https://thumbs-prod.si-cdn.com/Ww78WE-L6T6Cwkz0fd74030skzY=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/46/9e/469e0cd2-8ded-47b2-825a-63e293072c47/space_debris_1.jpg";

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
