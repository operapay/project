import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './holding.css'
import * as d3 from 'd3-request';
import url from '../data/data_28.10.62.csv';
// import url from '../data/data_test.csv';
import Papa from 'papaparse'
import echarts from 'echarts'
import { Select } from 'antd';

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

class Flightpath extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
        console.log(data.length)
        for(var i=1;i<data.length;i++){
            if (data[i][1] === '-'){
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

    handleChange(value,data) {
        var data_select = []
        var data_dist = []
        var data_time = []
        var ground = 0
        for(var i=0;i<data.length;i++){
            if(data[i].name === value){
                data_select.push(data[i])
                console.log(data[i])
            }
        }

        for(var i=1;i<data_select[0].coords.length;i++){
            ground = ground + this.distance(data_select[0].coords[i-1][1],data_select[0].coords[i-1][0],data_select[0].coords[i][1],data_select[0].coords[i][0])
        }
        // console.log(data_select[0].date[0][1])
        var timeStart = new Date("01/01/2007 " + data_select[0].date[0][1]);
        var timeEnd = new Date("01/01/2007 " + data_select[0].date[data_select[0].date.length-1][1]);

        var Diff = timeEnd - timeStart;
        var time_hold = Diff * 0.16666666666667 * 0.0001
        data_dist.push(['Holding',ground])
        data_time.push(['Holding',time_hold])
        // console.log(time_hold)
        this.setState({dataHoldingDist : data_dist, dataHoldingTime : data_time})
    }

    selectdata(flighthold,data){
        var data_holding = []
        for(var i=0;i<data.length;i++){
            for(var j=0;j<flighthold.length;j++){
                if(data[i].name === flighthold[j]){
                    data_holding.push(data[i])
                }
            }
        }
        this.setState({dataAll: data_holding});
    }

    getData(result) {
        console.log(result.data.length)
        var num = 1
        var name = result.data[1][1]
        var date = result.data[1][1]
        var count = this.uniqueNameFlight(name,result.data,date)
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
            for(var i=num;i<=result.data.length;i++){
                // console.log(num)
                if(result.data[i][1] === '-'){
                    num = i+1
                    //name = result.data[i][1]
                    this.state.arr[j].coords.pop()
                    this.state.arr[j].date.pop()
                    break;
                }
                this.state.arr[j].coords.push([])
                this.state.arr[j].date.push([])
                this.state.arr[j].name = result.data[i][1]
                this.state.arr[j].coords[i-num].push(result.data[i][4])
                this.state.arr[j].coords[i-num].push(result.data[i][5])
                this.state.arr[j].coords[i-num].push(result.data[i][6])
                this.state.arr[j].date[i-num].push(result.data[i][2])
                this.state.arr[j].date[i-num].push(result.data[i][3])
                if(check == false){
                    dist = this.distance(13.6567,100.7518,result.data[i][5],result.data[i][4],"N")
                    if(dist > dis && (dist > 20 & dist < 50)){
                        // console.log(result.data[i][1]," ", dist)
                        sum = sum + 1
                        if(sum > 10){
                            // console.log(sum)
                            check = true
                            name = result.data[i][1]
                        }
                        
                    }
                    dis = this.distance(13.6567,100.7518,result.data[i][5],result.data[i][4],"N")
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


    async getCsvData() {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.getData
        });
    }
    
    getOption = () => ({
        xAxis: {
            type: 'category',
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: this.state.dataHoldingDist,
                type: 'bar'
            }
        ]      
    });
    getOptiontime = () => ({
        xAxis: {
            type: 'category',
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: this.state.dataHoldingTime,
                type: 'bar'
            }
        ]      
    });
    
    render() {
        // this.state.map.remove()
        return (
            <React.Fragment>
                <p>Holding Visualization</p>
                <Select placeholder="Select Flight" style={{ width: 120 }} onChange={e => this.handleChange(e,this.state.dataAll)}>
                    {this.state.arr_select.map(flight => (
                        <Option key={flight}>{flight}</Option>
                    ))}
                </Select>
                <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
                <ReactEcharts option={this.getOptiontime()} style={{width:1500, height:700}} />
            </React.Fragment>
            // <p>test</p>
        );
    }
}
export default Flightpath;