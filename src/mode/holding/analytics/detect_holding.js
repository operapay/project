import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './holding.css'
import { Select,Checkbox,Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Selectdata from './select_data'


class FileReader2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // csvfile: undefined,
            dataAll : [{name:'', coords: [['', '', '']],date:'',time_1:'',time_2:''}],
            arr: [{
                name:'',
                coords: [[]],
                date:'',
                time_1:'',
                time_2:''
            }],
            distinct_name : [],

        };
        this.test = props.data
        this.check = props.status
        this.dataref = props.dataref

        this.getData = this.getData.bind(this);
        // this.updateData = this.updateData.bind(this);
    }
  
    componentWillMount(){
        if(this.check === false){
            this.getData(this.test)
        }
        // console.log('mount')
        // console.log(this.check)
        // console.log(this.test)
    }

    componentWillUpdate(nextPorps){
        if(nextPorps.check !== this.check && nextPorps.test !== this.test){
            console.log(this.check , 'next ', nextPorps.check )
            if(this.check === false){
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

    getData(result) {
        this.state.arr = [{
            name:'',
            coords: [[]],
            date: [[]]
        }]
        // console.log(result.length)
        var num = 0
        var name = result[0].name
        var date = result[0].name
        var count = this.uniqueNameFlight(name,result,date)
        var dis = 100000
        var arr_name = []
        var check = false
        var sum = 0
        var dist
        console.log(count)

        for(var j=0;j<count;j++){
            dis = 100000
            check = false
            sum = 0
            for(var i=num;i<=result.length;i++){
                // console.log(num)
                if(result[i].name === '-'){
                    num = i+1
                    //name = result.data[i][1]
                    this.state.arr[j].coords.pop()
                    this.state.arr[j].date.pop()
                    break;
                }
                this.state.arr[j].coords.push([])
                this.state.arr[j].date.push([])
                // this.state.arr[j].name = result[i].name
                this.state.arr[j].coords[i-num].push(result[i].long)
                this.state.arr[j].coords[i-num].push(result[i].lat)
                this.state.arr[j].coords[i-num].push(result[i].attitude)
                this.state.arr[j].date[i-num].push(result[i].date)
                this.state.arr[j].date[i-num].push(result[i].time)
                if(check === false){
                    dist = this.distance(13.6567,100.7518,result[i].lat,result[i].long,"N")
                    if(dist > dis && (dist > 30 & dist < 50)){
                        // console.log(result.data[i][1]," ", dist)
                        sum = sum + 1
                        if(sum > 15){
                            // console.log(sum)
                            check = true
                            name = result[i].name
                        }
                        
                    }
                    dis = this.distance(13.6567,100.7518,result[i].lat,result[i].long,"N")
                    // console.log(result.data[i][1]," ", this.distance(13.6567,100.7518,result.data[i][5],result.data[i][4],"N"))
                }
            }
            if(check === true){
                this.state.arr[j].name = name
                arr_name.push(name)
                // arr_date.push(local)
                // console.log(name, ':' ,time_first, ' & ', time_last)
            }
            if(j < count-1){
                this.state.arr.push({name:'', coords: [[]], date:[[]]})
            }
        }

        var distinctName = [...new Set(arr_name)]
        this.setState({dataAll: this.state.arr, distinct_name:distinctName});
    }

  
    render(props) {
      console.log(this.dataref);
      return (
        <div className="App">
          <h1>Holding Analyze</h1>
          <Selectdata data={this.state.dataAll} name={this.state.distinct_name} dataref={this.dataref}/>
        </div>
      );
    }
  }
  FileReader2.propTypes = {
    data: PropTypes.array,
    status: PropTypes.bool,
    dataref: PropTypes.array
  };
  
  
  export default FileReader2;