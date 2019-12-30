import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './holding.css'
import { Select,Checkbox,Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Holding from '../../visualize/holding'

const { Option } = Select;


class FileReader2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // csvfile: undefined,
            checkedList: [],
            distinct_time : [],
            time_default : "Select Time",
            date_default : "Select Date",
            date_name : [],
            data_time : [],
            name : [],
            data : []
        };
        this.data = props.data
        this.date = props.date
        
        // this.getData = this.getData.bind(this);
        // this.updateData = this.updateData.bind(this);
    }

    onhandleChange(value,data) {
        // console.log(`selected ${value}`);
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
        // console.log(data_select)
        this.setState({data : data_select})
    }

    Date_onhandleChange(value,data) {
        var data_select = []
        var data_time = []
        this.setState({date_default:value,checkedList: []})
        // console.log(data)
        for(var i=0;i<data.length;i++){
            // console.log(data[i].date, String(value))
            if(data[i].date === String(value)){
                data_select.push(data[i])
                data_time.push(data[i].time_1.getHours())
                // console.log(data[i])
            }
        }
        // console.log(data_time)
        // console.log(data_time.sort(function(a, b){return a-b}))
        var distinct = [...new Set(data_time)].sort(function(a, b){return a-b})

        this.setState({distinct_time : distinct, date_name:data_select, time_default:"Select Time"})
    }

    Time_onhandleChange(value,data) {
        this.setState({time_default:value,checkedList: []})
        var data_select = []
        var data_name = []
        // console.log(data)
        for(var i=0;i<data.length;i++){
            if(data[i].time_1.getHours() === parseInt(value) || data[i].time_2.getHours() === parseInt(value)){
                data_select.push(data[i])
                data_name.push(data[i].name)
                // console.log(data[i])
            }
        }
        // console.log(data_select)
        this.setState({data_time : data_select, name:data_name})
    }

    render(props) {
    //   console.log(this.state.csvfile);
      return (
        <div className="App">
            <Col>
                <Select placeholder="Select Date" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.date_default} onChange={e => this.Date_onhandleChange(e,this.data)}>
                    {this.date.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                    ))}
                </Select>
                <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.time_default} onChange={e => this.Time_onhandleChange(e,this.state.date_name)}>
                    {this.state.distinct_time.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}.00 - {flight}.59</Option>
                    ))}
                </Select>
            </Col>
            <Col>
                <Select
                    mode="multiple"
                    style={{ width: '50%' }}
                    placeholder="Please select flight"
                    value={this.state.checkedList}
                    // defaultValue={['a10', 'c12']}
                    onChange={e => this.onhandleChange(e,this.state.data_time)}
                    //options={this.check}
                >
                    {this.state.name.map(flight => (
                            <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                    ))}
                </Select>
            </Col>
            {this.state.checkedList.length !== 0 ?
            <Holding data={this.state.data} check={this.state.checkedList}/> 
            : null}
        </div>
      );
    }
  }
  FileReader2.propTypes = {
    data: PropTypes.array,
    date: PropTypes.array
  };
  
  
  export default FileReader2;