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
            distribute3nmi : [],
            distribute5nmi : [],
            distribute8nmi : []
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
        this.distributed(distribute)
        // console.log('distribute', distribute)
    }

    distributed(distribute){
        var arr3nmi = [0,0,0,0,0,0,0,0,0,0,0,0]
        var arr5nmi = [0,0,0,0,0,0,0,0,0,0,0,0]
        var arr8nmi = [0,0,0,0,0,0,0,0,0,0,0,0]
        for(var i=0;i<distribute[4].data.length;i++){
            if(distribute[4].data[i] >= 0 && distribute[4].data[i] < 500) arr3nmi[0] += 1;
            else if(distribute[4].data[i] >= 500 && distribute[4].data[i] < 1000) arr3nmi[1] += 1;
            else if(distribute[4].data[i] >= 1000 && distribute[4].data[i] < 1500) arr3nmi[2] += 1;
            else if(distribute[4].data[i] >= 1500 && distribute[4].data[i] < 2000) arr3nmi[3] += 1;
            else if(distribute[4].data[i] >= 2000 && distribute[4].data[i] < 2500) arr3nmi[4] += 1;
            else if(distribute[4].data[i] >= 2500 && distribute[4].data[i] < 3000) arr3nmi[5] += 1;
            else if(distribute[4].data[i] >= 3000 && distribute[4].data[i] < 3500) arr3nmi[6] += 1;
            else if(distribute[4].data[i] >= 3500 && distribute[4].data[i] < 4000) arr3nmi[7] += 1;
            else if(distribute[4].data[i] >= 4000 && distribute[4].data[i] < 4500) arr3nmi[8] += 1;
            else if(distribute[4].data[i] >= 4500 && distribute[4].data[i] < 5000) arr3nmi[9] += 1;
            else if(distribute[4].data[i] >= 5000 && distribute[4].data[i] < 5500) arr3nmi[10] += 1;
            else if(distribute[4].data[i] >= 5500 && distribute[4].data[i] < 6000) arr3nmi[11] += 1;
        }
        for(var i=0;i<distribute[8].data.length;i++){
            if(distribute[8].data[i] >= 0 && distribute[8].data[i] < 500) arr5nmi[0] += 1;
            else if(distribute[8].data[i] >= 500 && distribute[8].data[i] < 1000) arr5nmi[1] += 1;
            else if(distribute[8].data[i] >= 1000 && distribute[8].data[i] < 1500) arr5nmi[2] += 1;
            else if(distribute[8].data[i] >= 1500 && distribute[8].data[i] < 2000) arr5nmi[3] += 1;
            else if(distribute[8].data[i] >= 2000 && distribute[8].data[i] < 2500) arr5nmi[4] += 1;
            else if(distribute[8].data[i] >= 2500 && distribute[8].data[i] < 3000) arr5nmi[5] += 1;
            else if(distribute[8].data[i] >= 3000 && distribute[8].data[i] < 3500) arr5nmi[6] += 1;
            else if(distribute[8].data[i] >= 3500 && distribute[8].data[i] < 4000) arr5nmi[7] += 1;
            else if(distribute[8].data[i] >= 4000 && distribute[8].data[i] < 4500) arr5nmi[8] += 1;
            else if(distribute[8].data[i] >= 4500 && distribute[8].data[i] < 5000) arr5nmi[9] += 1;
            else if(distribute[8].data[i] >= 5000 && distribute[8].data[i] < 5500) arr5nmi[10] += 1;
            else if(distribute[8].data[i] >= 5500 && distribute[8].data[i] < 6000) arr5nmi[11] += 1;
        }
        for(var i=0;i<distribute[14].data.length;i++){
            if(distribute[14].data[i] >= 0 && distribute[14].data[i] < 500) arr8nmi[0] += 1;
            else if(distribute[14].data[i] >= 500 && distribute[14].data[i] < 1000) arr8nmi[1] += 1;
            else if(distribute[14].data[i] >= 1000 && distribute[14].data[i] < 1500) arr8nmi[2] += 1;
            else if(distribute[14].data[i] >= 1500 && distribute[14].data[i] < 2000) arr8nmi[3] += 1;
            else if(distribute[14].data[i] >= 2000 && distribute[14].data[i] < 2500) arr8nmi[4] += 1;
            else if(distribute[14].data[i] >= 2500 && distribute[14].data[i] < 3000) arr8nmi[5] += 1;
            else if(distribute[14].data[i] >= 3000 && distribute[14].data[i] < 3500) arr8nmi[6] += 1;
            else if(distribute[14].data[i] >= 3500 && distribute[14].data[i] < 4000) arr8nmi[7] += 1;
            else if(distribute[14].data[i] >= 4000 && distribute[14].data[i] < 4500) arr8nmi[8] += 1;
            else if(distribute[14].data[i] >= 4500 && distribute[14].data[i] < 5000) arr8nmi[9] += 1;
            else if(distribute[14].data[i] >= 5000 && distribute[14].data[i] < 5500) arr8nmi[10] += 1;
            else if(distribute[14].data[i] >= 5500 && distribute[14].data[i] < 6000) arr8nmi[11] += 1;
        }
        this.setState({distribute3nmi : arr3nmi , distribute5nmi : arr5nmi , distribute8nmi : arr8nmi})
        // console.log(this.state.distribute3nmi)
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

    Option3nmi = () => ({
        xAxis: {
            type: 'category',
            data: ['0-500','500-1000','1000-1500','1500-2000','2000-2500','2500-3000','3000-3500','3500-4000',
            '4000-4500','4500-5000','5000-5500','5500-6000'],
            name: 'ground distance (nmi)',
            nameLocation: 'center',
            nameGap: 50,
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
        xAxis: {
            type: 'category',
            data: ['0-500','500-1000','1000-1500','1500-2000','2000-2500','2500-3000','3000-3500','3500-4000',
            '4000-4500','4500-5000','5000-5500','5500-6000'],
            name: 'ground distance (nmi)',
            nameLocation: 'center',
            nameGap: 50,
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
        xAxis: {
            type: 'category',
            data: ['0-500','500-1000','1000-1500','1500-2000','2000-2500','2500-3000','3000-3500','3500-4000',
            '4000-4500','4500-5000','5000-5500','5500-6000'],
            name: 'ground distance (nmi)',
            nameLocation: 'center',
            nameGap: 50,
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
                <ReactEcharts option={this.Option3nmi()} style={{width:1500, height:700}} />
                <ReactEcharts option={this.Option5nmi()} style={{width:1500, height:700}} />
                <ReactEcharts option={this.Option8nmi()} style={{width:1500, height:700}} />
            </React.Fragment>
        );
    }
}
export default Flightpath;