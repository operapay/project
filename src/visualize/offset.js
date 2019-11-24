import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './offset.css'
import * as d3 from 'd3-request';
// import url from '../data/data_flight.csv';
//import url from '../data/data_arrival.csv';
import Papa from 'papaparse'
import echarts from 'echarts'
import { Select } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

var map = {
    center: [100.7395539,13.6983666], //mahamek
    zoom: 12,
    pitch: 100,
    altitudeScale: 3.28,
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    }),
}

var dataplane = [
    // {name:'MP19R-RYAUN', coords: [[100.7432,13.70367,0],
    // [100.7694,13.80349,609.6],
    // [100.7858,13.86579,762],
    // [100.8056,13.94083,1066.8]]},
    {name:'LOUIS-BS902', coords: [[100.7518,13.6567,0],
    [100.7369,13.59995,10],
    [100.798,13.51101,10],
    [100.8975,13.51687,1828.8]]}
]


var centrallocat = [[100.7415433,13.6383389,23]]

class FileReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // csvfile: undefined,
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
        this.test = props.data
        this.check = props.check

        this.getData = this.getData.bind(this);
    }
  

    componentWillMount(){
        if(this.check === true){
            this.getData(this.test)
        }
        // console.log('mount')
        // console.log(this.check)
        // console.log(this.test)
    }

    componentWillUpdate(nextPorps){
        if(nextPorps.check != this.check && nextPorps.test != this.test){
            console.log(this.check , 'next ', nextPorps.check )
            if(this.check === true){
                this.getData(nextPorps.test)
            }
        }
        // console.log('willl')
    }

    uniqueNameFlight(name,data,date){
        var count = 0
        console.log(data.length)
        for(var i=1;i<data.length;i++){
            if (data[i].name === '-'){
                count += 1
                // console.log(i)
            }
        }
        return count
    }

    getData(result) {
        this.state.arr = [{
            name:'',
            coords: [[]]
        }]
        var num = 0
        var name = result[0].name
        var date = result[0].name
        var count = this.uniqueNameFlight(name,result,date)
        console.log(count)

        for(var j=0;j<count;j++){
            //console.log(j)
            for(var i=num;i<=result.length;i++){
                // console.log(num)
                if(result[i].name === '-'){
                    num = i+1
                    //name = result.data[i][1]
                    this.state.arr[j].coords.pop()
                    break;
                }
                this.state.arr[j].coords.push([])
                this.state.arr[j].name = result[i].name
                this.state.arr[j].coords[i-num].push(result[i].long)
                this.state.arr[j].coords[i-num].push(result[i].lat)
                this.state.arr[j].coords[i-num].push(result[i].attitude)
            }
            // console.log(j)
            if(j < count-1){
                this.state.arr.push({name:'', coords: [[]]})
            }
        }
        //console.log(result.data)
        // this.setState({test: result.data});
        console.log(this.state.arr)
        //this.test()
        this.setState({dataAll: this.state.arr});
    }

    getOption = () => ({
        maptalks3D: map, 
        series: [
            // {
            //     type: 'lines3D',
            //     coordinateSystem: 'maptalks3D',
            //     polyline: true,
            //     // silent: true,
            //     lineStyle: {
            //         width: 50,
            //         color: 'red',
            //         opacity: 0.3,
            //     },
            //     data: dataplane
            // },
            {
                type: 'lines3D',
                coordinateSystem: 'maptalks3D',
                polyline: true,
                // silent: true,
                lineStyle: {
                    width: 5,
                    color: 'red',
                    opacity: 0.7,
                },
                data: dataplane
            },
            {
                type: 'bar3D',
                coordinateSystem: 'maptalks3D',
                shading: 'lambert',
                data: centrallocat,
                barSize: 1.2,
                minHeight: 0.2,
                silent: true,
                itemStyle: {
                    color: 'orange'
                    // opacity: 0.8
                }
            },
            {
                type: 'lines3D',
                coordinateSystem: 'maptalks3D',
                effect: {
                    show: true,
                    constantSpeed: 40,
                    trailWidth: 2,
                    trailLength: 0.05,
                    trailOpacity: 1,
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
        ],
    });
  
    render(props) {
    //   console.log(this.test);
      return (
        <div className="App">
            <h1>Offset Visualization</h1>
            <ReactEcharts option={this.getOption()} style={{width:1600, height:600}} />
        </div>
      );
    }
  }

  FileReader.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool
  };
  
  
  export default FileReader;