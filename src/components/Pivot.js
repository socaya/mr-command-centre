import React from 'react';
import { inject, observer } from "mobx-react";
// import { Select } from 'antd';
// import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts';
// const { Option } = Select;
import * as WebDataRocksReact from './webdatarocks';
const Pivot = inject("store")(observer(({ store, d2 }) => {
    return (
        <WebDataRocksReact.Pivot toolbar={true} report="https://cdn.webdatarocks.com/reports/report.json" />
    );
}));

export default Pivot;


