import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import './holding.css'
import Papa from 'papaparse'
import { Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';


const { Option } = Select;

class FileReader1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // csvfile: undefined,
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
            // status : true
        };

        this.data = props.data
        this.name = props.name
        this.dataref = props.dataref

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

    average = list => list.reduce((prev, curr) => prev + curr) / list.length;

    alldata(value,data){
        // console.log(data)
        var avg = []
        var avg_time = []
        var res = []
        var selectdata = []
        var count = 0
        var dis = 100000
        var check = false
        var sum = 0
        var dist
        var num = 0
        for(var i=0;i<data.length-1;i++){
            if(data[i].name === value){
                if(data[i+1].name === '-'){
                    // console.log(i)
                    selectdata.push('-')
                    // avg.push(sum)
                    // sum = 0
                }
                else{
                    selectdata.push(data[i])
                    // sum = sum + this.distance(data[i].lat,data[i].long,data[i+1].lat,data[i+1].long,"N")
                }
            }
        }
        console.log('selct',selectdata)
        if(selectdata.length === 0){
            return 0;
        }
        for(var i=0;i<selectdata.length-1;i++){
            if(selectdata[i+1] === '-'){
                check = false
                dis = 100000
                sum = 0
                if(count != 0){
                    avg.push(count)
                    count = 0
                    var mydate = moment(String(selectdata[i].date), 'YYYY-MM-DD');
                    console.log(mydate)
                    var timeEnd = new Date(moment(mydate).format("MM/DD/YYYY")+" " + selectdata[i].time);
                    // var timeEnd = new Date("01/01/2007 " + selectdata[i].time);
                    var Diff = timeEnd - timeStart;
                    avg_time.push(Diff)
                }
                i = i+2
                num = i
                // console.log('----')
            }
            if(check === false && i < selectdata.length-1){
                dist = this.distance(13.6567,100.7518,selectdata[i].lat,selectdata[i].long,"N")
                if(dist > dis && (dist > 30 & dist < 50)){
                    // console.log(result.data[i][1]," ", dist)
                    sum = sum + 1
                    if(sum > 15){
                        check = true
                        // console.log(sum)
                    }
                    
                }
                dis = this.distance(13.6567,100.7518,selectdata[i].lat,selectdata[i].long,"N")
                count = count + this.distance(selectdata[i].lat,selectdata[i].long,selectdata[i+1].lat,selectdata[i+1].long,"N")
                if(num === i){
                    var mydate = moment(String(selectdata[num].date), 'YYYY-MM-DD');
                    var timeStart = new Date(moment(mydate).format("MM/DD/YYYY")+" " + selectdata[num].time);
                    // var timeStart = new Date("01/01/2007 " + selectdata[num].time);
                }
                // console.log(result.data[i][1]," ", this.distance(13.6567,100.7518,result.data[i][5],result.data[i][4],"N"))
            }
            if(check === true){
                count = 0
            }
            // console.log('count',count)
        }
        res.push(this.average(avg),this.average(avg_time))
        return res
    }

    onhandleChange(value,data) {
        var data_select = []
        var data_dist = []
        var data_time = []
        var ground = 0
        var res = this.alldata(value,this.dataref)
        for(var i=0;i<data.length;i++){
            if(data[i].name === value){
                data_select.push(data[i])
            }
        }

        var mydate = moment(String(data_select[0].date[0][0]), 'YYYY-MM-DD');
        var timeStart = new Date(moment(mydate).format("MM/DD/YYYY")+" " + data_select[0].date[0][1]);
        // var timeStart = new Date("01/01/2007 " + data_select[0].date[0][1]);
        var timeEnd = new Date(moment(mydate).format("MM/DD/YYYY")+" " + data_select[0].date[data_select[0].date.length-1][1]);
        // var timeEnd = new Date("01/01/2007 " + data_select[0].date[data_select[0].date.length-1][1]);

        var Diff = timeEnd - timeStart;

        for(var i=1;i<data_select[0].coords.length;i++){
            ground = ground + this.distance(data_select[0].coords[i-1][1],data_select[0].coords[i-1][0],data_select[0].coords[i][1],data_select[0].coords[i][0])
        }
        var time_hold = Diff * 0.16666666666667 * 0.0001
        var time_non = res[1] * 0.16666666666667 * 0.0001
        data_dist.push(['Not holding',Math.round(res[0])])
        data_dist.push(['Holding',Math.round(ground)])
        data_time.push(['Not holding',Math.round(time_non)])
        data_time.push(['Holding',Math.round(time_hold)])
        this.setState({dataHoldingDist : data_dist, dataHoldingTime : data_time})
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
            <Select placeholder="Select Flight" style={{ width: 300, fontSize: "1.2rem" }} onChange={e => this.onhandleChange(e,this.data)}>
                {this.name.map(flight => (
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
    name: PropTypes.array,
    dataref: PropTypes.array
  };
  
  
  export default FileReader1;