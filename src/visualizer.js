import React, { Component } from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './visualizer.css'
import * as d3 from 'd3-request';
import url from './data/data_flight.csv';
import Papa from 'papaparse'

class Flightpath extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataAll : [{name:'', coords: [['', '', '']]}],
            data: [],
            arr: [{
                name:'',
                coords: [[]]
            }]
        };

        this.getData = this.getData.bind(this);
        this.test = this.test.bind(this)
    }

    componentWillMount() {
        this.getCsvData();
    }

    fetchCsv() {
        return fetch(url).then(function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');

            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
    }

    getData(result) {
        this.setState({data: result.data});
        this.test()
        this.setState({dataAll: this.state.arr});
    }

    test(){
        //console.log(this.state.data)
        for(var i=1;i<101;i++){
            this.state.arr[0].name = this.state.data[1][1]
            this.state.arr[0].coords[i-1].push(this.state.data[i][3])
            this.state.arr[0].coords[i-1].push(this.state.data[i][4])
            this.state.arr[0].coords[i-1].push(this.state.data[i][5])
            if(i < 100){
                this.state.arr[0].coords.push([])
            }
        }
        //console.log(this.state.arr)
    }

    async getCsvData() {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.getData
        });
    }
    getOption = () => ({
        maptalks3D: {
            // center: [-0.4855, 51.4727],
            center: [100.5367883,13.717152], //mahamek
            zoom: 12,
            pitch: 80,
            draggable : false,        //disable drag
            dragPan : false,          //disable drag panning
            dragRotate : false,       //disable drag rotation
            dragPitch : false,        //disable drag pitch
            scrollWheelZoom : false,  //disable wheel zoom
            touchZoom : false,        //disable touchzoom
            doubleClickZoom : false,  //disable doubleclick zoom
            zoomAnimation: false,
            //altitudeScale: 5,
            baseLayer: new maptalks.TileLayer('base', {
                urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                subdomains: ['a','b','c','d'],
                attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            }),
            postEffect: {
                enable: true,
                bloom: {
                    intensity: 0.4
                }
            }
        },
        series: [
            {
            type: 'lines3D',
            coordinateSystem: 'maptalks3D',
            effect: {
                show: true,
                constantSpeed: 40,
                trailWidth: 2,
                trailLength: 0.15,
                trailOpacity: 1
            },
            //blendMode: 'lighter',
            polyline: true,
            lineStyle: {
                width: 2,
                color: 'rgb(50, 60, 170)',
                opacity: 0.5
            },
            data: this.state.dataAll
        }
        // {
        //     type: 'surface',
        //     //coordinateSystem: 'maptalks3D',
        //     wireframe: {
        //         show: false
        //     },
        //     equation: {
        //         x: {
        //             step: 0.05
        //         },
        //         y: {
        //             step: 0.05
        //         },
        //         z: function (x, y) {
        //             if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
        //                 return '-';
        //             }
        //             return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
        //         }
        //     }
        // }],
        ]
    });
    
    render() {
        return (
            <div className='map' >
                <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
            </div>
        );
    }
}
export default Flightpath;