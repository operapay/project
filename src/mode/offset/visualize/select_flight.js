import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './select.css'
import { Select,Button  } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Offset from './offset';

const { Option } = Select;


class FileReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // csvfile: undefined,
            arr: [{
                name:'',
                coords: [[]],
                date:'',
                time_1:'',
                time_2:'',
                week:''
            }],
            distinct_week : [],
            distinct_month : [],
            data_selected : [],
            check_data : false,
            time_default : "Select Time",
            unit_default : "Select Unit",
            flight_default : "Select Flight no",
            unit : ['Week','Month'],
            real : [],
            click : false,
            checkbox : [],
            distinct_time : [],
            what_select : "Flight no"
            // checkedList: [],
        };
        this.data = props.data
        this.check = props.check
        this.name = props.name

        // this.getData = this.getData.bind(this);
    }

    search = () => {
        this.setState({ click: true });
    };
  
    Name_onhandleChange(value,data) {
        var data_select = []
        var data_month = []
        var data_week = []
        this.setState({flight_default:value,click:false})
        // console.log(data)
        for(var i=0;i<data.length;i++){
            // console.log(data[i].date, String(value))
            if(data[i].name === value){
                data_select.push(data[i])
                data_month.push(data[i].time_1.getMonth())
                data_week.push(data[i].week)
                // console.log(data[i])
            }
        }
        // console.log(data_select)
        // console.log(data_time.sort(function(a, b){return a-b}))
        var distinctMonth = [...new Set(data_month)]
        var distinctWeek = [...new Set(data_week)]

        this.setState({data_selected:data_select, distinct_month : distinctMonth, distinct_week:distinctWeek, time_default:"Select Time", unit_default:"Select Unit"})
    }

    Unit_onhandleChange(value) {
        this.setState({unit_default:value,click:false})
        var data_select = null
        // console.log(data)
        if(value === "Week"){
            data_select = this.state.distinct_week
        }
        else{
            data_select = this.state.distinct_month
        }
        this.setState({distinct_time:data_select, time_default:"Select Time"})
    }

    Time_onhandleChange(value,data) {
        this.setState({time_default:value,click:false})
        var data_select = []
        if(this.state.unit_default === "Week"){
            for(var i=0;i<data.length;i++){
                // console.log(data[i].week, "vs" , value)
                if(String(data[i].week) === value){
                    data_select.push(data[i])
                }
            }
        }
        else{
            for(var i=0;i<data.length;i++){
                // console.log(data[i].time_1.getMonth(), "vs" , value)
                if(String(data[i].time_1.getMonth()) === value){
                    data_select.push(data[i])
                }
            }
        }

        // console.log(data_select)
        this.setState({real : data_select})

    }
  
    render(props) {
        // console.log(this.data)
      return (
        <div className="App">
            <div>
                <Select placeholder="Select Flight no" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.flight_default} onChange={e => this.Name_onhandleChange(e,this.data)}>
                    {this.name.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                    ))}
                </Select>
                <Select placeholder="Select Unit" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.unit_default} onChange={e => this.Unit_onhandleChange(e)}>
                    {this.state.unit.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                    ))}
                </Select>
                <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.time_default} onChange={e => this.Time_onhandleChange(e,this.state.data_selected)}>
                    {this.state.distinct_time.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                    ))}
                </Select>
                {this.state.flight_default !== 'Select Flight no' && this.state.unit_default !== 'Select Unit' && this.state.time_default !== 'Select Time' ?
                <Button onClick={this.search} disabled={this.state.button_search}>Search</Button> : null}
                {/* <Button onClick={this.search}>Search</Button> */}
            </div>
            <div>
                {this.state.click === true ? 
                <Offset data={this.state.real} name={this.state.checkbox} what={this.state.what_select}/>
                : null}
            </div>

        </div>
      );
    }
  }

  FileReader.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool,
    name: PropTypes.array
  };
  
  
  export default FileReader;