import React from 'react';
import { Chart, Axis, Coord, Geom, Guide, Shape } from 'bizcharts';

const { Html, Arc, Line } = Guide;

Shape.registerShape('point', 'pointer', {
    drawShape(cfg, group) {
        let point = cfg.points[0];
        point = this.parsePoint(point);
        const center = this.parsePoint({
            x: 0,
            y: 0,
        });
        group.addShape('line', {
            attrs: {
                x1: center.x,
                y1: center.y,
                x2: point.x,
                y2: point.y - 20,
                stroke: cfg.color,
                lineWidth: 5,
                lineCap: 'round',
            },
        });
        return group.addShape('circle', {
            attrs: {
                x: center.x,
                y: center.y,
                r: 12,
                stroke: cfg.color,
                lineWidth: 4.5,
                fill: '#fff',
            },
        });
    },
});

const data = [
    { value: 6 },
];
const cols = {
    value: {
        min: 0,
        max: 9,
        ticks: [2.25, 3.75, 5.25, 6.75],
        nice: false,
    },
};

class Gauge extends React.Component {
    render() {
        return (
            <Chart height={400} data={data} scale={cols} forceFit>
                <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={1} />
                <Axis
                    name="value"
                    zIndex={2}
                    line={null}
                    label={{
                        offset: -20,
                        // formatter: (val) => {
                        //     if (val === '2.25') {
                        //         return '差';
                        //     } else if (val === '3.75') {
                        //         return '中';
                        //     } else if (val === '5.25') {
                        //         return '良';
                        //     }
                        //     return '优';
                        // },
                        textStyle: {
                            fontSize: 16,
                            fill: 'rgba(0, 0, 0, 0.65)',
                            textAlign: 'center',
                        },
                    }}
                />
                <Axis name="1" visible={false} />
                <Guide>
                    {/* <Line
                        start={[3, 0.905]}
                        end={[3.0035, 0.85]}
                        lineStyle={{
                            stroke: '#19AFFA',
                            lineDash: null,
                            lineWidth: 3,
                        }}
                    /> */}
                    <Line
                        start={[4.5, 0.905]}
                        end={[4.5, 0.85]}
                        lineStyle={{
                            stroke: '#19AFFA',
                            lineDash: null,
                            lineWidth: 3,
                        }}
                    />
                    <Line
                        start={[6, 0.905]}
                        end={[6.0035, 0.85]}
                        lineStyle={{
                            stroke: '#19AFFA',
                            lineDash: null,
                            lineWidth: 3,
                        }}
                    />
                    <Arc
                        zIndex={0}
                        start={[0, 0.965]}
                        end={[9, 0.965]}
                        style={{
                            stroke: '#000',
                            lineWidth: 18,
                            opacity: 0.09,
                        }}
                    />
                    <Arc
                        zIndex={1}
                        start={[0, 0.965]}
                        end={[data[0].value, 0.965]}
                        style={{
                            stroke: '#1890FF',
                            lineWidth: 18,
                        }}
                    />
                    <Html
                        position={['50%', '95%']}
                        html={() => (`<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.75em; color: rgba(0,0,0,0.43);margin: 0;"></p><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">${data[0].value * 10}%</p></div>`)}
                    />
                </Guide>
                <Geom
                    type="point"
                    position="value*1"
                    shape="pointer"
                    color="#1890FF"
                    active={false}
                    style={{ stroke: '#fff', lineWidth: 1 }}
                />
            </Chart>
        );
    }
}

export default Gauge