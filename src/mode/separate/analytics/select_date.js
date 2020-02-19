import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './select.css'
import { Select,Button,TimePicker } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Separate from './separate';
// import Separate from './plot'

const { Option } = Select;


class FileReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // csvfile: undefined,
            runway : [{name:'01R',lat:13.656697,long:100.751831},{name:'01L',lat:13.671278,long:100.734664}],
            arr: [{
                name:'',
                coords: [[]],
                date:'',
                time_1:'',
                time_2:'',
                aircraft:''
            }],
            distinct_time : [],
            // distinct_name : [],
            data_point : [],
            select_date : false,
            date_name : [],
            time_flight : [],
            time_stamp : '',
            time_default : "Select Time",
            unit_default : "Select Unit",
            click : false,
            name : null,
            real : [],
            unit:['Date','Week','Month'],
            // year: this.data[0].coords[0][3]
            // checkedList: [],
        };
        this.data = props.data
        this.check = props.check
        this.date = props.date
        this.week = props.week
        this.month = props.month

        // this.getData = this.getData.bind(this);
    }

    search = () => {
        this.setState({ click: true });
    };

    getDateOfWeek(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
        return new Date(y, 0, d);
    }

    Unit_onhandleChange(value,date,week,month){
        this.setState({unit_default:value,click:false})
        var select_unit = []
        var arr_date = []
        var arr_week = []
        var arr_month = []
        var dateofweek1,dateofweek2;
        // console.log(this.state.)
        if(value === 'Date'){
            for(var i=0;i<date.length;i++){
                arr_date.push([date[i],date[i]])
            }
            select_unit = arr_date
        } 
        else if(value === 'Week') {
            for(var i=0;i<week.length;i++){
                dateofweek1 = moment(this.getDateOfWeek(week[i],2019)).format('DD/MM/YYYY')
                dateofweek2 = moment(this.getDateOfWeek(week[i],2019)).add(6,'days').format('DD/MM/YYYY')
                arr_week.push([week[i],dateofweek1+'-'+dateofweek2])
                // moment(this.getDateOfWeek(distinctWeek[i],2019)).format('DD/MM/YYYY')
            }
            select_unit = arr_week
        }
        else{
            for(var i=0;i<month.length;i++){
                arr_month.push([month[i],moment.months(month[i])])
            }
            select_unit = arr_month
        } 
        this.setState({distinct_time:select_unit, time_default:'Select Time'})
    }

    Time_onhandleChange(value,data){
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
        else if(this.state.unit_default === "Month"){
            for(var i=0;i<data.length;i++){
                // console.log(data[i].time_1.getMonth(), "vs" , value)
                if(String(data[i].month) === value){
                    data_select.push(data[i])
                }
            }
        }
        else{
            for(var i=0;i<data.length;i++){
                // console.log(data[i].time_1.getMonth(), "vs" , value)
                if(String(data[i].date) === value){
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
                <Select placeholder="Select Unit" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.unit_default} onChange={e => this.Unit_onhandleChange(e,this.date,this.week,this.month)}>
                    {this.state.unit.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                    ))}
                </Select>
                <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.time_default} onChange={e => this.Time_onhandleChange(e,this.data)}>
                    {this.state.distinct_time.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight[0]}>{flight[1]}</Option>
                    ))}
                </Select>
                {this.state.unit_default !== 'Select Unit' && this.state.time_default !== 'Select Time' ?
                <Button onClick={this.search}>Search</Button> : null}
                {/* <Button onClick={this.search}>Search</Button> */}
            </div>
            <div>
                {this.state.click === true ? 
                <Separate data={this.state.real}/>
                : null}
            </div>

        </div>
      );
    }
  }

  FileReader.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool,
    date: PropTypes.array,
    week: PropTypes.array,
    month: PropTypes.array
  };
  
  
  export default FileReader;