import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './offset.css'
import { Select,Checkbox } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const { Option } = Select;

var map = {
    center: [100.7395539,13.6983666], //mahamek
    zoom: 9,
    // pitch: 100,
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

var R = [[100.743178,13.703669,0]]

var centrallocat = [[100.7415433,13.6383389,23]]

class FileReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            checkedList: [],
            list: [],
            scatter: []
        };
        this.flight = props.data
        this.check = props.name
        this.what = props.what

        this.getData = this.getData.bind(this);
    }

    componentWillMount(){
        if(this.what === "Flight no"){
            this.getData(this.flight)
        }

    }

    onhandleChange(value,data) {
        // console.log(`selected ${value}`);
        var data_select = []
        var data_scatter = []
        // console.log(value)
        this.setState({checkedList : value})
        for(var j=0;j<value.length;j++){
            for(var i=0;i<data.length;i++){
                if(data[i].name === value[j]){
                    var state = Math.floor((data[i].coords.length)/2)
                    //console.log(state)
                    data_select.push(data[i])
                    data_scatter.push([data[i].coords[state][0],data[i].coords[state][1],data[i].coords[state][2],data[i].name])
                    // console.log(data[i])
                }
            }
        }
        // console.log(data_select)
        this.setState({data : data_select,scatter:data_scatter})
    }

    getData(result){
        this.setState({data : result})
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
            //         opacity: 0.7,
            //     },
            //     data: dataplane
            // },
            // {
            //     type: 'bar3D',
            //     coordinateSystem: 'maptalks3D',
            //     shading: 'lambert',
            //     data: centrallocat,
            //     barSize: 1.2,
            //     minHeight: 0.2,
            //     silent: true,
            //     itemStyle: {
            //         color: 'orange'
            //         // opacity: 0.8
            //     }
            // },
            // {
            //     type: 'scatter3D',
            //     coordinateSystem: 'maptalks3D',
            //     itemStyle: {
            //         color: 'rgb(50, 50, 150)',
            //         opacity: 1
            //     },
            //     data: R,
            //     symbolSize: 10,
            // },
            {
                type: 'scatter3D',
                coordinateSystem: 'maptalks3D',
                itemStyle: {
                    color: 'rgb(50, 50, 150)',
                    opacity: 1
                },
                data: this.state.scatter,
                symbolSize: 1,
                label: {
                    show: true,
                    formatter: function (data) {
                        return data[3];
                    },
                    position: 'insideTop'
                },
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
                // label: {
                //     show: true,
                //     formatter: function (data) {
                //         return data.name;
                //     },
                //     position: 'insideTop'
                // },
                //blendMode: 'lighter',
                polyline: true,
                lineStyle: {
                    width: 2,
                    color: 'rgb(50, 60, 170)',
                    opacity: 0.5
                },
                data: this.state.data 
            }
        ],
    });
  
    render(props) {
    //   console.log(this.flight);
      return (
        <div>
            {this.what === "Date" ?
            <Select
                mode="multiple"
                style={{ width: '50%',marginBottom:'2%' }}
                placeholder="Please select flight"
                value={this.state.checkedList}
                // defaultValue={['a10', 'c12']}
                onChange={e => this.onhandleChange(e,this.flight)}
                //options={this.check}
            >
                {this.check.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select>
            :
                null
            }
            {/* <Checkbox.Group options={this.check}  value={this.state.checkedList} onChange={e => this.onhandleChange(e,this.flight)}/> */}
            <ReactEcharts option={this.getOption()} style={{width:'100%', height:700, border:'1px solid lightgray'}} />
        </div>
      );
    }
  }

  FileReader.propTypes = {
    data: PropTypes.array,
    name: PropTypes.array,
    what: PropTypes.string
    // check_data: PropTypes.bool
  };
  
  
  export default FileReader;