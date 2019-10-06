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
import data from './data/flight.json'

function getAirportCoord(idx) {
    return [data.airports[idx][3], data.airports[idx][4]];
}
var routes = data.routes.map(function(airline) {
    return [
        getAirportCoord(airline[1]),
        getAirportCoord(airline[2])
    ];
});

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
    // postEffect: {
    //     enable: true,
    //     bloom: {
    //         intensity: 0.4
    //     }
    // }
}

class Flightpath extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataAll : [{name:'', coords: [['', '', '']]}],
            data: [{name:'aaa', coords:[["100.759529", "13.692165", "0"],
            ["100.759804", "13.69202", "0"],
            ["100.759804", "13.69202", "0"],
            ["100.760376", "13.69186", "0"],
            ["100.760818", "13.691106", "0"],
            ["100.757057", "13.676116", "144.78"]]}],
            arr: [{
                name:'',
                coords: [[]]
            }],
        };

        this.getData = this.getData.bind(this);
        // this.renderItem = this.renderItem.bind(this)
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
        var num = 1
        var name = result.data[1][1]
        // for(var j=0;j<2;j++){
        //     //console.log(j)
        //     for(var i=num;i<538;i++){
        //         console.log(num)
        //         this.state.arr[j].name = result.data[i][1]
        //         this.state.arr[j].coords[i-num-1].push(result.data[i][3])
        //         this.state.arr[j].coords[i-num-1].push(result.data[i][4])
        //         this.state.arr[j].coords[i-num-1].push(result.data[i][5])
        //         if(name ===  result.data[i][1]){
        //             this.state.arr[0].coords.push([])
        //         }
        //         else{
        //             num = i
        //             break;
        //         }
        //         name = result.data[i][1]
        //     }
        //     this.state.arr.push({name:'', coords: [[]]})
        // }
        // console.log(result.data)
        // this.setState({test: result.data});
        console.log(this.state.arr)
        //this.test()
        this.setState({dataAll: this.state.arr});
    }

    // test(){
    //     // console.log(this.state.data.length)
    //     // while(true){
    //     //     if(this.state.data.length !== 0){
    //     //         break;
    //     //     }
    //     // }
    //     for(var i=1;i<101;i++){
    //         this.state.arr[0].name = this.state.data[1][1]
    //         this.state.arr[0].coords[i-1].push(this.state.data[i][3])
    //         this.state.arr[0].coords[i-1].push(this.state.data[i][4])
    //         this.state.arr[0].coords[i-1].push(this.state.data[i][5])
    //         if(i < 100){
    //             this.state.arr[0].coords.push([])
    //         }
    //     }
    //     //console.log(this.state.arr)
    // }

    async getCsvData() {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.getData
        });
    }
    
    getOption = () => ({
        maptalks3D: map, 
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
            data: routes
        }],
    });
    
    render() {
        // this.state.map.remove()
        return (
            <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
        );
    }
}
export default Flightpath;