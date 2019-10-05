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
        xAxis3D: {
            type: 'value'
        },
        yAxis3D: {
            type: 'value'
        },
        zAxis3D: {
            type: 'value'
        },
        grid3D: {
            show : false,
            viewControl: {
                // projection: 'orthographic'
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
        }],
    });
    
    render() {
        return (
            <div className='map' >
                <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
                {/* <ReactEcharts option={this.Option()} style={{width:1500, height:700}} /> */}
            </div>
        );
    }
}
export default Flightpath;