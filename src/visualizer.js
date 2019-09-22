import React, { Component } from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './visualizer.css'
import * as d3 from 'd3-request';
import url from './data/data_flight.csv';

var a = [
['100.758698', '13.656518', '472.44'],
['100.764381', '13.654377', '495.3'],
['100.769302', '13.653166', '518.16'],
['100.777298', '13.651397', '571.5'],
['100.786301', '13.64946', '617.22'],
['100.794395', '13.647675', '693.42'],
['100.799324', '13.646576', '739.14'],
['100.807846', '13.644562', '800.1'],
['100.818207', '13.642087', '883.92'],
['100.827271', '13.640038', '960.12'],
['100.844833', '13.636093', '1082.04'],
['100.850845', '13.63472', '1127.76']]

var dataAll = [{name:'PG203/BKP203', coords: [['100.759529', '13.692165', '0'],
['100.759804', '13.69202', '0'],
['100.759804', '13.69202', '0'],
['100.760376', '13.69186', '0'],
['100.760818', '13.691106', '0'],
['100.757057', '13.676116', '144.78'],
['100.755806', '13.670484', '259.08'],
['100.754715', '13.664566', '365.76'],
['100.75547', '13.660242', '441.96']]}]

var dataset;
d3.csv(url, function(error, data) {
    dataset = data
    return dataset
});

console.log(dataset)
    // dataAll[0].name = data[0].name
    // for(var i=0;i<21;i++){
    //     dataAll[0].coords[i][0] = a[i][0]
    //     dataAll[0].coords[i][1] = a[i][1]
    //     dataAll[0].coords[i][2] = a[i][2]
    //     // dataAll[0].coords[i].push(data[i].long)
    //     // dataAll[0].coords[i].push(data[i].lat)
    //     // dataAll[0].coords[i].push(data[i].attitude)
    // }

// var dataAll = [{name:'PG203/BKP203', coords: [['100.759529', '13.692165', '0'],
// ['100.759804', '13.69202', '0'],
// ['100.759804', '13.69202', '0'],
// ['100.760376', '13.69186', '0'],
// ['100.760818', '13.691106', '0'],
// ['100.757057', '13.676116', '144.78'],
// ['100.755806', '13.670484', '259.08'],
// ['100.754715', '13.664566', '365.76'],
// ['100.75547', '13.660242', '441.96'],
// ['100.758698', '13.656518', '472.44'],
// ['100.764381', '13.654377', '495.3'],
// ['100.769302', '13.653166', '518.16'],
// ['100.777298', '13.651397', '571.5'],
// ['100.786301', '13.64946', '617.22'],
// ['100.794395', '13.647675', '693.42'],
// ['100.799324', '13.646576', '739.14'],
// ['100.807846', '13.644562', '800.1'],
// ['100.818207', '13.642087', '883.92'],
// ['100.827271', '13.640038', '960.12'],
// ['100.844833', '13.636093', '1082.04'],
// ['100.850845', '13.63472', '1127.76']]}]

class Flightpath extends Component {
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
        series: [{
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
            data: dataAll
        }]
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