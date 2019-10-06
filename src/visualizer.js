import React, { Component } from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './visualizer.css'
import * as d3 from 'd3-request';
import url from './data/data_flight.csv';
import Papa from 'papaparse'
import echarts from 'echarts'
//import data from './data/population.json'

var map = {
    center: [100.5367883,13.717152], //mahamek
    zoom: 12,
    // pitch: 80,
    // draggable : false,        //disable drag
    // dragPan : false,          //disable drag panning
    // dragRotate : false,       //disable drag rotation
    // dragPitch : false,        //disable drag pitch
    // scrollWheelZoom : false,  //disable wheel zoom
    // touchZoom : false,        //disable touchzoom
    // doubleClickZoom : false,  //disable doubleclick zoom
    // zoomAnimation: false,
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
    },
}

var data = [[100.7415433,13.6383389,400]]
class Flightpath extends Component {
    // data = data.filter(function (dataItem) {
    //     return dataItem[2] > 0;
    // }).map(function (dataItem) {
    //     return [dataItem[0], dataItem[1], Math.sqrt(dataItem[2])];
    // });
    
    getOption = () => ({
        
        // visualMap: {
        //     max: 40,
        //     calculable: true,
        //     realtime: false,
        //     inRange: {
        //         color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        //     },
        //     outOfRange: {
        //         colorAlpha: 0
        //     }
        // },
        maptalks3D : map,
        series: [{
            type: 'bar3D',
            coordinateSystem: 'maptalks3D',
            shading: 'lambert',
            data: data,
            barSize: 1.2,
            minHeight: 0.2,
            silent: true,
            itemStyle: {
                color: 'orange'
                // opacity: 0.8
            }
        }]
    });
    
    render() {
        // this.state.map.remove()
        return (
            <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
        );
    }
}
export default Flightpath;