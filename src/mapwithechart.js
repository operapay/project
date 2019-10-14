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
import * as maptalksE3 from 'maptalks.e3'

var data = [[1142058.223,223372.858,-11,-13,1,-49,-26,-14]];
//var data = [[1164383,401471,-11,-13,1,-49,-26,-14]];

//Original Example of Echarts 3
//http://echarts.baidu.com/demo.html#lines-bmap-effect

var map = new maptalks.Map("map",{
    center  : [114.2058223, 22.3372858],
    zoom    : 12,
    attributionControl : {
        'content' : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    baseLayer : new maptalks.TileLayer('tile',{
        'urlTemplate' : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        'subdomains': ['a','b','c','d']
    })
});

////maptalks.Ajax.getJSON('lines-bus.json', function(err, data) {
    var hStep = 300 / (data.length - 1) + 1250;
    var busLines = [].concat.apply([], data.map(function (busLine, idx) {
        var prevPt;
        var points = [];
        for (var i = 0; i < busLine.length; i += 2) {
            var pt = [busLine[i], busLine[i + 1]];
            if (i > 0) {
                pt = [
                    prevPt[0] + pt[0],
                    prevPt[1] + pt[1]
                ];
            }
            prevPt = pt;

            points.push([pt[0] / 1e4, pt[1] / 1e4]);
        }
        return {
            'coords': points,
            'lineStyle': {
                'normal': {
                    'color': echarts.color.modifyHSL('#5A94DF', Math.round(hStep * (idx+102)))
                }
            }
        };
    }));
    var ecOption = {
        'series': [ {
            'type': 'lines',
            'polyline': true,
            'data': busLines,
            'lineStyle': {
                'normal': {
                    'width': 0
                }
            },
            'effect': {
                'constantSpeed': 20,
                'show': true,
                'trailLength': 0.8,
                'symbolSize': 1.5
            },
            'zlevel': 1
        }]
    };
    var e3Layer = new maptalksE3('e3', ecOption, { hideOnZooming : true, hideOnRotating : true, hideOnMoving : true })
    .addTo(map);
////});
    
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