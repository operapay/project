import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './offset.css'
import * as d3 from 'd3-request';
// import url from '../data/data_flight.csv';
//import url from '../data/data_arrival.csv';
import Papa from 'papaparse'
import echarts from 'echarts'
import { Select } from 'antd';
import PropTypes from 'prop-types';
// import 'antd/dist/antd.css';

const { Option } = Select;

class OffsetAnalyze extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csvfile: undefined,
            rawdata : null,
            select : "altitude",
            data : [],
            plot : [],
            arr : [{name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]}],
            avg_arr : {name:'avg', type: 'line',smooth: true,lineStyle:{color:'#CB4335'},showSymbol:false,data:[]},
            distribute3nmi : [],
            distribute5nmi : [],
            distribute8nmi : []
        };

        this.test = props.data
        // this.type = props.type

        this.getData = this.getData.bind(this);
        // this.updateData = this.updateData.bind(this);
    }

    componentWillMount(){
        this.getData()
    }

    onhandleChange(value) {
        this.setState({select : value})
        if (value == 'lateral'){
            this.data_lateral(this.test,value)
        }
        else{
            this.data_linegraph(this.test,value)
        }
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
            if (unit==="N") { dist = dist * 0.8684}
            // console.log('nmi') }
            return dist;
        }
    }

    distance_xy(x1,y1,x2,y2){
        var diff_x = Math.pow(x1-x2,2)
        var diff_y = Math.pow(y1-y2,2)
        return Math.pow(diff_x+diff_y, 0.5) 
    }

    interpolate(x1,y1,x2,y2,x){
        var diff = ((y2-y1)/(x2-x1))*(x-x1)
        var res = diff+y1
        return res
    }

    closest(array,num,distribute,param){
        var distance_min;
        var value_min;
        var distance_max;
        var value_max;
        var res;
        for(var i=1;i<array.length;i++){
            // console.log('arr' , array[i],array[i-1] , ' num:' , num)
            if(num > array[i][0] && num < array[i-1][0]){
                distance_min=array[i-1][0]; 
                value_min=array[i-1][1];
                distance_max=array[i][0]; 
                value_max=array[i][1];
            }
        }
        // console.log(distance_min,parseInt(value_min),distance_max,parseInt(value_max),num)
        res = this.interpolate(distance_min,parseInt(value_min),distance_max,parseInt(value_max),num)
        // console.log(res)
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

    // closest_xy(array,num,distribute,param){
    //     var distance_min;
    //     var value_min;
    //     var distance_max;
    //     var value_max;
    //     var x; var y; 
    //     var distance;
    //     var value;
    //     for(var i=1;i<array.length;i++){
    //         // console.log('arr' , array[i],array[i-1])
    //         if(num > array[i-1][0] && num < array[i][0]){
    //             distance_min=array[i-1][0]; 
    //             value_min=array[i-1][1];
    //             distance_max=array[i][0]; 
    //             value_max=array[i][1];
    //         }
    //         else{
    //             var A = Math.abs(num-array[i-1][0]);
    //             var B = Math.abs(num-array[i][0]);
    //             if(A <= B){
    //                 distance = array[i-1][0]
    //                 value = array[i-1][1]
    //             }else{
    //                 distance = array[i][0]
    //                 value = array[i][1]
    //             }
    //         }
    //     }

    //     if(value_min === undefined || value_max === undefined){
    //         x = (num*value[0])/distance
    //         y = (num*value[1])/distance
    //     }else{
    //         x = this.interpolate(distance_min,parseInt(value_min[0]),distance_max,parseInt(value_max[0]),num)
    //         y = this.interpolate(distance_min,parseInt(value_min[1]),distance_max,parseInt(value_max[1]),num)
    //     }
    //     distribute[param].x.push(x)
    //     distribute[param].y.push(y)
    //     distribute[param].data.push([x,y])
    //     // distribute[param].data.push(res)
    //     return distribute;
    // }

    init_arrdistribute(distribute){
        // distribute.push({dis:0,data:[]})
        for(var i=-1;i>=-17;i-=0.5){
            distribute.push({dis:i,data:[]})
        }
    }

    init_arrdistribute_xy(distribute){
        // distribute.push({dis:0,data:[]})
        for(var i=1;i<30;i+=1){
            distribute.push({dis:i,x:[],y:[],data:[]})
        }
    }

    average = list => list.reduce((prev, curr) => prev + curr) / list.length;

    data_lateral(result,value){
        // this.setState({arr : [{name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]}]})
        this.state.arr = [{name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]}]
        var long_origin = 100.743178;
        var lat_origin = 13.703669;
        var dist = [{name:'',data:[[]]}]
        var distribute = []
        this.init_arrdistribute_xy(distribute)

        for(var i=0;i<result.length;i++){
            var x = 0; var y = 0;
            for(var j=1;j<result[i].coords.length;j++){
            // for(var j=result[i].coords.length;j>1;j--){
                y = (((result[i].coords[j].lat - lat_origin)*(0.01745329251*6371))*0.539957)
                x = (((result[i].coords[j].long - long_origin)*(0.01745329251*6371)*Math.cos(result[i].coords[j].lat*0.01745329251))*0.539957)

                if( (y>-20 && y<2) && (x>-4 && x<12) ){
                    //console.log(i)
                    this.state.arr[i].data.push([])
                    this.state.arr[i].name = result[i].name
                    this.state.arr[i].data[j-1].push(x)
                    this.state.arr[i].data[j-1].push(y)
                    if(j > 0){
                        dist[i].name = result[i].name
                        dist[i].data.push([])
                        var dis = this.distance_xy(this.state.arr[i].data[j-1][0],x,this.state.arr[i].data[j-1][1],y)
                        dist[i].data[j].push(dis)
                        dist[i].data[j].push([x,y])
                    }
                }
            }
            // console.log(dist)
            for(var j=0;j<distribute.length;j++){
                this.closest_xy(dist[i].data,distribute[j].dis,distribute,j)
            }
            //console.log(distribute)
            if(i < result.length-1){
                this.state.arr.push({name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]})
                dist.push({name:'',data:[[]]})
            }
        }
        // console.log(distribute)
        this.state.avg_arr.data = []
        this.state.avg_arr.data.push([0,0])
        for(var i=0;i<distribute.length;i++){
            this.state.avg_arr.data.push([])
            this.state.avg_arr.data[i+1].push(this.average(distribute[i].x),this.average(distribute[i].y))
        }
        // console.log(this.state.avg_arr)
        this.state.arr.push(this.state.avg_arr)
        this.setState({data: this.state.arr})
        this.distributed(distribute,value,this.state.avg_arr)
        //console.log(this.state.data)
    }

    data_linegraph(result,value){
        // this.state.arr = []
        this.state.arr = [{name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]}]
        // this.setState({arr : [{name:'', type: 'line',smooth: true,showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]}]})
        var num = 1
        var list;
        var distribute = []
        this.init_arrdistribute(distribute)
        var arr_ref = [{data:[[]]}]
        // var name = result[0].name
        // var date = result[0].date
        // var count = this.uniqueNameFlight(name,result,date)
        // console.log('count',count)
        for(var i=0;i<result.length;i++){
            var ground = 0
            for(var j=result[i].coords.length-1;j>1;j--){
                ground = ground + this.distance(result[i].coords[j-1].lat, result[i].coords[j-1].long, result[i].coords[j].lat, result[i].coords[j].long, "N")
                if(j === result[i].coords.length-1){
                    this.state.arr[i].data.push([])
                    this.state.arr[i].name = result[i].name
                    // this.state.arr[j].type = 'line'
                    // this.state.arr[j].lineStyle = {color:'#A9CCE3'}
                    // this.state.arr[j].showSymbol = false
                    this.state.arr[i].data[(result[i].coords.length-1)-j].push(0) 
                    this.state.arr[i].data[(result[i].coords.length-1)-j].push(0) 
                    arr_ref[i].data[(result[i].coords.length-1)-j].push(0)
                    arr_ref[i].data[(result[i].coords.length-1)-j].push(0)
                }
                if(ground < 18){
                    this.state.arr[i].data.push([])
                    this.state.arr[i].name = result[i].name
                    this.state.arr[i].data[(result[i].coords.length-1)-j+1].push(ground*-1)
                    if (value === 'speed')
                        this.state.arr[i].data[(result[i].coords.length-1)-j+1].push(result[i].coords[j].speed)
                    else
                        this.state.arr[i].data[(result[i].coords.length-1)-j+1].push(result[i].coords[j].altitude_ft) 
                    //console.log(this.state.arr)
                }
                if(ground < 30){
                    arr_ref[i].data.push([])
                    arr_ref[i].data[(result[i].coords.length-1)-j+1].push(ground*-1)
                    if (value === 'speed')
                        arr_ref[i].data[(result[i].coords.length-1)-j+1].push(result[i].coords[j].speed)
                    else
                        arr_ref[i].data[(result[i].coords.length-1)-j+1].push(result[i].coords[j].altitude_ft) 
                    //console.log(this.state.arr)
                }
            }
            // console.log(arr_ref)
            for(var j=0;j<distribute.length;j++){
                // console.log(distribute[j].dis)
                this.closest(arr_ref[i].data,distribute[j].dis,distribute,j)
            }
            if(i < result.length-1){
                this.state.arr.push({name:'', type: 'line',showSymbol:false,lineStyle:{color:'#A9CCE3'},data: [[]]})
                arr_ref.push({data:[[]]})
            }
        }
        
        console.log('arr', this.state.arr)
        this.state.avg_arr.data = []
        this.state.avg_arr.data.push([0,0])
        for(var i=0;i<distribute.length;i++){
            // average(distribute[i].data)
            this.state.avg_arr.data.push([])
            this.state.avg_arr.data[i+1].push(distribute[i].dis,this.average(distribute[i].data))
        }
        this.state.arr.push(this.state.avg_arr)
        this.setState({data: this.state.arr});
        console.log(this.state.arr)
        this.distributed(distribute,value,this.state.avg_arr)
        console.log('distribute', distribute)
    }

    distributed(distribute,value,avg){
        var altitude = [4,8,14]
        var lateral = [2,4,7]
        if (value === "speed"){
            for(var j=0;j<3;j++){
                var altitude_nmi = [['0-50',0],['50-100',0],['100-150',0],['150-200',0],['200-250',0],['250-300',0]]
                for(var i=0;i<distribute[altitude[j]].data.length;i++){
                    if(distribute[altitude[j]].data[i] >= 0 && distribute[altitude[j]].data[i] < 50) altitude_nmi[0][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 50 && distribute[altitude[j]].data[i] < 100) altitude_nmi[1][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 100 && distribute[altitude[j]].data[i] < 150) altitude_nmi[2][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 150 && distribute[altitude[j]].data[i] < 200) altitude_nmi[3][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 200 && distribute[altitude[j]].data[i] < 250) altitude_nmi[4][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 250 && distribute[altitude[j]].data[i] < 300) altitude_nmi[5][1] += 1;
                }
                if(j === 0) this.setState({distribute3nmi : altitude_nmi})
                else if (j === 1) this.setState({distribute5nmi : altitude_nmi})
                else if (j === 2) this.setState({distribute8nmi : altitude_nmi})
            }
        }
        else if (value === "lateral"){
            var dist
            for(var j=0;j<3;j++){
                var lateral_nmi = [['-4,-3',0],['-3,-2',0],['-2,-1',0],['-1,0',0],['0,1',0],['1,2',0],['2,3',0],['3,4',0]]
                for(var i=0;i<distribute[lateral[j]].data.length;i++){
                    dist = this.distance_xy(avg.data[lateral[j]+1][0],avg.data[lateral[j]+1][1],distribute[lateral[j]].data[i][0],distribute[lateral[j]].data[i][1])
                    // console.log(j , '=' ,dist, "y1 ", avg.data[lateral[j]+1][1] , 'y2 ' , distribute[lateral[j]].data[i][1])
                    if(dist >= 3 && dist < 4 && distribute[lateral[j]].data[i][1] < avg.data[lateral[j]+1][1]) lateral_nmi[0][1] += 1;
                    else if(dist >= 2 && dist < 3 && distribute[lateral[j]].data[i][1] < avg.data[lateral[j]+1][1]) lateral_nmi[1][1] += 1;
                    else if(dist >= 1 && dist < 2 && distribute[lateral[j]].data[i][1] < avg.data[lateral[j]+1][1]) lateral_nmi[2][1] += 1;
                    else if(dist >= 0 && dist < 1 && distribute[lateral[j]].data[i][1] < avg.data[lateral[j]+1][1]) lateral_nmi[3][1] += 1;
                    else if(dist >= 0 && dist < 1 && distribute[lateral[j]].data[i][1] >= avg.data[lateral[j]+1][1]) lateral_nmi[4][1] += 1;
                    else if(dist >= 1 && dist < 2 && distribute[lateral[j]].data[i][1] >= avg.data[lateral[j]+1][1]) lateral_nmi[5][1] += 1;
                    else if(dist >= 2 && dist < 3 && distribute[lateral[j]].data[i][1] >= avg.data[lateral[j]+1][1]) lateral_nmi[6][1] += 1;
                    else if(dist >= 3 && dist < 4 && distribute[lateral[j]].data[i][1] >= avg.data[lateral[j]+1][1]) lateral_nmi[7][1] += 1;
                }
                if(j === 0) this.setState({distribute3nmi : lateral_nmi})
                else if (j === 1) this.setState({distribute5nmi : lateral_nmi})
                else if (j === 2) this.setState({distribute8nmi : lateral_nmi})
            }
        }
        else{
            for(var j=0;j<3;j++){
                var altitude_nmi = [['0-500',0],['500-1000',0],['1000-1500',0],['1500-2000',0],['2000-2500',0],['2500-3000',0],['3000-3500',0],['3500-4000',0],
            ['4000-4500',0],['4500-5000',0],['5000-5500',0],['5500-6000',0]]
                for(var i=0;i<distribute[altitude[j]].data.length;i++){
                    if(distribute[altitude[j]].data[i] >= 0 && distribute[altitude[j]].data[i] < 500) altitude_nmi[0][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 500 && distribute[altitude[j]].data[i] < 1000) altitude_nmi[1][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 1000 && distribute[altitude[j]].data[i] < 1500) altitude_nmi[2][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 1500 && distribute[altitude[j]].data[i] < 2000) altitude_nmi[3][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 2000 && distribute[altitude[j]].data[i] < 2500) altitude_nmi[4][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 2500 && distribute[altitude[j]].data[i] < 3000) altitude_nmi[5][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 3000 && distribute[altitude[j]].data[i] < 3500) altitude_nmi[6][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 3500 && distribute[altitude[j]].data[i] < 4000) altitude_nmi[7][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 4000 && distribute[altitude[j]].data[i] < 4500) altitude_nmi[8][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 4500 && distribute[altitude[j]].data[i] < 5000) altitude_nmi[9][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 5000 && distribute[altitude[j]].data[i] < 5500) altitude_nmi[10][1] += 1;
                    else if(distribute[altitude[j]].data[i] >= 5500 && distribute[altitude[j]].data[i] < 6000) altitude_nmi[11][1] += 1;
                }
                if(j === 0) this.setState({distribute3nmi : altitude_nmi})
                else if (j === 1) this.setState({distribute5nmi : altitude_nmi})
                else if (j === 2) this.setState({distribute8nmi : altitude_nmi})
            }
        }
    }

    getData() {
        // console.log(this.test)
        this.data_linegraph(this.test,0)
    }

    getOption = () => ({
        // title: {
        //     text: 'Departure ' + this.state.select
        // },
        tooltip: {
           trigger: 'axis'
        }, 
        // grid: {
        //     left: '3%',
        //     right: '4%',
        //     bottom: '3%',
        //     containLabel: true
        // },
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
            name: 'ground distance (nmi)',
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle: {
                fontSize: 20
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 20,
            }
        },
        yAxis: {
            type: 'value',
            name: this.state.select,
            nameLocation: 'center',
            nameGap: 90,
            nameTextStyle: {
                fontSize: 20
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 20,
            }
        },
        series: this.state.data
    });

    Option3nmi = () => ({
        title: {
            text: 'distribution of ' + this.state.select + ' at -3 nmi'
        },
        xAxis: {
            type: 'category',
            name: this.state.select,
            nameLocation: 'center',
            nameGap: 40,
            nameTextStyle: {
                fontSize: 20
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 15,
            }
        },
        yAxis: {
            type: 'value',
            name: 'number of flight',
            nameLocation: 'center',
            nameGap: 50,
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
                data: this.state.distribute3nmi,
                type: 'bar',
            }
        ]      
    });

    Option5nmi = () => ({
        title: {
            text: 'distribution of ' + this.state.select + ' at -5 nmi'
        },
        xAxis: {
            type: 'category',
            name: this.state.select,
            nameLocation: 'center',
            nameGap: 40,
            nameTextStyle: {
                fontSize: 20
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 15,
            }
        },
        yAxis: {
            type: 'value',
            name: 'number of flight',
            nameLocation: 'center',
            nameGap: 50,
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
                data: this.state.distribute5nmi,
                type: 'bar',
            }
        ]      
    });

    Option8nmi = () => ({
        title: {
            text: 'distribution of ' + this.state.select + ' at -8 nmi'
        },
        xAxis: {
            type: 'category',
            name: this.state.select,
            nameLocation: 'center',
            nameGap: 40,
            nameTextStyle: {
                fontSize: 20
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                inside: false,
                fontSize: 15,
            }
        },
        yAxis: {
            type: 'value',
            name: 'number of flight',
            nameLocation: 'center',
            nameGap: 50,
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
                data: this.state.distribute8nmi,
                type: 'bar',
            }
        ]      
    });

    render(props) {
    //   console.log(this.state.data);
      return (
        <div className="App">
            <h1>Offset Analytics</h1>
                <Select defaultValue="altitude" style={{ width: 300, fontSize: "1.2rem" }} onChange={e => this.onhandleChange(e)}>
                    <Option value="altitude" style={{ fontSize: "1rem" }}>Altitude</Option>
                    <Option value="lateral" style={{ fontSize: "1rem" }}>Lateral</Option>
                    <Option value="speed" style={{ fontSize: "1rem" }}>Speed</Option>
                </Select>
                <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
                <ReactEcharts option={this.Option3nmi()} style={{width:1500, height:500}} />
                <ReactEcharts option={this.Option5nmi()} style={{width:1500, height:500}} />
                <ReactEcharts option={this.Option8nmi()} style={{width:1500, height:500}} />
        </div>
      );
    }
  }
  
  OffsetAnalyze.propTypes = {
    data: PropTypes.array
    // type: PropTypes.string
  };

  export default OffsetAnalyze;