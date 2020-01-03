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
            distinct_date : [],
            distinct_time : [],
            select_date : false,
            date_time : [],
            date_name : [],
            time_name : [],
            time_flight : [],
            check_data : false,
            time_default : "Select Time",
            unit_default : "Select Unit",
            flight_default : "Select Flight no",
            date_default : "Select Date",
            type_default : "Select Type",
            feature : ['Date','Flight no'],
            unit : ['Week','Month'],
            type : ['Departure','Arrival'],
            select_feature : "Date",
            real : [],
            click : false,
            checkbox : [],
            what_select : "Date"
            // checkedList: [],
        };
        this.data = props.data
        this.check = props.check
        this.date = props.date

        // this.getData = this.getData.bind(this);
    }

    search = () => {
        this.setState({ click: true });
    };

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
  
    Date_onhandleChange(value,data) {
        var data_select = []
        var data_time = []
        this.setState({date_default:value,click:false})
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

        this.setState({distinct_time : distinct, date_name:data_select, time_default:"Select Time",type_default:"Select Type"})
    }

    Time_onhandleChange(value,data) {
        this.setState({time_default:value,click:false})
        var data_select = []
        // console.log(data)
        for(var i=0;i<data.length;i++){
            if(data[i].time_1.getHours() === parseInt(value) || data[i].time_2.getHours() === parseInt(value)){
                data_select.push(data[i])
                // console.log(data[i])
            }
        }
        // console.log(data_select)
        this.setState({time_flight : data_select,type_default:"Select Type"})
    }

    Type_onhandleChange(value,data) {
        this.setState({type_default:value,click:false})
        var data_select = []
        var name = []

        // console.log(value)
        if(value === 'Departure'){
            for(var i=0;i<data.length;i++){
                // 13.6902099,100.7449953
                var dis = this.distance(13.6902099,100.7449953,data[i].coords[0][1], data[i].coords[0][0], "N")
                // console.log(dis)
                if(dis<=5){
                    // console.log('yes: ',dis)
                    data_select.push(data[i])
                    name.push(data[i].name)
                }
                // console.log(dis)
            }
        }
        else{
            for(var i=0;i<data.length;i++){
                // 13.6902099,100.7449953
                var dis = this.distance(13.6902099,100.7449953,data[i].coords[0][1], data[i].coords[0][0], "N")
                if(dis>5){
                    // console.log('yes: ',dis)
                    data_select.push(data[i])
                    name.push(data[i].name)
                }
                // console.log(dis)
            }
        }

        this.setState({real : data_select ,checkbox:name})

    }
  
    render(props) {
        // console.log(this.data)
      return (
        <div className="App">
            <div>
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
                <Select placeholder="Select Type" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.type_default} onChange={e => this.Type_onhandleChange(e,this.state.time_flight)}>
                    {this.state.type.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                    ))}
                </Select>
                <Button onClick={this.search}>Search</Button>
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
    date: PropTypes.array
  };
  
  
  export default FileReader;