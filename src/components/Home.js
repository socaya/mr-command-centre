import React from 'react';
import { inject, observer } from "mobx-react";
import { Select, Layout, Card, Col, Row, Tabs, Button, Menu, Progress } from 'antd';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official';
import gauge from 'highcharts/modules/solid-gauge';
import data from 'highcharts/modules/data';
import maps from 'highcharts/modules/map';
import MapChart from './Map';

HC_more(Highcharts);
gauge(Highcharts);
data(Highcharts)
maps(Highcharts)


const { Option } = Select;
const { Content } = Layout;
const { TabPane } = Tabs;

const Home = inject("store")(observer(({ store, d2 }) => {
    const callback = (key) => {
        console.log(key);
    }
    return (
        <div>

            <Menu
                mode="horizontal"
                style={{ lineHeight: '64px', background: 'cyan', display: 'flex' }}
            >
                <Menu.Item key="1" style={{ fontSize: 24 }}>Measles Rubella (MR) - Uganda</Menu.Item>
                <Menu.Item key="3" style={{ marginLeft: 'auto' }}> <Button type="danger" size="large" style={{ margin: 0 }}>Danger</Button></Menu.Item>
            </Menu>
            <Content style={{ background: '#FAFAFA', paddingLeft: 10, paddingRight: 10, width: '100vw', height: '100vh' }}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Select size="large" style={{ width: '100%' }} onChange={store.handleRegionChange}>
                            {store.regions.map(region => <Option key={region['Region UID']} value={JSON.stringify(region)}>{region.Region}</Option>)}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select size="large" style={{ width: '100%' }} onChange={store.handleDistrictChange}>
                            {store.districts.map(district => <Option key={district['District UID']} value={JSON.stringify(district)}>{district.District}</Option>)}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select size="large" style={{ width: '100%' }} onChange={store.handleSubCountyChange}>
                            {store.subcounties.map(subcounty => <Option key={subcounty['Subcounty UID']} value={JSON.stringify(subcounty)}>{subcounty.Subcounty}</Option>)}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={8} style={{ marginTop: 8 }}>
                    <Col span={19}>
                        <Menu
                            mode="horizontal"
                            style={{ lineHeight: '64px', background: 'cyan', display: 'flex' }}
                        >
                            <Menu.Item key="1" style={{ fontSize: 24 }}>Measles Rubella (MR) - Uganda</Menu.Item>
                            <Menu.Item key="3" style={{ marginLeft: 'auto' }}> <Button type="danger" size="large" style={{ margin: 0 }}>Danger</Button></Menu.Item>
                        </Menu>
                        <Row gutter={8}>
                            <Col span={14}>
                                <Card>
                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <div className="container">
                                                <div style={{
                                                    color: '#000066'
                                                }}>POSTS</div>
                                                <div>3200</div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="container">
                                                <div style={{ color: '#000066' }}>REPORTED</div>
                                                <div>3200</div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="container">
                                                <Progress type="dashboard" percent={75} width={80} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card style={{ marginTop: 8 }}>
                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <div className="container">
                                                <div style={{
                                                    color: '#000066'
                                                }}>MR TARGETS</div>
                                                <div>{store.textValues.target_population}</div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="container">
                                                <div style={{ color: '#000066' }}>MR GIVEN</div>
                                                <div>{store.textValues.children_vaccinated}</div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="container">
                                                <Progress type="circle" percent={store.textValues.children_vaccinated * 100 / store.textValues.target_population} width={80} />
                                            </div>
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
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={store.usage}
                                    />
                                </Card>
                                <Card>
                                    <MapChart options={store.map} />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={5}>
                        <Menu
                            mode="horizontal"
                            style={{ lineHeight: '64px', background: 'cyan', display: 'flex' }}
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
                            style={{ lineHeight: '64px', background: 'cyan', display: 'flex', marginTop: 8 }}
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
            </Content>
        </div>
    );
}));

export default Home;
