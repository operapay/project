import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './holding.css'
import { Select,Checkbox,Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import BlockScrolling from "../../../BlockScrolling";

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
            runway : [{name:'01R',lat:13.656697,long:100.751831},
            {name:'01L',lat:13.671278,long:100.734664},
            {name:'19L',lat:13.691714,long:100.761033},
            {name:'19R',lat:13.703669,long:100.743178}],
            checkedList: [],
            data_line : [],
            heavy: ['A38','A35','A33','B74','B77','B78'],
            large: ['A31','A32','B73','A20'],
            small: ['AT7'],
        };
        this.data = props.data
        this.time_pick = props.time_pick
        this.name_pick = props.name
        this.time = props.time
        this.turn = props.turn
        
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
        var color_num = 0
        // console.log('pick' , timepick)
        // console.log(this.time)
        // console.log(data)
        for(var i=0;i<data.length;i++){
            var dis,dis_runway;
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
            var res_lon = this.interpolate(time_min,parseFloat(lon_min),time_max,parseFloat(lon_max),timepick)
            var res_lat = this.interpolate(time_min,parseFloat(lat_min),time_max,parseFloat(lat_max),timepick)
            var res_alt = this.interpolate(time_min,parseFloat(altitude_min),time_max,parseFloat(altitude_max),timepick)
            
            //--------------------detect miles from runway-------------------------------
            if(this.turn[i].runway === '01R') dis_runway = this.distance(this.state.runway[0].lat,this.state.runway[0].long,res_lat,res_lon)
            else if(this.turn[i].runway === '01L') dis_runway = this.distance(this.state.runway[1].lat,this.state.runway[1].long,res_lat,res_lon)
            else if(this.turn[i].runway === '19L') dis_runway = this.distance(this.state.runway[2].lat,this.state.runway[2].long,res_lat,res_lon)
            else if(this.turn[i].runway === '19R') dis_runway = this.distance(this.state.runway[3].lat,this.state.runway[3].long,res_lat,res_lon)
            //-------------------- compute distance between airplane----------------------
            if(i < data.length-1 && res_alt !== 0 && dis_runway < 15){
                // console.log('if')
                var head; 
                if(this.state.heavy.includes(data[i].data.aircraft)){
                    scatter.push([res_lon,res_lat,res_alt,15,data[i].name])
                    head = 'heavy'
                } 
                else if(this.state.large.includes(data[i].data.aircraft)){
                    scatter.push([res_lon,res_lat,res_alt,10,data[i].name])
                    head = 'large'
                }
                else if(this.state.small.includes(data[i].data.aircraft)) {
                    scatter.push([res_lon,res_lat,res_alt,5,data[i].name])
                    head = 'small'
                }
                else{
                    scatter.push([res_lon,res_lat,res_alt,10,data[i].name])
                    head = 'large'
                }
                // console.log('scatter',scatter)
                var follow;
                if(this.state.heavy.includes(data[i+1].data.aircraft)) follow = 'heavy';
                else if(this.state.large.includes(data[i+1].data.aircraft)) follow = 'large';
                else if(this.state.small.includes(data[i+1].data.aircraft)) follow = 'small';  
                else follow = 'large';
                
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
                coord = [[res_lon,res_lat,res_alt],[data[i].data.coords[state][0],data[i].data.coords[state][1],data[i].data.coords[state][2]]]
                for(var j=state;j>1;j--){
                    dis = dis + this.distance(data[i].data.coords[j][1],data[i].data.coords[j][0],data[i].data.coords[j-1][1],data[i].data.coords[j-1][0])
                    if(dis >= real_dis){
                        break
                    }
                    coord.push([data[i].data.coords[j-1][0],data[i].data.coords[j-1][1],data[i].data.coords[j-1][2]])
                }
                if(coord.length > 2){
                    // console.log(color_num)
                    if(color_num % 2 == 0){
                        // console.log('even')
                        line.push({name:data[i].name,coords:coord,
                        lineStyle: {
                            width: 3,
                            color: '#a6c84c',
                            opacity: 1
                        }})
                        color_num += 1
                    }
                    else if(color_num % 2 != 0){
                        // console.log('odd')
                        line.push({name:data[i].name,coords:coord,
                        lineStyle: {
                            width: 3,
                            color: '#ffa022',
                            opacity: 1
                        }}) 
                        color_num += 1
                    }
                    // color_num += 1
                }
            }
            else if(i === data.length-1 && dis_runway < 15){
                if(this.state.heavy.includes(data[i].data.aircraft)){
                    scatter.push([res_lon,res_lat,res_alt,15,data[i].name])
                    // head = 'heavy'
                } 
                else if(this.state.large.includes(data[i].data.aircraft)){
                    scatter.push([res_lon,res_lat,res_alt,10,data[i].name])
                    // head = 'large'
                }
                else if(this.state.small.includes(data[i].data.aircraft)) {
                    scatter.push([res_lon,res_lat,res_alt,5,data[i].name])
                    // head = 'small'
                }
            }
        }
        // console.log('arr', array)
        // console.log('line', line)
        var rev = line.reverse()
        this.setState({data : scatter,data_line:rev})
    }

    getOption = () => ({
        maptalks3D: map,
        series: [
            {
                type: 'scatter3D',
                coordinateSystem: 'maptalks3D',
                itemStyle: {
                    color: 'rgb(50, 50, 150)',
                    opacity: 1
                },
                data: this.state.data,
                symbolSize: function (data) {
                    return data[3];
                },
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
                polyline: true,
                data: this.state.data_line
            }
        ],
    });

  
    render(props) {
    //   console.log(this.state.csvfile);
      return (
        <div className="App">
            <BlockScrolling>
            <ReactEcharts option={this.getOption()}  style={{width:'100%', height:800, border:'1px solid lightgray'}}/>
            </BlockScrolling>
            {/* <Plot data={this.state.data_line}/> */}
        </div>
      );
    }
  }
  FileReader2.propTypes = {
    data: PropTypes.array,
    time_pick: PropTypes.string,
    name : PropTypes.string,
    time : PropTypes.array,
    turn : PropTypes.array
  };
  
  
  export default FileReader2;