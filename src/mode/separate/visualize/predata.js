import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './select.css'
import { Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import SelectDate from './select_date';
// import SelectFlight from './select_flight';

const { Option } = Select;


class FileReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // csvfile: undefined,
            dataAll : [{name:'', coords: [['', '', '']],date:'',aircraft:''}],
            arr: [{
                name:'',
                coords: [[]],
                date:'',
                aircraft:''
            }],
            distinct_date : [],
            distinct_time : [],
            select_date : false,
            date_time : [],
            date_name : [],
            time_name : [],
            time_flight : [],
            check_data : false,
            distinct_name : []
        };
        this.test = props.data
        this.check = props.check

        this.getData = this.getData.bind(this);
    }
  

    componentWillMount(){
        if(this.check === true){
            this.getData(this.test)
        }

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
        // console.log(data.length)
        for(var i=1;i<data.length;i++){
            if (data[i].name === '-'){
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
            if (unit==="N") { dist = dist * 0.8684
            // console.log('nmi') 
            }
            return dist;
        }
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
        var dataall_name = []
        var data_check_time_date = []
        // console.log(count)

        for(var j=0;j<count;j++){
            //console.log(j)
            // console.log(mydate)
            // dataall_name.push(result[num].name)
            for(var i=num;i<=result.length;i++){
                var mydate = moment(String(result[i].date), 'YYYY-MM-DD');
                // console.log(num)
                if(result[i].name === '-'){
                    let dis = this.distance(13.6902099,100.7449953,result[num].lat, result[num].long, "N")
                    let dis2 = this.distance(13.6902099,100.7449953,result[i-1].lat, result[i-1].long, "N")
                    // console.log('dis',dis,dis2)
                    var mydate1 = moment(String(result[i-1].date), 'YYYY-MM-DD');
                    var test1 = moment(mydate1).format("MM/DD/YYYY")+" " + result[i-1].time
                    var time1 = moment(test1).toDate();
                    var local = moment(time1).format('DD/MM/YYYY');

                    // console.log(local,dis,dis2)
                    if(dis > dis2) {
                        dataall_date.push(local)
                    }
                    //console.log(time1)
                    // dataall_date.push(local)
                    // var test2 = moment(mydate).format("MM/DD/YYYY")+" " + result[i-1].time
                    // var time2 = moment.utc(test2).toDate();
                    this.state.arr[j].date = local
                    // this.state.arr[j].time_1 = time1
                    // this.state.arr[j].time_2 = time2
                    // this.state.arr[j].aircraft = week
                    // data_check_time_date.push({name: result[num].name,date: date,time_1:time1,time_2:time2})
                    num = i+1
                    //name = result.data[i][1]
                    this.state.arr[j].coords.pop()
                    break;
                }
                this.state.arr[j].coords.push([])
                this.state.arr[j].name = result[i].name
                this.state.arr[j].aircraft = result[i].aircraft
                var test = moment(mydate).format("MM/DD/YYYY")+" " + result[i].time
                var time = moment(test).toDate();
                // console.log(time)
                this.state.arr[j].coords[i-num].push(result[i].long)
                this.state.arr[j].coords[i-num].push(result[i].lat)
                this.state.arr[j].coords[i-num].push(result[i].altitude_ft*0.3048)
                this.state.arr[j].coords[i-num].push(time)
            }
            // console.log(j)
            if(j < count-1){
                this.state.arr.push({name:'', coords: [[]],date:'',aircraft:''})
            }
        }

        var distinct = [...new Set(dataall_date)]
        // var distinctName = [...new Set(dataall_name)]
        distinct.sort(function(a, b){
            var aa = a.split('/').reverse().join(),
                bb = b.split('/').reverse().join();
            return aa < bb ? -1 : (aa > bb ? 1 : 0);
        });

        this.setState({dataAll: this.state.arr,distinct_date:distinct});
    }
  
    render(props) {
      return (
        <div className="App">
            <h1 style={{color:'#b47b44', margin:'1% 0 1% 0'}}>Separate Visualization</h1>
            <SelectDate check={this.state.check} data={this.state.dataAll} date={this.state.distinct_date}/>
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