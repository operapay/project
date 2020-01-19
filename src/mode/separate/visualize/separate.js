import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './holding.css'
import { Select,Checkbox,Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const { Option } = Select;

var map = {
    center: [100.7395539,13.6983666], //mahamek
    zoom: 8,
    // pitch: 100,
    altitudeScale: 3.28,
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    }),
}


class FileReader2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            checkedList: [],
        };
        this.data = props.data
        this.time_pick = props.time_pick
        
        // this.getData = this.getData.bind(this);
        // this.updateData = this.updateData.bind(this);
    }

    componentWillMount(){
        // console.log(this.data)
        this.getData(this.data)
    }
  
    timeStringToFloat(time) {
        // console.log(time)
        var hoursMinutes = time.split(':');
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        var seconds = hoursMinutes[2] ? parseInt(hoursMinutes[2], 10) : 0;
        return hours + minutes / 60 + seconds / 3600;
    }

    interpolate(x1,y1,x2,y2,x){
        // console.log(x1,y1,x2,y2,x)
        var diff = ((y2-y1)/(x2-x1))*(x-x1)
        var res = diff+y1
        return res
    }

    getData(data){
        var timepick = this.timeStringToFloat( moment(this.time_pick).format('HH:mm:ss'))
        // console.log("...",timepick)
        var i=0
        var first,last;
        var lat_min, lon_min, time_min,altitude_min;
        var lat_max, lon_max, time_max,altitude_max;
        var array = []
        var scatter = []
        for(i in data){
            for(var j=1;j<data[i].data.coords.length;j++){
                // moment(data[i].coords[j-1][3]).format('HH:mm:ss')
                first = this.timeStringToFloat( moment(data[i].data.coords[j-1][3]).format('HH:mm:ss'))
                last = this.timeStringToFloat( moment(data[i].data.coords[j][3]).format('HH:mm:ss'))
                // console.log(first," : ",timepick," : ",last)
                if(timepick >= first && timepick <= last){
                    // console.log('if')
                    lon_min = data[i].data.coords[j-1][0]
                    lon_max = data[i].data.coords[j][0]
                    lat_min = data[i].data.coords[j-1][1]
                    lat_max = data[i].data.coords[j][1]
                    altitude_min = data[i].data.coords[j-1][2]
                    altitude_max = data[i].data.coords[j][2]
                    time_min = first
                    time_max = last
                    break
                }
            }
            var res_lon = this.interpolate(time_min,parseFloat(lon_min),time_max,parseFloat(lon_min),timepick)
            var res_lat = this.interpolate(time_min,parseFloat(lat_min),time_max,parseFloat(lat_max),timepick)
            var res_alt = this.interpolate(time_min,parseFloat(altitude_min),time_max,parseFloat(altitude_max),timepick)
            array.push({name:data[i].name,coords:[res_lon,res_lat,res_alt]})
            scatter.push([res_lon,res_lat])
        }
        console.log('arr', array)
        this.setState({data : scatter})
    }

    // onhandleChange(value,data) {
    //     // console.log(`selected ${value}`);
    //     var data_select = []
    //     // console.log(value)
    //     this.setState({checkedList : value})
    //     for(var j=0;j<value.length;j++){
    //         for(var i=0;i<data.length;i++){
    //             if(data[i].name === value[j]){
    //                 data_select.push(data[i])
    //                 console.log(data[i])
    //             }
    //         }
    //     }
    //     // console.log(data_select)
    //     this.setState({data : data_select})
    // }

    // getOption = () => ({
    //     maptalks3D: map, 
    //     series: [
    //         {
    //             type: 'lines3D',
    //             coordinateSystem: 'maptalks3D',
    //             effect: {
    //                 show: true,
    //                 constantSpeed: 40,
    //                 trailWidth: 2,
    //                 trailLength: 0.05,
    //                 trailOpacity: 1,
    //             },
    //             //blendMode: 'lighter',
    //             polyline: true,
    //             lineStyle: {
    //                 width: 2,
    //                 color: 'rgb(50, 60, 170)',
    //                 opacity: 0.5
    //             },
    //             data: this.state.data
    //         }
    //     ],
    // });

    getOption = () => ({
        maptalks3D: map, 
        series: [
            {
                type: 'scatter3D',
                coordinateSystem: 'maptalks3D',
                // blendMode: 'lighter',
                symbolSize: 8,
                // symbol: 'triangle',
                itemStyle: {
                    color: 'rgb(50, 50, 150)',
                    opacity: 1
                },
                data: this.state.data
            },
            // {
            //     type: 'lines3D',
            //     coordinateSystem: 'maptalks3D',
            //     effect: {
            //         show: true,
            //         constantSpeed: 40,
            //         trailWidth: 2,
            //         trailLength: 0.05,
            //         trailOpacity: 1,
            //     },
            //     //blendMode: 'lighter',
            //     polyline: true,
            //     lineStyle: {
            //         width: 2,
            //         color: 'rgb(50, 60, 170)',
            //         opacity: 0.5
            //     },
            //     data: this.state.data
            // }
        ],
    });

  
    render(props) {
    //   console.log(this.state.csvfile);
      return (
        <div className="App">
            <ReactEcharts option={this.getOption()}  style={{width:1760, height:900}} />
        </div>
      );
    }
  }
  FileReader2.propTypes = {
    data: PropTypes.array,
    time_pick: PropTypes.string
  };
  
  
  export default FileReader2;