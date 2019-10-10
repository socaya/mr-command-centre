import { types, flow } from "mobx-state-tree";
import { RouterStore } from "mobx-state-tree-router";
import socketClient from 'socket.io-client';
import axios from 'axios';
import { isEmpty } from 'lodash';
import Highcharts from 'highcharts';
import mapData from './mapData';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
const socket = socketClient('http://127.0.0.1:3001');

export const Store = types
    .model("Store", {
        data: types.optional(types.array(types.frozen()), []),
        daily: types.optional(types.array(types.frozen()), []),
        regions: types.optional(types.array(types.frozen()), []),
        districts: types.optional(types.array(types.frozen()), []),
        subcounties: types.optional(types.array(types.frozen()), []),
        summary: types.optional(types.array(types.frozen()), []),
        single: types.optional(types.frozen(), {}),
        currentSearch: types.frozen(),
        currentValue: types.frozen(),
        mapData: types.frozen(),
        router: RouterStore,
        d2: types.frozen()
    }).views(self => ({
        get currentUrl() {
            if (self.currentSearch && self.currentValue) {
                return `http://localhost:3001/?type=${self.currentSearch}&search=${self.currentValue}`
            }
            return 'http://localhost:3001';
        }
    })).actions(self => {
        const fetchData = flow(function* () {
            try {
                const { data: { aggregations: { data: { buckets }, overall: { buckets: daily }, single, summary: { buckets: summary } } } } = yield axios.get(self.currentUrl);
                self.data = buckets;
                self.daily = daily
                self.summary = summary
                self.single = single
                self.state = "done"
            } catch (error) {
                console.log(error)
            }
        })

        return { fetchData }
    }).actions(self => {
        const fetchRegions = flow(function* () {
            self.state = "pending"
            try {
                const { data } = yield axios.get('http://localhost:3001/regions');
                self.regions = data;
                self.state = "done"
            } catch (error) {
                self.state = "error"
            }
        });

        const fetchMap = flow(function* () {
            self.state = "pending"
            try {
                const { data } = yield axios.get('http://localhost:3001/uganda');
                self.mapData = data;
                self.state = "done"
            } catch (error) {
                self.state = "error"
            }
        });

        const fetchDistricts = flow(function* (region) {
            self.state = "pending"
            try {
                const { data } = yield axios.get(`http://localhost:3001/districts?search=${region}`);
                self.districts = data;
                self.state = "done"
            } catch (error) {
                self.state = "error"
            }
        });

        const fetchSubCounties = flow(function* (district) {
            self.state = "pending"
            try {
                const { data } = yield axios.get(`http://localhost:3001/subcounties?search=${district}`);
                self.subcounties = data;
                self.state = "done"
            } catch (error) {
                self.state = "error"
            }
        })

        return {
            fetchRegions,
            fetchDistricts,
            fetchSubCounties,
            fetchMap
        }

    }).actions(self => ({
        handleRegionChange(val) {
            val = JSON.parse(val)
            self.currentValue = val.Region.split(' ').join('_');
            self.currentSearch = 'regions';
            self.fetchDistricts(val['Region UID']);
            self.fetchData();
        },
        handleDistrictChange(val) {
            val = JSON.parse(val)
            self.currentValue = val.District.split(' ').join('_');
            self.currentSearch = 'districts'
            self.fetchSubCounties(val['District UID']);
            self.fetchData();
        },
        handleSubCountyChange(val) {
            val = JSON.parse(val)
            self.currentValue = val.Subcounty.split(' ').join('_');
            self.currentSearch = 'subcounties';
            self.fetchData();
        }
    })).actions(self => ({
        afterCreate() {
            socket.on("data", () => self.fetchData());
            self.fetchRegions();
            self.fetchData();
            self.fetchMap();
        }
    })).views(self => ({
        get vaccinated() {

            let vaccinated = self.daily.map(d => {
                return {
                    y: d['children_vaccinated']['value'],
                    name: d.key

                }
            });

            let target = self.daily.map(d => {
                return {
                    y: d['target_population']['value'],
                    name: d.key

                }
            });

            let wastage = self.daily.map(d => {
                return {
                    y: d['no_vials_discarded']['value'],
                    name: d.key

                }
            });
            return {
                chart: {
                    type: 'column',
                    height:'60%'
                },
                xAxis: {
                    type: 'category'
                },

                legend: {
                    enabled: true
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: 'Vaccinated',
                    data: vaccinated
                }, {
                    name: 'Target',
                    data: target
                }, {
                    name: 'Wastage',
                    data: wastage
                }]
            }
        },
        get disaggregated() {
            let vaccinated = self.summary.map(d => {
                return {
                    y: d['children_vaccinated']['value'],
                    name: d.key
                }
            });

            let target = self.summary.map(d => {
                return {
                    y: d['target_population']['value'],
                    name: d.key

                }
            });


            return {
                chart: {
                    type: 'column',
                    height:'60%'
                },
                xAxis: {
                    type: 'category'
                },

                legend: {
                    enabled: true
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: 'Vaccinated',
                    data: vaccinated
                }, {
                    name: 'Target',
                    data: target
                }]
            }
        },
        get disaggregatedWastage() {


            let contamination = self.summary.map(d => {
                return {
                    y: d['no_vials_discarded_due_contamination']['value'],
                    name: d.key
                }
            });

            let partial = self.summary.map(d => {
                return {
                    y: d['no_vials_discarded_due_partial_use']['value'],
                    name: d.key
                }
            });

            let changed = self.summary.map(d => {
                return {
                    y: d['no_vials_discarded_due_vvm_color_change']['value'],
                    name: d.key
                }
            });

            let unopen = self.summary.map(d => {

                return {
                    y: d['no_vaccine_vials_returned_unopened']['value'],
                    name: d.key
                }
            });


            return {
                chart: {
                    type: 'column',
                    height:'60%'
                },
                xAxis: {
                    type: 'category',
                    height:'60%'
                },

                legend: {
                    enabled: true
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: 'Contaminated',
                    data: contamination
                }, {
                    name: 'Partially Used',
                    data: partial
                }, {
                    name: 'Changed Color',
                    data: changed
                }, {
                    name: 'Returned',
                    data: unopen
                }]
            }
        },
        get discarded() {

            let contamination = self.daily.map(d => {
                return {
                    y: d['no_vials_discarded_due_contamination']['value'],
                    name: d.key
                }
            });

            let partial = self.daily.map(d => {
                return {
                    y: d['no_vials_discarded_due_partial_use']['value'],
                    name: d.key
                }
            });

            let changed = self.daily.map(d => {
                return {
                    y: d['no_vials_discarded_due_vvm_color_change']['value'],
                    name: d.key
                }
            });

            let unopen = self.daily.map(d => {
                return {
                    y: d['no_vaccine_vials_returned_unopened']['value'],
                    name: d.key
                }
            });


            return {
                chart: {
                    type: 'column',
                    height:'60%'
                },
                xAxis: {
                    type: 'category'
                },

                legend: {
                    enabled: true
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    }
                },

                series: [{
                    name: 'Contaminated',
                    data: contamination
                }, {
                    name: 'Partially Used',
                    data: partial
                }, {
                    name: 'Changed Color',
                    data: changed
                }, {
                    name: 'Returned',
                    data: unopen
                }]
            }
        },
        get usage() {

            var gaugeOptions = {

                chart: {
                    type: 'solidgauge'
                },

                title: null,

                pane: {
                    center: ['50%', '85%'],
                    size: '140%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },

                tooltip: {
                    enabled: false
                },

                // the value axis
                yAxis: {
                    min: 0,
                    max: self.textValues.target_population,
                    stops: [
                        [0.1, '#55BF3B'], // green
                        [0.5, '#DDDF0D'], // yellow
                        [0.9, '#DF5353'] // red
                    ],
                    lineWidth: 0,
                    minorTickInterval: null,
                    tickAmount: 2,
                    title: {
                        y: -70
                    },
                    labels: {
                        y: 16
                    }
                },

                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: 5,
                            borderWidth: 0,
                            useHTML: true
                        }
                    }
                }
            };

            // The speed gauge
            return Highcharts.merge(gaugeOptions, {
                yAxis: {
                    min: 0,
                    max: self.textValues.target_population,
                    title: {
                        text: 'Speed'
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Speed',
                    data: [self.textValues.target_population],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                            '<span style="font-size:12px;color:silver">km/h</span></div>'
                    },
                    tooltip: {
                        valueSuffix: ' km/h'
                    }
                }]
            });
        },
        get textValues() {
            if (!isEmpty(self.single)) {
                const expected = (self.single['no_vaccine_vials_issued']['value'] - self.single['no_vaccine_vials_returned_unopened']['value']) * 10;
                const vaccinated = self.single['children_vaccinated']['value'];
                let wastage = (expected - vaccinated) / expected
                let dosage = vaccinated / expected
                wastage = wastage.toFixed(2);
                dosage = dosage.toFixed(2)
                const obj = Object.assign({}, ...Object.keys(self.single).map(k => ({ [k]: self.single[k].value })));
                let workload = vaccinated / self.single['number_health_workers']['value']
                return { ...obj, wastage, dosage, workload: workload.toFixed(1) }
            }
            return {};
        },

        get wastageGraph() {
            return {
                chart: {
                    type: 'bar',
                    height: '300px'
                },
                xAxis: {
                    categories: [
                        'Partial Use',
                        'Contamination',
                        'VVM Color Change',
                        'Other Factors'
                    ],
                },
                series: [{

                    name: 'Wastage',
                    data: [
                        self.textValues.no_vials_discarded_due_partial_use,
                        self.textValues.no_vials_discarded_due_contamination,
                        self.textValues.no_vials_discarded_due_vvm_color_change,
                        self.textValues.no_vials_discarded_other_factors
                    ]
                }]
            }
        },
        get map() {
            return {
                title: {
                    text: ''
                },
                colorAxis: {
                    min: 0
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                series: [{
                    mapData: mapData,
                    // dataLabels: {
                    //     formatter: function () {
                    //         return this.point.properties['woe-label'].split(',')[0];
                    //     }
                    // },
                    name: 'Uganda',
                    data: [
                        ['ug-2595', 0],
                        ['ug-7073', 1],
                        ['ug-7074', 2],
                        ['ug-7075', 3],
                        ['ug-2785', 4],
                        ['ug-2791', 5],
                        ['ug-3385', 6],
                        ['ug-3388', 100],
                        ['ug-2786', 8],
                        ['ug-7056', 9],
                        ['ug-7083', 10],
                        ['ug-7084', 11],
                        ['ug-7058', 12],
                        ['ug-1678', 13],
                        ['ug-1682', 14],
                        ['ug-1683', 15],
                        ['ug-1685', 16],
                        ['ug-7051', 17],
                        ['ug-2762', 18],
                        ['ug-2767', 19],
                        ['ug-2777', 20],
                        ['ug-2778', 21],
                        ['ug-2780', 22],
                        ['ug-2781', 23],
                        ['ug-2782', 24],
                        ['ug-2783', 25],
                        ['ug-2779', 26],
                        ['ug-2784', 27],
                        ['ug-3382', 28],
                        ['ug-3384', 29],
                        ['ug-3389', 30],
                        ['ug-3383', 31],
                        ['ug-3390', 32],
                        ['ug-3386', 33],
                        ['ug-3391', 34],
                        ['ug-3392', 35],
                        ['ug-3394', 36],
                        ['ug-2750', 37],
                        ['ug-7048', 38],
                        ['ug-7080', 39],
                        ['ug-7081', 40],
                        ['ug-1684', 41],
                        ['ug-7082', 42],
                        ['ug-1688', 43],
                        ['ug-7079', 44],
                        ['ug-7068', 45],
                        ['ug-7070', 46],
                        ['ug-7049', 47],
                        ['ug-2787', 48],
                        ['ug-7055', 49],
                        ['ug-2769', 50],
                        ['ug-7052', 51],
                        ['ug-2774', 52],
                        ['ug-7059', 53],
                        ['ug-7060', 54],
                        ['ug-7057', 55],
                        ['ug-2790', 56],
                        ['ug-2776', 57],
                        ['ug-7067', 58],
                        ['ug-7065', 59],
                        ['ug-7066', 60],
                        ['ug-7069', 61],
                        ['ug-7061', 62],
                        ['ug-7063', 63],
                        ['ug-7062', 64],
                        ['ug-7064', 65],
                        ['ug-7086', 66],
                        ['ug-2744', 67],
                        ['ug-1679', 68],
                        ['ug-1680', 69],
                        ['ug-7054', 70],
                        ['ug-1686', 71],
                        ['ug-7078', 72],
                        ['ug-1677', 73],
                        ['ug-1690', 74],
                        ['ug-2745', 75],
                        ['ug-2752', 76],
                        ['ug-2754', 77],
                        ['ug-1687', 78],
                        ['ug-2757', 79],
                        ['ug-1689', 80],
                        ['ug-2760', 81],
                        ['ug-2761', 82],
                        ['ug-2766', 83],
                        ['ug-2765', 84],
                        ['ug-2764', 85],
                        ['ug-2749', 86],
                        ['ug-2768', 87],
                        ['ug-2763', 88],
                        ['ug-2748', 89],
                        ['ug-2771', 90],
                        ['ug-2772', 91],
                        ['ug-2775', 92],
                        ['ug-2788', 93],
                        ['ug-2789', 94],
                        ['ug-3381', 95],
                        ['ug-3387', 96],
                        ['ug-3393', 97],
                        ['ug-7076', 98],
                        ['ug-1681', 99],
                        ['ug-2746', 100],
                        ['ug-2747', 101],
                        ['ug-2751', 102],
                        ['ug-2758', 103],
                        ['ug-2759', 104],
                        ['ug-2756', 105],
                        ['ug-2770', 106],
                        ['ug-7072', 107],
                        ['ug-7053', 108],
                        ['ug-2753', 109],
                        ['ug-2755', 110],
                        ['ug-2773', 1000]]
                }]
            }
        },
        get amChart() {
            let chart = am4core.create("chartdiv", am4charts.GaugeChart);
            chart.innerRadius = am4core.percent(82);
            var axis = chart.xAxes.push(new am4charts.ValueAxis());
            axis.min = 0;
            axis.max = 100;
            axis.strictMinMax = true;
            axis.renderer.radius = am4core.percent(80);
            axis.renderer.inside = true;
            axis.renderer.line.strokeOpacity = 1;
            axis.renderer.ticks.template.strokeOpacity = 1;
            axis.renderer.ticks.template.length = 10;
            axis.renderer.grid.template.disabled = true;
            axis.renderer.labels.template.radius = 40;
            axis.renderer.labels.template.adapter.add("text", function (text) {
                return text + "%";
            })


            var colorSet = new am4core.ColorSet();

            var axis2 = chart.xAxes.push(new am4charts.ValueAxis());
            axis2.min = 0;
            axis2.max = 100;
            axis2.renderer.innerRadius = 10
            axis2.strictMinMax = true;
            axis2.renderer.labels.template.disabled = true;
            axis2.renderer.ticks.template.disabled = true;
            axis2.renderer.grid.template.disabled = true;

            var range0 = axis2.axisRanges.create();
            range0.value = 0;
            range0.endValue = 50;
            range0.axisFill.fillOpacity = 1;
            range0.axisFill.fill = colorSet.getIndex(0);

            var range1 = axis2.axisRanges.create();
            range1.value = 50;
            range1.endValue = 100;
            range1.axisFill.fillOpacity = 1;
            range1.axisFill.fill = colorSet.getIndex(2);

            /**
             * Label
             */

            var label = chart.radarContainer.createChild(am4core.Label);
            label.isMeasured = false;
            label.fontSize = 45;
            label.x = am4core.percent(50);
            label.y = am4core.percent(100);
            label.horizontalCenter = "middle";
            label.verticalCenter = "bottom";
            label.text = "50%";


            /**
             * Hand
             */

            var hand = chart.hands.push(new am4charts.ClockHand());
            hand.axis = axis2;
            hand.innerRadius = am4core.percent(20);
            hand.startWidth = 10;
            hand.pin.disabled = true;
            hand.value = 50;

            hand.events.on("propertychanged", function (ev) {
                range0.endValue = ev.target.value;
                range1.value = ev.target.value;
                axis2.invalidate();
            });

            var value = self.textValues.children_vaccinated * 100 / self.textValues.target_population;
            label.text = value + "%";
            new am4core.Animation(hand, {
                property: "value",
                to: value
            }).start();

            // setInterval(() => {

            // }, 2000);
            return ''
        }
    }));

