import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './holding.css'
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


var centrallocat = [[100.7415433,13.6383389,23]]

class FileReader1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csvfile: undefined,
            dataAll : [{name:'', coords: [['', '', '']], date: [['','']] }],
            arr: [{
                name:'',
                coords: [[]],
                date: [[]]
            }],
            arr_select : [],
            select : "",
            dataHoldingDist : [],
            dataHoldingTime : [],
        };

        this.test = props.data
        this.check = props.check

        this.getData = this.getData.bind(this);
    }
  
    componentWillMount(){
        if(this.check === true){
            this.getData(this.test)
        }
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
            if (unit==="N") { dist = dist * 0.8684 }
            // console.log('nmi') }
            return dist;
        }
    }

    onhandleChange(value,data) {
        var data_select = []
        var data_dist = []
        var data_time = []
        var ground = 0
        var ground_non = 0
        var dis = 100000
        var dist
        var first = false
        for(var i=0;i<data.length;i++){
            if(data[i].name === value){
                data_select.push(data[i])
                console.log(data[i])
            }
        }
        var timeStart = new Date("01/01/2007 " + data_select[0].date[0][1]);
        var timeEnd = new Date("01/01/2007 " + data_select[0].date[data_select[0].date.length-1][1]);

        var Diff = timeEnd - timeStart;
        var Diff_non = Diff

        for(var i=1;i<data_select[0].coords.length;i++){
            ground = ground + this.distance(data_select[0].coords[i-1][1],data_select[0].coords[i-1][0],data_select[0].coords[i][1],data_select[0].coords[i][0])
            dist = this.distance(13.6567,100.7518,data_select[0].coords[i][1],data_select[0].coords[i][0],"N")
            if(dist > dis && (dist > 20 & dist < 100)){
                ground_non = ground_non + this.distance(data_select[0].coords[i-1][1],data_select[0].coords[i-1][0],data_select[0].coords[i][1],data_select[0].coords[i][0])
                if(first == false){
                    var timeStart_non = new Date("01/01/2007 " + data_select[0].date[i][1]);
                    first = true
                }
                var timeEnd_non = new Date("01/01/2007 " + data_select[0].date[i+1][1]);
                // console.log(data_select[0].date[i+1][1])
                // Diff_non = Diff_non - (timeEnd_non - timeStart_non);
                // sum = sum + 1
                // if(sum > 10){
                //     // console.log(sum)
                //     check = true
                //     name = result.data[i][1]
                // }
                
            }
            // else{
            //     ground_non = ground_non + this.distance(data_select[0].coords[i-1][1],data_select[0].coords[i-1][0],data_select[0].coords[i][1],data_select[0].coords[i][0])
            // }
            dis = this.distance(13.6567,100.7518,data_select[0].coords[i][1],data_select[0].coords[i][0],"N")
        }
        Diff_non = Diff_non - (timeEnd_non - timeStart_non);
        var time_hold = Diff * 0.16666666666667 * 0.0001
        var time_non = Diff_non * 0.16666666666667 * 0.0001
        console.log(time_non, ',' , time_hold)
        ground_non = ground - ground_non
        console.log(ground_non, ',' , ground)
        data_dist.push(['Not holding',Math.round(ground_non)])
        data_dist.push(['Holding',Math.round(ground)])
        data_time.push(['Not holding',Math.round(time_non)])
        data_time.push(['Holding',Math.round(time_hold)])
        this.setState({dataHoldingDist : data_dist, dataHoldingTime : data_time})
    }

    selectdata(flighthold,data){
        var data_holding = []
        for(var i=0;i<data.length;i++){
            for(var j=0;j<flighthold.length;j++){
                if(data[i].name === flighthold[j]){
                    data_holding.push(data[i])
                    // console.log(data[i].name)
                }
            }
        }
        // console.log(this.state.data_holding)
        this.setState({dataAll: data_holding});
    }
    getData(result) {
        this.state.arr = [{
            name:'',
            coords: [[]],
            date: [[]]
        }]
        // console.log(result.length)
        var num = 0
        var name = result[0].name
        var date = result[0].name
        var count = this.uniqueNameFlight(name,result,date)
        var dis = 100000
        var arr = []
        var check = false
        var sum = 0
        var dist
        console.log(count)

        for(var j=0;j<count;j++){
            dis = 100000
            check = false
            sum = 0
            for(var i=num;i<=result.length;i++){
                // console.log(num)
                if(result[i].name === '-'){
                    num = i+1
                    //name = result.data[i][1]
                    this.state.arr[j].coords.pop()
                    this.state.arr[j].date.pop()
                    break;
                }
                this.state.arr[j].coords.push([])
                this.state.arr[j].date.push([])
                this.state.arr[j].name = result[i].name
                this.state.arr[j].coords[i-num].push(result[i].long)
                this.state.arr[j].coords[i-num].push(result[i].lat)
                this.state.arr[j].coords[i-num].push(result[i].attitude)
                this.state.arr[j].date[i-num].push(result[i].date)
                this.state.arr[j].date[i-num].push(result[i].time)
                if(check == false){
                    dist = this.distance(13.6567,100.7518,result[i].lat,result[i].long,"N")
                    if(dist > dis && (dist > 30 & dist < 50)){
                        // console.log(result.data[i][1]," ", dist)
                        sum = sum + 1
                        if(sum > 15){
                            // console.log(sum)
                            check = true
                            name = result[i].name
                        }
                        
                    }
                    dis = this.distance(13.6567,100.7518,result[i].lat,result[i].long,"N")
                    // console.log(result.data[i][1]," ", this.distance(13.6567,100.7518,result.data[i][5],result.data[i][4],"N"))
                }
            }
            if(check == true){
                arr.push(name)
            }
            // console.log(j)
            if(j < count-1){
                this.state.arr.push({name:'', coords: [[]], date:[[]]})
            }
        }
        console.log(arr)
        //console.log(result.data)
        // this.setState({test: result.data});
        console.log(this.state.arr)
        //this.test()
        this.setState({arr_select : arr})
        this.selectdata(arr,this.state.arr)
        // this.setState({dataAll: this.state.arr});
    }

    getOption = () => ({
        xAxis: {
            type: 'category',
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 22,
            }
        },
        yAxis: {
            type: 'value',
            name: 'distance (nmi)',
            nameLocation: 'center',
            nameGap: 100,
            nameTextStyle: {
                fontSize: 20
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 22,
            }
        },
        series: [
            {
                data: this.state.dataHoldingDist,
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        fontSize: 20
                    }
                },
            }
        ]      
    });
    getOptiontime = () => ({
        xAxis: {
            type: 'category',
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 22,
            }
        },
        yAxis: {
            type: 'value',
            name: 'time (min)',
            nameLocation: 'center',
            nameGap: 100,
            nameTextStyle: {
                fontSize: 20
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 22,
            }
        },
        series: [
            {
                data: this.state.dataHoldingTime,
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        fontSize: 20
                    }
                },
            }
        ]      
    });
  
    render(props) {
    //   console.log(this.state.csvfile);
      return (
        <div className="App">
          <h1>Holding Analyze</h1>
            <Select placeholder="Select Flight" style={{ width: 300, fontSize: "1.2rem" }} onChange={e => this.onhandleChange(e,this.state.dataAll)}>
                {this.state.arr_select.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select>
            <ReactEcharts option={this.getOption()} style={{width:1300, height:500}} />
                <ReactEcharts option={this.getOptiontime()} style={{width:1300, height:500}} />
        </div>
      );
    }
  }

  FileReader1.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool
  };
  
  
  export default FileReader1;