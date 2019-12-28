import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './select.css'
import { Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Offset from '../../visualize/offset';

const { Option } = Select;


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
            flight : [],
            check_data : false,
            time_default : "Select Time",
            unit_default : "Select Unit",
            flight_default : "Select Flight no",
            date_default : "Select Date",
            feature : ['Date','Flight no'],
            unit : ['Week','Month'],
            select_feature : "Date"
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

    Feature_onhandleChange(value) {
        this.setState({select_feature:value,date_default:"Select Date",flight_default:"Select Flight no",
    time_default: "Select Time", unit_default:"Select Unit"})
    }

    Date_onhandleChange(value,data) {
        var data_select = []
        var data_time = []
        this.setState({select_date:true,check_data:false,date_default:value})
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
        var time_set = "Select Time"
        // var time_set = distinct[0] + ".00" + "-" + distinct[0] + ".59"
        // console.log(data_select)
        this.setState({distinct_time : distinct,date_name:data_select,time_default:time_set})
    }

    Time_onhandleChange(value,data) {
        // if(this.state.default_time === 'Select time'){
        //     this.setState({default_time : value})
        // }
        this.setState({time_default:value})
        var data_select = []
        var sum = 0
        
        // this.setState({dataHolding : [], checkedList:[]})
        console.log('test:' ,this.state.default_time)
        // this.setState({check_data : false})
        for(var i=0;i<data.length;i++){
            // console.log(data[i].time_1.getHours())
            if(data[i].time_1.getHours() === parseInt(value) || data[i].time_2.getHours() === parseInt(value)){
                data_select.push(data[i])
                console.log(data[i])
            }
            sum += 1
        }
        // console.log(data_select)
        this.setState({flight : data_select, check_data : true})
    }

    Flight_onhandleChange(value) {
        this.setState({select_feature:value})
    }

    Unit_onhandleChange(value) {
        this.setState({select_feature:value})
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

  
    render(props) {
      return (
        <div className="App">
            <h1>Offset Visualization</h1>
            <Select placeholder="Select Feature" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.select_feature} onChange={e => this.Feature_onhandleChange(e)}>
                {this.state.feature.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select>
            
            { this.state.select_feature === 'Date' ?
            <Select placeholder="Select Date" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.date_default} onChange={e => this.Date_onhandleChange(e,this.state.dataAll)}>
                {this.state.distinct_date.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select>
            : 
            <Select placeholder="Select Flight no" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.flight_default} onChange={e => this.Date_onhandleChange(e,this.state.dataAll)}>
                {this.state.distinct_date.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select>
            }
            
            { this.state.select_feature === 'Date' ?
            <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.time_default} onChange={e => this.Time_onhandleChange(e,this.state.date_name)}>
                {this.state.distinct_time.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}.00 - {flight}.59</Option>
                ))}
            </Select>
            :
            <Select placeholder="Select Unit" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.unit_default} onChange={e => this.Time_onhandleChange(e,this.state.date_name)}>
                {this.state.unit.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select>
            }
            {/* {this.state.check_data === true ?
            <Offset flight={this.state.flight} check_data={this.state.check_data}/>: null } */}

        </div>
      );
    }
  }

  FileReader.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool
  };
  
  
  export default FileReader;