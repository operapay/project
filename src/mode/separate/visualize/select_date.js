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

const { Option } = Select;


class FileReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // csvfile: undefined,
            runway : [{lat:13.703669,long:100.743178}],
            arr: [{
                name:'',
                coords: [[]],
                date:'',
                time_1:'',
                time_2:'',
                aircraft:''
            }],
            distinct_time : [],
            distinct_name : [],
            data_point : [],
            select_date : false,
            date_name : [],
            time_flight : [],
            time_stamp : '',
            time_default : "Select Time",
            date_default : "Select Date",
            flight_default : "Select Flight",
            real : '00:00:00',
            click : false,
            pick : '00:00:00'
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
        var name = []
        this.setState({date_default:value,click:false})
        // console.log(data)
        for(var i=0;i<data.length;i++){
            // console.log(data[i].date, String(value))
            if(data[i].date === String(value)){
                data_select.push(data[i])
                // data_time.push(data[i].time_1.getHours())
                // console.log(data[i])
            }
        }

        name = this.closest(data_select,this.state.runway)
        // console.log('name',name)
        // console.log(data_time)
        // console.log(data_time.sort(function(a, b){return a-b}))
        var distinct = [...new Set(name.time)].sort(function(a, b){return a-b})

        this.setState({distinct_time : distinct, date_name:name.res, time_default:"Select Time",flight_default:"Select Flight",real:'00:00:00'})
    }

    Time_onhandleChange(value,data) {
        this.setState({time_default:value,click:false})
        var data_select = []
        var name = []
        for(var i=0;i<data.length;i++){
            if(data[i].time.getHours() === parseInt(value)){
                data_select.push(data[i])
            }
        }
        // console.log('data',data_select)
        // name = this.closest(data_select,this.state.runway)
        // console.log(name)
        this.setState({time_flight : data_select,distinct_name:data_select, flight_default:"Select Flight",real:'00:00:00'})
    }

    closest(array,point){
        var i=0;
        var j=0;
        var minDiff=1000000;
        // var distance;
        var res = [{name:'',time:'',data:[]}]
        var time = []
        for(i in array){
            var value = 0;
            var minDiff=1000000;
            for(j in array[i].coords){
                // console.log(point[j])
                var dis = this.distance(array[i].coords[j][1],array[i].coords[j][0],point[0].lat,point[0].long,"N")
                // console.log(dis)
                // var m=Math.abs(dis-array[i][0]);
                if(dis<minDiff){ 
                    minDiff=dis; 
                    value=array[i].coords[j][3]
                }
            }
            res[i].name = array[i].name
            res[i].time = value
            res[i].data = array[i]
            time.push(value.getHours())
            if(i < array.length-1){
                res.push({name:'',time:'',data:[]})
            }
        }
        // res = (num*value)/distance
        // distribute[param].data.push(res)
        return {res: res ,time:time};
    }

    onChange = time => {
        // console.log(time);
        this.setState({ time_stamp: time });
    };

    Flight_onhandleChange(value,data) {
        this.setState({flight_default:value,click:false})
        // console.log(value)
        var data_select;
        // var name = []

        for(var i=0;i<data.length;i++){
            if(data[i].name === value){
                data_select = data[i]
                break
            }
        }

        // data_select = this.closest(data,this.state.runway)
        // console.log(data_select)
        this.setState({real : data_select.time})
    }

    onChange_picktime(time) {
        // console.log(data)
        // console.log(time);
        // var test = moment(time).format("MM/DD/YYYY")+" " + timeString
        var time_pick = moment.utc(time).toDate();
        // console.log(moment(time_pick).format('HH:mm:ss'))
        this.setState({real : time_pick,click:false})
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
                <Select placeholder="Select Type" style={{ width: 400, fontSize: "1.2rem", paddingRight:"100 px" }} value={this.state.flight_default} onChange={e => this.Flight_onhandleChange(e,this.state.time_flight)}>
                    {this.state.distinct_name.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight.name}>{flight.name} time: {moment(flight.time).format('HH:mm:ss')} </Option>
                    ))}
                </Select>
                <TimePicker defaultValue={moment('00:00:00', 'HH:mm:ss')} value={moment(this.state.real, 'HH:mm:ss')} onChange={e => this.onChange_picktime(e)}/>
                <Button onClick={this.search}>Search</Button>
            </div>
            <div>
                {this.state.click === true ? 
                <Separate data={this.state.time_flight} time_pick={this.state.real}/>
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