import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import D2UIApp from "@dhis2/d2-ui-app";
import { createMuiTheme } from "@material-ui/core";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import './App.css'
import { StateRouter } from "mobx-state-tree-router";
import { Layout, Menu, Button } from 'antd';
import logo from './images/image.png'
import { width } from '@amcharts/amcharts4/.internal/core/utils/Utils';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: '#2C6693'
        }
    }
});

const { Header, Content, Footer } = Layout;
class App extends Component {
    render() {
        const { store } = this.props;
        return (<D2UIApp>
            <MuiThemeProvider theme={theme}>
                <Layout className="layout" style={{ width: '100vw', height: '100vh' }}>
                    <Header style={{ background: '#000066', display: 'flex', padding: 0 }}>
                        <div className="logo" style={{ width: 120, textAlign: 'center',height:42 }}>
                            <img src={logo} alt="Logo" height="56"/>
                        </div>
                        <Menu
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{ lineHeight: '64px', background: '#000066', display: 'flex' }}
                        >
                            <Menu.Item key="1" className="modified-item" style={{ background: '#3366FF', marginLeft: 2, width: 200, color: 'white' }}>MEASLES RUBELLA (MR)</Menu.Item>
                            <Menu.Item key="2" className="modified-item" style={{ background: '#3366FF', marginLeft: 2, width: 200, color: 'white' }}>ORAL POLIO (OPV)</Menu.Item>
                            <Menu.Item key="3" className="modified-item" style={{ background: '#3366FF', marginLeft: 2, width: 200, color: 'white' }}>QUALITY CHECKLIST</Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{paddingLeft: 10, paddingRight: 10,overflow:'auto' }}>
                        <StateRouter router={store.router} />
                    </Content>
                    <Footer style={{ textAlign: 'center', height: '24px' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </MuiThemeProvider>
        </D2UIApp>
        );
    }

}
export default inject("store")(observer(App));
