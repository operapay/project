import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './offset.css'
import { Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

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
            data : []
        };
        this.flight = props.flight
        this.check = props.check_data

        // this.getData = this.getData.bind(this);
    }
  

    componentWillMount(){
        this.getData(this.flight)
    }

    componentWillUpdate(nextPorps){
        if(nextPorps.check != this.check && nextPorps.flight != this.flight){
            console.log(this.check , 'next ', nextPorps.check )
            if(this.check === true){
                // console.log(this.flgiht , 'next_fl ', nextPorps.flgiht)
                this.getData(nextPorps.flight);
            }
        }
        // console.log('willl')
    }

    // uniqueNameFlight(name,data,date){
    //     var count = 0
    //     console.log(data.length)
    //     for(var i=1;i<data.length;i++){
    //         if (data[i].name === '-'){
    //             count += 1
    //             // console.log(i)
    //         }
    //     }
    //     return count
    // }

    // Date_onhandleChange(value,data) {
    //     var data_select = []
    //     var data_time = []
    //     this.setState({select_date:true})
    //     // console.log(value,data)
    //     // this.setState({select : value})
    //     for(var i=0;i<data.length;i++){
    //         // console.log(data[i].date, String(value))
    //         if(data[i].date === String(value)){
    //             data_select.push(data[i])
    //             data_time.push(data[i].time_1.getHours())
    //             // console.log(data[i])
    //         }
    //     }
    //     var distinct = [...new Set(data_time)].sort()
    //     // console.log(data_select)
    //     this.setState({distinct_time : distinct,date_name:data_select})
    // }

    // Time_onhandleChange(value,data) {
    //     var data_select = []
    //     // this.setState({dataHolding : [], checkedList:[]})
    //     // console.log(value,data)
    //     // this.setState({select : value})
    //     for(var i=0;i<data.length;i++){
    //         // console.log(data[i].time_1.getHours())
    //         if(data[i].time_1.getHours() === parseInt(value) || data[i].time_2.getHours() === parseInt(value)){
    //             data_select.push(data[i])
    //             console.log(data[i])
    //         }
    //     }
    //     console.log(data_select)
    //     this.setState({flight : data_select})
    // }

    getData(result) {
        console.log('result: ',result)
        this.setState({data: result});
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
                data: this.state.data
            }
        ],
    });
  
    render(props) {
    //   console.log(this);
      return (
        <div className="App">
            {/* <h1>Offset Visualization</h1> */}
            {/* <Select placeholder="Select Date" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} onChange={e => this.Date_onhandleChange(e,this.state.dataAll)}>
                {this.state.distinct_date.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select>
            {this.state.select_date === true ? 
                <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} onChange={e => this.Time_onhandleChange(e,this.state.date_name)}>
                    {this.state.distinct_time.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}.00 - {flight}.59</Option>
                    ))}
                </Select>: null
            } */}
            <ReactEcharts option={this.getOption()} style={{width:1760, height:600}} />
        </div>
      );
    }
  }

  FileReader.propTypes = {
    flight: PropTypes.array,
    check_data: PropTypes.bool
  };
  
  
  export default FileReader;