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
import * as E3Layer from 'maptalks.e3'

var data = [[1142058.223,223372.858,-11,-13,1,-49,-26,-14]];
//var data = [[1164383,401471,-11,-13,1,-49,-26,-14]];

//Original Example of Echarts 3
//http://echarts.baidu.com/demo.html#lines-bmap-effect

var map = new maptalks.Map("map",{
    center  : [100.7395539,13.6983666],
    zoom    : 15,
    attributionControl : {
        'content' : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    baseLayer : new maptalks.TileLayer('tile',{
        'urlTemplate' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'subdomains': ['a','b','c','d']
    })
});

var plane = new maptalks.LineString([
    [100.7395539,13.6983666],
    [100.7155539,13.6933666],
    [100.7155539,13.7033666],
    [100.7395539,13.6983666]
  ], {
    properties : {
      'altitude' : [0, 600, 600,0] //seperate altitude for each vertex
    },
    symbol: {
      'lineColor' : 'red',
      'lineWidth' : 3,
    }
});

var shadow = new maptalks.Polygon([
    [-0.131049, 51.498568],
    [-0.107049, 51.503568],
    [-0.107049, 51.493568]
  ], {
    properties : {
      'altitude' : [100] 
    },
    symbol: {
        lineColor: '#34495e',
        lineWidth: 2,
        polygonFill: '#34495e',
        polygonOpacity: 0.4
    }
});


new maptalks.VectorLayer('vector',[plane,shadow],{ enableAltitude : true})
        .addTo(map);

class Flightpath extends Component {
    
    
    render() {
        // this.state.map.remove()
        return (
            <p>test</p>
            // <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
        );
    }
}
export default Flightpath;