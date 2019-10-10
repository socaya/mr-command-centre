import React, { useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { Card, Col, Row, Tabs, Button, Menu, Progress } from 'antd';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official';
import gauge from 'highcharts/modules/solid-gauge';
import data from 'highcharts/modules/data';
import maps from 'highcharts/modules/map';
import MapChart from './Map';

import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

HC_more(Highcharts);
gauge(Highcharts);
data(Highcharts)
maps(Highcharts)
const { TabPane } = Tabs;

const MR = inject("store")(observer(({ store, d2 }) => {
    const callback = (key) => {
        console.log(key);
    }
    let chart;

    useEffect(() => {
        chart = store.amChart
    });
    return (
        <Row gutter={8} >
            <Col span={19} style={{ marginTop: 8,minHeight:'80vh',background:'yellow' }}>
                <Menu
                    className="headers"
                    mode="horizontal"
                    style={{ display: 'flex' }}
                >
                    <Menu.Item key="1" style={{ fontSize: 24 }}>Measles Rubella (MR) - Uganda</Menu.Item>
                    <Menu.Item key="3" style={{ marginLeft: 'auto' }}> <Button type="danger" size="large" style={{ margin: 0 }}>Danger</Button></Menu.Item>
                </Menu>
                <Row gutter={8}>
                    <Col span={14}>
                        <Card>
                            <Row gutter={8}>
                                <Col span={7}>
                                    <div className="container">
                                        <div style={{
                                            color: '#000066'
                                        }}>POSTS</div>
                                        <div className="red">3200</div>
                                    </div>
                                </Col>
                                <Col span={7}>
                                    <div className="container">
                                        <div style={{ color: '#000066' }}>REPORTED</div>
                                        <div className="green">3200</div>
                                    </div>
                                </Col>
                                <Col span={10} className="flex-center">
                                    <div style={{ width: '50%', textAlign: "center", display: 'flex', flexDirection: 'column' }}>
                                        <span className="big-number-rr">56.8%</span>
                                        <span style={{ margin: -15 }}>Reporting Rate</span>
                                    </div>
                                    <Progress showInfo={false}  type="circle" percent={56.8} width={80} strokeWidth={15} style={{ width: '50%', textAlign: "center" }} />
                                </Col>
                            </Row>
                        </Card>
                        <Card style={{ marginTop: 8 }}>
                            <Row gutter={8}>
                                <Col span={7}>
                                    <div className="container">
                                        <div style={{
                                            color: '#000066'
                                        }}>TARGET</div>
                                        <div className="red">{store.textValues.target_population}</div>
                                    </div>
                                </Col>
                                <Col span={7}>
                                    <div className="container">
                                        <div style={{ color: '#000066' }}>ADMINISTERED</div>
                                        <div className="green">{store.textValues.children_vaccinated}</div>
                                    </div>
                                </Col>
                                <Col span={10} className="flex-center">
                                    <div style={{ width: '50%', textAlign: "center", display: 'flex', flexDirection: 'column' }}>
                                        <span className="big-number-cv">{store.textValues.children_vaccinated * 100 / store.textValues.target_population}%</span>
                                        <span style={{ margin: -15 }}>MR Coverage</span>
                                    </div>
                                    <Progress strokeWidth={12} showInfo={false}  type="circle" percent={store.textValues.children_vaccinated * 100 / store.textValues.target_population} width={80} style={{ width: '50%', textAlign: "center" }} />
                                </Col>
                            </Row>
                        </Card>

                        <Card style={{ marginTop: 8 }}>
                            <Tabs defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="Performance(Daily)" key="1">
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={store.vaccinated}
                                    />
                                </TabPane>
                                <TabPane tab="Performance(Sub-level)" key="2">
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={store.disaggregated}
                                    />
                                </TabPane>

                                <TabPane tab="Wastage(Daily)" key="3">
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={store.discarded}
                                    />
                                </TabPane>

                                <TabPane tab="Wastage(Sub-level)" key="4">
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={store.disaggregatedWastage}
                                    />
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card>
                            <div id="chartdiv" style={{ width: "100%", height: "250px" }}></div>
                        </Card>
                        <Card style={{ marginTop: 8}}>
                            <MapChart options={store.map} />
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col span={5} style={{ marginTop: 8 }}>
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '48px', background: '#D9EDF7', display: 'flex' }}
                >
                    <Menu.Item key="1" style={{ fontSize: 20, textAlign: 'center' }}>STOCK AND WASTAGE SUMMARY</Menu.Item>
                </Menu>
                <Card>
                    <Row gutter={8}>
                        <Col span={12}>
                            <div className="container">
                                <div style={{
                                    color: '#000066'
                                }}>ISSUED</div>
                                <div>{store.textValues.no_vaccine_vials_issued ? store.textValues.no_vaccine_vials_issued * 10 : 0}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="container">
                                <div style={{ color: '#000066' }}>RETURNED</div>
                                <div>{store.textValues.no_vaccine_vials_returned_unopened ? store.textValues.no_vaccine_vials_returned_unopened * 10 : 0}</div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                <Card style={{ marginTop: 8 }}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <div className="container">
                                <div style={{ color: '#000066' }}>DISCARDED</div>
                                <div>{store.textValues.no_vials_discarded ? store.textValues.no_vials_discarded * 10 : 0}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="container">
                                <div style={{ color: '#000066' }}>ADMINISTERED</div>
                                <div>{store.textValues.children_vaccinated}</div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                <Card style={{ marginTop: 8 }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={store.wastageGraph}
                    />

                </Card>

                <Card style={{ marginTop: 8 }}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <div className="container">
                                <div style={{
                                    color: '#000066'
                                }}>Wastage</div>
                                <div>{store.textValues.wastage ? store.textValues.wastage * 100 : 0}%</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="container">
                                <Progress type="circle" percent={store.textValues.wastage ? store.textValues.wastage * 100 : 0} width={80} />
                            </div>
                        </Col>
                    </Row>
                </Card>

                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '48px', background: '#D9EDF7', display: 'flex', marginTop: 8 }}
                >
                    <Menu.Item key="1" style={{ fontSize: 20, textAlign: 'center' }}>WORK LOAD</Menu.Item>
                </Menu>

                <Card>
                    <Row gutter={8}>
                        <Col span={12}>
                            <div className="container">
                                <div style={{
                                    color: '#000066'
                                }}>Wastage</div>
                                <div>{store.textValues.number_health_workers}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="container">
                                <div style={{
                                    color: '#000066'
                                }}>WORKLOAD</div>
                                <div>{store.textValues.workload}</div>
                            </div>
                        </Col>
                    </Row>
                </Card>

            </Col>
        </Row>
    );
}));

export default MR;
