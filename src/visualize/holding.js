import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './holding.css'
import { Select,Checkbox,Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const { Option } = Select;

var map = {
    center: [100.7395539,13.6983666], //mahamek
    zoom: 10,
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
            csvfile: undefined,
            checkedList: [],
            dataAll : [{name:'', coords: [['', '', '']]}],
            arr: [{
                name:'',
                coords: [[]]
            }],
            arr_select : [],
            select : "",
            dataHolding : [{name:'', coords: [['', '', '']]}],
            time_select : '',
            distinct_time : [],
            data_select_time: [],
            name_holding : []
        };
        this.test = props.data
        this.check = props.check
        
        this.getData = this.getData.bind(this);
        // this.updateData = this.updateData.bind(this);
    }
  
    componentWillMount(){
        if(this.check === true){
            this.getData(this.test)
        }
        // console.log('mount')
        console.log(this.check)
        console.log(this.test)
    }

    componentWillUpdate(nextPorps){
        if(nextPorps.check !== this.check && nextPorps.test !== this.test){
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

    distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 === lat2) && (lon1 === lon2)) {
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
        // console.log(value)
        this.setState({checkedList : value})
        for(var j=0;j<value.length;j++){
            for(var i=0;i<data.length;i++){
                if(data[i].name === value[j]){
                    data_select.push(data[i])
                    console.log(data[i])
                }
            }
        }
        console.log(data_select)
        this.setState({dataHolding : data_select})
    }

    Time_onhandleChange(value,data) {
        var data_select = []
        this.setState({dataHolding : [], checkedList:[]})
        // console.log(value,data)
        // this.setState({select : value})
        for(var i=0;i<data.length;i++){
            // console.log(data[i].time_1.getHours())
            if(data[i].time_1.getHours() === parseInt(value) || data[i].time_2.getHours() === parseInt(value)){
                data_select.push(data[i].name)
                console.log(data[i])
            }
        }
        console.log(data_select)
        this.setState({name_holding : data_select})
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
        // console.log(result.length)
        this.state.arr = [{
            name:'',
            coords: [[]]
        }]
        var num = 0
        var name = result[0].name
        var date = result[0].name
        var count = this.uniqueNameFlight(name,result,date)
        var dis = 100000
        var arr = []
        var check = false
        var sum = 0
        var dist
        var time_first
        var time_last
        var arr_time = []
        console.log(count)

        for(var j=0;j<count;j++){
            dis = 100000
            check = false
            sum = 0
            time_first = 0
            time_last = 0
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
                // dist = this.distance(13.6567,100.7518,result.data[i][5],result.data[i][4],"K")
                // console.log(result.data[i][1]," ", dist)
                if(check === false){
                    dist = this.distance(13.6567,100.7518,result[i].lat,result[i].long,"N")
                    if(dist > dis && (dist > 30 & dist < 50)){
                        // console.log(result.data[i][1]," ", dist)
                        sum = sum + 1
                        // var timeStart = new Date("01/01/2007 " + data_select[0].date[0][1]);
                        if(sum === 1){
                            var mydate = moment(String(result[i].date), 'YYYY-MM-DD');
                            time_first = new Date(moment(mydate).format("MM/DD/YYYY")+" " + result[i].time);
                            // console.log('test' + String(result[i].date))
                        }
                        if(sum > 15){
                            // console.log(sum)
                            check = true
                            name = result[i].name
                            var mydate = moment(String(result[i].date), 'YYYY-MM-DD');
                            time_last = new Date(moment(mydate).format("MM/DD/YYYY")+" " + result[i].time);
                        }
                        
                    }
                    dis = this.distance(13.6567,100.7518,result[i].lat,result[i].long,"N")
                    // console.log(result.data[i][1]," ", this.distance(13.6567,100.7518,result.data[i][5],result.data[i][4],"N"))
                }
            }
            if(check === true){
                arr.push(name)
                arr_time.push({name:name,time_1:time_first,time_2:time_last})
                // console.log(name, ':' ,time_first, ' & ', time_last)
            }
            // console.log(j)
            if(j < count-1){
                this.state.arr.push({name:'', coords: [[]]})
            }
        }
        // console.log(arr_time)
        var select_time = []
        for(var i=0;i<arr_time.length;i++){
            select_time.push(arr_time[i].time_1.getHours())
        }
        // console.log(select_time)
        var distinct = [...new Set(select_time)].sort()
        // console.log(distinct)
        // this.setState({test: result.data});
        // console.log(this.state.arr)
        //this.test()
        this.setState({arr_select : arr})
        this.selectdata(arr,this.state.arr)
        this.setState({dataAll: this.state.arr, distinct_time:distinct,data_select_time:arr_time});
    }

    getOption = () => ({
        maptalks3D: map, 
        series: [
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
                data: this.state.dataHolding
            }
        ],
    });
  
    render(props) {
    //   console.log(this.state.csvfile);
      return (
        <div className="App">
          <h1>Holding Visualization</h1>
            <Col>
                <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} onChange={e => this.Time_onhandleChange(e,this.state.data_select_time)}>
                    {this.state.distinct_time.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}.00 - {flight}.59</Option>
                    ))}
                </Select>
            </Col>
            <Col>
                <Checkbox.Group options={this.state.name_holding}  value={this.state.checkedList} onChange={e => this.onhandleChange(e,this.state.dataAll)}/>
            </Col>
            {/* <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem" }} disabled={true} onChange={e => this.onhandleChange(e,this.state.dataAll)}>
                {this.state.distinct_time.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select> */}
            {/* <Select placeholder="Select Flight" style={{ width: 300, fontSize: "1.2rem" }} onChange={e => this.onhandleChange(e,this.state.dataAll)}>
                {this.state.arr_select.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select> */}
            <ReactEcharts option={this.getOption()}  style={{width:1760, height:900}} />
        </div>
      );
    }
  }
  FileReader2.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool
  };
  
  
  export default FileReader2;