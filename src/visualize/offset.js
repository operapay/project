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
            // csvfile: undefined,
            dataAll : [{name:'', coords: [['', '', '']],date:'',time_1:'',time_2:''}],
            data: [{name:'aaa', coords:[["100.759529", "13.692165", "0"],
            ["100.759804", "13.69202", "0"],
            ["100.759804", "13.69202", "0"],
            ["100.760376", "13.69186", "0"],
            ["100.760818", "13.691106", "0"],
            ["100.757057", "13.676116", "144.78"]]}],
            arr: [{
                name:'',
                coords: [[]],
                date:'',
                time_1:'',
                time_2:''
            }],
            distinct_date : [],
            distinct_time : [],
            select_date : false,
            date_time : [],
            date_name : [],
            time_name : [],
            flight : []
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

    Date_onhandleChange(value,data) {
        var data_select = []
        var data_time = []
        this.setState({select_date:true})
        // console.log(value,data)
        // this.setState({select : value})
        for(var i=0;i<data.length;i++){
            // console.log(data[i].date, String(value))
            if(data[i].date === String(value)){
                data_select.push(data[i])
                data_time.push(data[i].time_1.getHours())
                // console.log(data[i])
            }
        }
        var distinct = [...new Set(data_time)].sort()
        // console.log(data_select)
        this.setState({distinct_time : distinct,date_name:data_select})
    }

    Time_onhandleChange(value,data) {
        var data_select = []
        // this.setState({dataHolding : [], checkedList:[]})
        // console.log(value,data)
        // this.setState({select : value})
        for(var i=0;i<data.length;i++){
            // console.log(data[i].time_1.getHours())
            if(data[i].time_1.getHours() === parseInt(value) || data[i].time_2.getHours() === parseInt(value)){
                data_select.push(data[i])
                console.log(data[i])
            }
        }
        console.log(data_select)
        this.setState({flight : data_select})
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
        var dataall_date = []
        var data_check_time_date = []
        console.log(count)

        for(var j=0;j<count;j++){
            //console.log(j)
            var mydate = moment(String(result[num].date), 'DD/MM/YYYY');
            var date = moment(mydate).format("DD/MM/YYYY");
            dataall_date.push(date)
            for(var i=num;i<=result.length;i++){
                // console.log(num)
                if(result[i].name === '-'){
                    var time1 = new Date(moment(mydate).format("MM/DD/YYYY")+" " + result[num].time);
                    var time2 = new Date(moment(mydate).format("MM/DD/YYYY")+" " + result[i-1].time);
                    this.state.arr[j].date = date
                    this.state.arr[j].time_1 = time1
                    this.state.arr[j].time_2 = time2
                    // data_check_time_date.push({name: result[num].name,date: date,time_1:time1,time_2:time2})
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
                this.state.arr.push({name:'', coords: [[]],date:'',time_1:'',time_2:''})
            }
        }
        console.log(data_check_time_date)
        // this.setState({test: result.data});
        // console.log(this.state.arr)
        var distinct = [...new Set(dataall_date)]
        distinct.sort(function(a, b){
            var aa = a.split('/').reverse().join(),
                bb = b.split('/').reverse().join();
            return aa < bb ? -1 : (aa > bb ? 1 : 0);
        });
        // console.log('date: ',distinct)
        //this.test()
        this.setState({dataAll: this.state.arr,distinct_date:distinct});
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
                data: this.state.flight
            }
        ],
    });
  
    render(props) {
    //   console.log(this);
      return (
        <div className="App">
            <h1>Offset Visualization</h1>
            <Select placeholder="Select Date" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} onChange={e => this.Date_onhandleChange(e,this.state.dataAll)}>
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
            }
            <ReactEcharts option={this.getOption()} style={{width:1760, height:600}} />
        </div>
      );
    }
  }

  FileReader.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool
  };
  
  
  export default FileReader;