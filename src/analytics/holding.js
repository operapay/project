import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import './holding.css'
import Papa from 'papaparse'
import { Select } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

class FileReader1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csvfile: undefined,
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
            status : true
        };

        this.test = props.data
        this.check = props.check

        this.getData = this.getData.bind(this);
        this.updateData = this.updateData.bind(this)
    }
    handleChange = event => {
        this.setState({
          csvfile: event.target.files[0],
        //   check: false
        });
    };
    

    importCSV = () => {
        const { csvfile } = this.state;
        Papa.parse(csvfile, {
          complete: this.updateData,
          header: true
        });
    };
    
    updateData(result) {
        var rawdata = result.data;
        this.setState({data : rawdata, status:false})
        // console.log('data:' , result.data)
        // this.forceUpdate();
    }
  
    componentWillMount(){
        if(this.check === true){
            this.getData(this.test)
            // this.importCSV()
        }
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
        // console.log('selct',selectdata)
        for(var i=0;i<selectdata.length-1;i++){
            if(selectdata[i+1] === '-'){
                check = false
                dis = 100000
                sum = 0
                if(count != 0){
                    avg.push(count)
                    count = 0
                    var timeEnd = new Date("01/01/2007 " + selectdata[i].time);
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
                    var timeStart = new Date("01/01/2007 " + selectdata[num].time);
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
        var res = this.alldata(value,this.state.data)
        for(var i=0;i<data.length;i++){
            if(data[i].name === value){
                data_select.push(data[i])
            }
        }
        var timeStart = new Date("01/01/2007 " + data_select[0].date[0][1]);
        var timeEnd = new Date("01/01/2007 " + data_select[0].date[data_select[0].date.length-1][1]);

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

    selectdata(flighthold,data){
        var data_holding = []
        for(var i=0;i<data.length;i++){
            for(var j=0;j<flighthold.length;j++){
                if(data[i].name === flighthold[j]){
                    data_holding.push(data[i])
                    // console.log(data[i].name)
                }
            }
        }
        // console.log(this.state.data_holding)
        this.setState({dataAll: data_holding});
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
        var arr = []
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
                this.state.arr[j].name = result[i].name
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
                arr.push(name)
            }
            // console.log(j)
            if(j < count-1){
                this.state.arr.push({name:'', coords: [[]], date:[[]]})
            }
        }
        // console.log(arr)
        //console.log(result.data)
        // this.setState({test: result.data});
        // console.log(this.state.arr)
        //this.test()
        this.setState({arr_select : arr})
        this.selectdata(arr,this.state.arr)
        // this.setState({dataAll: this.state.arr});
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
            <h2>Import reference .csv file</h2>
          <input
              className="csv-input"
              type="file"
              ref={input => {
              this.filesInput = input;
              }}
              name="file"
              placeholder={null}
              onChange={this.handleChange}
          />
          <p />
          <button onClick={this.importCSV}> Upload now!</button>
          <h1>Holding Analyze</h1>
            <Select placeholder="Select Flight" style={{ width: 300, fontSize: "1.2rem" }} onChange={e => this.onhandleChange(e,this.state.dataAll)} disabled={this.state.status}>
                {this.state.arr_select.map(flight => (
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
    check: PropTypes.bool
  };
  
  
  export default FileReader1;