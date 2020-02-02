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
            data_line : [],
            heavy: ['A380','A358','A359','A333','A332','B747','B77W','B788','B789','B772'],
            large: ['A319','A320','A321','B738','B739','B737'],
            small: ['AT76']
        };
        this.data = props.data
        this.time_pick = props.time_pick
        this.name_pick = props.name
        this.time = props.time
        
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

    distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit==="K") { dist = dist * 1.609344 }
            if (unit==="N") { dist = dist * 0.8684
            // console.log('nmi') 
            }
            return dist;
        }
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
        // var i=0
        var first,last;
        var lat_min, lon_min, time_min,altitude_min;
        var lat_max, lon_max, time_max,altitude_max;
        var lat,lon,altitude;
        var array = []
        var scatter = []
        var line = []
        var coord = []
        // console.log('pick' , timepick)
        // console.log(this.time)
        console.log(data)
        for(var i=0;i<data.length;i++){
            var dis;
            var state = 0
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
                    state = j-1
                    break
                }
            }
            var res_lon = this.interpolate(time_min,parseFloat(lon_min),time_max,parseFloat(lon_min),timepick)
            var res_lat = this.interpolate(time_min,parseFloat(lat_min),time_max,parseFloat(lat_max),timepick)
            var res_alt = this.interpolate(time_min,parseFloat(altitude_min),time_max,parseFloat(altitude_max),timepick)
            // array.push({name:data[i].name,coords:[res_lon,res_lat,res_alt]})
            scatter.push([res_lon,res_lat])
            // console.log(data)
            // console.log('data', data[i], data[i+1])
            // console.log(i)
            //-------------------- compute distance between airplane----------------------
            if(i < data.length-1){
                var head; 
                if(this.state.heavy.includes(data[i].data.aircraft)) head = 'heavy';
                else if(this.state.large.includes(data[i].data.aircraft)) head = 'large';
                else if(this.state.small.includes(data[i].data.aircraft)) head = 'small';
                // console.log(i)
                var follow;
                if(this.state.heavy.includes(data[i+1].data.aircraft)) follow = 'heavy';
                else if(this.state.large.includes(data[i+1].data.aircraft)) follow = 'large';
                else if(this.state.small.includes(data[i+1].data.aircraft)) follow = 'small';       
                
                var real_dis = 0;
                if(head === 'small') real_dis = 3;
                else if(head === 'large'){
                    if(follow === 'small') real_dis = 4;
                    else real_dis = 3;
                }
                else if(head === 'heavy'){
                    if(follow === 'small') real_dis = 6;
                    else if(follow === 'large') real_dis = 5;
                    else real_dis = 4;
                }

                dis = this.distance(res_lat,res_lon,data[i].data.coords[state][1],data[i].data.coords[state][0])
                coord = [[res_lon,res_lat,0],[data[i].data.coords[state][0],data[i].data.coords[state][1],0]]
                for(var j=state;j>1;j--){
                    dis = dis + this.distance(data[i].data.coords[j][1],data[i].data.coords[j][0],data[i].data.coords[j-1][1],data[i].data.coords[j-1][0])
                    coord.push([data[i].data.coords[j-1][0],data[i].data.coords[j-1][1],0])
                    if(dis >= real_dis){
                        // console.log('dis',dis)
                        break
                    }
                }
                // console.log('coord',coord)
                if(coord.length > 2)
                    line.push({name:data[i].name,coords:coord})
            }
        }
        // console.log('arr', array)
        // console.log('line', line)
        this.setState({data : scatter,data_line:line})
    }

    getOption = () => ({
        maptalks3D: map, 
        tooltip: {
            position: 'top',
            formatter: function (params) {
                return 'xxxxx';
            }
        },
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
            {
                type: 'lines3D',
                coordinateSystem: 'maptalks3D',
                // symbolSize: 8,
                effect: {
                    show: true,
                    constantSpeed: 1,
                    trailWidth: 2,
                    trailLength: 0.05,
                    trailOpacity: 1,
                    symbolSize: 8,
                },
                //blendMode: 'lighter',
                polyline: true,
                lineStyle: {
                    width: 2,
                    color: 'rgb(50, 60, 170)',
                    opacity: 0.5
                },
                data: this.state.data_line
            }
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
    time_pick: PropTypes.string,
    name : PropTypes.string,
    time : PropTypes.array
  };
  
  
  export default FileReader2;