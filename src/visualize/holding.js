import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './holding.css'
import * as d3 from 'd3-request';
// import url from '../data/data_28.10.62.csv';
import url from '../data/data_test.csv';
import Papa from 'papaparse'
import echarts from 'echarts'

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
    [100.7369,13.59995,0],
    [100.798,13.51101,0],
    [100.8975,13.51687,1828.8]]}
]


var centrallocat = [[100.7415433,13.6383389,23]]

class Flightpath extends React.Component {
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

    uniqueNameFlight(name,data,date){
        var count = 0
        for(var i=1;i<data.length;i++){
            if (data[i][1] === '-'){
                count += 1
                console.log(i)
            }
        }
        return count
    }

    getData(result) {
        var num = 1
        var name = result.data[1][1]
        var date = result.data[1][1]
        var count = this.uniqueNameFlight(name,result.data,date)
        console.log(count)

        for(var j=0;j<count;j++){
            //console.log(j)
            for(var i=num;i<=result.data.length;i++){
                // console.log(num)
                if(result.data[i][1] === '-'){
                    num = i+1
                    //name = result.data[i][1]
                    this.state.arr[j].coords.pop()
                    break;
                }
                this.state.arr[j].coords.push([])
                this.state.arr[j].name = result.data[i][1]
                this.state.arr[j].coords[i-num].push(result.data[i][4])
                this.state.arr[j].coords[i-num].push(result.data[i][5])
                this.state.arr[j].coords[i-num].push(result.data[i][6])
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


    async getCsvData() {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.getData
        });
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
            // {
            //     type: 'lines3D',
            //     coordinateSystem: 'maptalks3D',
            //     polyline: true,
            //     // silent: true,
            //     lineStyle: {
            //         width: 5,
            //         color: 'red',
            //         opacity: 0.3,
            //     },
            //     data: dataplane
            // },
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
    
    render() {
        // this.state.map.remove()
        return (
            <React.Fragment>
                <p>Offset Visualization</p>
                <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
            </React.Fragment>
            // <p>test</p>
        );
    }
}
export default Flightpath;