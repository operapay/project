import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import './offset.css'
import url from '../data/data_flight.csv';
import Papa from 'papaparse'
import 'antd/dist/antd.css';
import { Select } from 'antd';

const { Option } = Select;

class Flightpath extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rawdata : null,
            select : "Attitude",
            data : [],
            arr : [{name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]}],
            avg_arr : {name:'avg', type: 'line',smooth: true,lineStyle:{color:'#CB4335'},showSymbol:false,data:[]},
        };

        this.getData = this.getData.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        this.getCsvData();
    }

    handleChange(value) {
        this.setState({select : value})
        if (value == 'Lateral'){
            this.data_lateral(this.state.rawdata)
        }
        else{
            this.data_linegraph(this.state.rawdata,value)
        }
    }

    fetchCsv() {
        return fetch(url).then(function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');

            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
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
            console.log('nmi') }
            return dist;
        }
    }

    distance_xy(x1,y1,x2,y2){
        var diff_x = Math.pow(x1-x2,2)
        var diff_y = Math.pow(y1-y2,2)
        return Math.pow(diff_x+diff_y, 0.5)
        
    }

    closest(array,num,distribute,param){
        var i=0;
        var minDiff=1000;
        var distance;
        var value;
        var res;
        for(i in array){
            //console.log('i',array[0][i])
            var m=Math.abs(num-array[i][0]);
            if(m<minDiff){ 
                    minDiff=m; 
                    distance=array[i][0]; 
                    value=array[i][1];
                }
        }
        res = (num*value)/distance
        distribute[param].data.push(res)
        return distribute;
    }

    closest_xy(array,num,distribute,param){
        var i=0;
        var minDiff=1000;
        var distance;
        var value;
        var x;
        var y;
        for(i in array){
            //console.log('i',array[0][i])
            var m=Math.abs(num-array[i][0]);
            if(m<minDiff){ 
                    minDiff=m; 
                    distance=array[i][0]; 
                    value=array[i][1];
                }
        }
        x = (num*value[0])/distance
        y = (num*value[1])/distance
        distribute[param].x.push(x)
        distribute[param].y.push(y)
        distribute[param].data.push([x,y])
        return distribute;
    }

    init_arrdistribute(distribute){
        // distribute.push({dis:0,data:[]})
        for(var i=1;i<=15;i+=0.5){
            distribute.push({dis:i,data:[]})
        }
    }

    init_arrdistribute_xy(distribute){
        // distribute.push({dis:0,data:[]})
        for(var i=1;i<30;i+=2){
            distribute.push({dis:i,x:[],y:[],data:[]})
        }
    }

    average = list => list.reduce((prev, curr) => prev + curr) / list.length;

    data_lateral(result){
        this.state.arr = [{name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]}]
        var num = 1
        var long_origin = 100.7541404;
        var lat_origin = 13.6993272;
        var dist = [{name:'',data:[[]]}]
        var distribute = []
        this.init_arrdistribute_xy(distribute)
        var name = result.data[num][1]
        var date = result.data[num][2]
        var count = this.uniqueNameFlight(name,result.data,date)
        for(var j=0;j<count;j++){
            var x = 0; var y = 0;
            for(var i=num;i<=result.data.length;i++){
                if(result.data[i][1] === '-'){
                    num = i+1
                    //console.log('break')
                    //name = result.data[i][1]
                    this.state.arr[j].data.pop()
                    break;
                }
                y = (((result.data[i][5] - lat_origin)*(0.01745329251*6371))*0.539957)
                x = (((result.data[i][4] - long_origin)*(0.01745329251*6371)*Math.cos(result.data[i][5]*0.01745329251))*0.539957)

                if( (y>-20 && y<2) && (x>-4 && x<12) ){
                    //console.log(i)
                    this.state.arr[j].data.push([])
                    this.state.arr[j].name = result.data[i][1]
                    this.state.arr[j].data[i-num].push(x)
                    this.state.arr[j].data[i-num].push(y)
                    if(i-num > 0){
                        dist[j].name = result.data[i][1]
                        dist[j].data.push([])
                        var dis = this.distance_xy(this.state.arr[j].data[i-num-1][0],x,this.state.arr[j].data[i-num-1][1],y)
                        dist[j].data[i-num].push(dis)
                        dist[j].data[i-num].push([x,y])
                    }
                }
            }
            //console.log(dist)
            for(var i=0;i<distribute.length;i++){
                this.closest_xy(dist[j].data,distribute[i].dis,distribute,i)
            }
            //console.log(distribute)
            if(j < count-1){
                this.state.arr.push({name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]})
                dist.push({name:'',data:[[]]})
            }
        }
        console.log(distribute)
        this.state.avg_arr.data = []
        this.state.avg_arr.data.push([0,0])
        for(var i=0;i<distribute.length;i++){
            this.state.avg_arr.data.push([])
            this.state.avg_arr.data[i+1].push(this.average(distribute[i].x),this.average(distribute[i].y))
        }
        console.log(this.state.avg_arr)
        this.state.arr.push(this.state.avg_arr)
        this.setState({data: this.state.arr});
        //console.log(this.state.data)
    }

    data_linegraph(result,value){
        this.state.arr = [{name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]}]
        var num = 2
        var list;
        var distribute = []
        this.init_arrdistribute(distribute)
        var name = result.data[1][1]
        var date = result.data[1][2]
        var count = this.uniqueNameFlight(name,result.data,date)
        for(var j=0;j<count;j++){
            var ground = 0
            for(var i=num;i<=result.data.length;i++){
                ground = ground + this.distance(result.data[i-1][5], result.data[i-1][4], result.data[i][5], result.data[i][4], "N")
                if(result.data[i][1] === '-'){
                    num = i+2
                    //name = result.data[i][1]
                    this.state.arr[j].data.pop()
                    break;
                }
                if(i-num === 0){
                    this.state.arr[j].data.push([])
                    this.state.arr[j].name = result.data[i][1]
                    // this.state.arr[j].type = 'line'
                    // this.state.arr[j].lineStyle = {color:'#A9CCE3'}
                    // this.state.arr[j].showSymbol = false
                    this.state.arr[j].data[i-num].push(0) 
                    this.state.arr[j].data[i-num].push(0) 
                }
                if(ground < 15){
                    this.state.arr[j].data.push([])
                    this.state.arr[j].name = result.data[i][1]
                    this.state.arr[j].data[i-num+1].push(ground)
                    if (value === 'Speed')
                        this.state.arr[j].data[i-num+1].push(result.data[i][8])
                    else
                        this.state.arr[j].data[i-num+1].push(result.data[i][7]) 
                    //console.log(this.state.arr)
                }
            }
            for(var i=0;i<distribute.length;i++){
                this.closest(this.state.arr[j].data,distribute[i].dis,distribute,i)
            }
            if(j < count-1){
                this.state.arr.push({name:'', type: 'line',showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]})
            }
        }
        this.state.avg_arr.data = []
        this.state.avg_arr.data.push([0,0])
        for(var i=0;i<distribute.length;i++){
            // average(distribute[i].data)
            this.state.avg_arr.data.push([])
            this.state.avg_arr.data[i+1].push(distribute[i].dis,this.average(distribute[i].data))
        }
        this.state.arr.push(this.state.avg_arr)
        //console.log(this.state.arr)
        this.setState({data: this.state.arr});
        //console.log(this.state.data)
    }

    uniqueNameFlight(name,data,date){
        var count = 0
        for(var i=1;i<data.length;i++){
            if (data[i][1] === '-'){
                count += 1
                //console.log(i)
            }
        }
        return count
    }

    getData(result) {
        this.setState({rawdata: result});
        this.data_linegraph(this.state.rawdata)
    }


    async getCsvData() {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.getData
        });
    }
    
    getOption = () => ({
        title: {
            text: 'Departure ' + this.state.select
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    show: true,
                    title: 'Save As Image'
                },
                dataView: {
                    show: true,
                    title: 'Data View'
                },
            }
        },
        xAxis: {
            type: 'value',
        },
        yAxis: {
            type: 'value'
        },
        series: this.state.data
    });

    
    render() {
        return (
            <React.Fragment>
                <p>Offset Analytics</p>
                <Select defaultValue="Attitude" style={{ width: 120 }} onChange={this.handleChange}>
                    <Option value="Attitude">Attitude</Option>
                    <Option value="Lateral">Lateral</Option>
                    <Option value="Speed">Speed</Option>
                </Select>
                <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
            </React.Fragment>
        );
    }
}
export default Flightpath;