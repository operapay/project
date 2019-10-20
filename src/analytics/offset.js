import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './offset.css'
import * as d3 from 'd3-request';
import url from '../data/data_flight.csv';
import Papa from 'papaparse'
import echarts from 'echarts'


class Flightpath extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data : [{name:'', type: 'line',showSymbol:false,data: [[]]}],
            arr : [{name:'', type: 'line',showSymbol:false,data: [[]]}]
        };

        this.getData = this.getData.bind(this);
        // this.renderItem = this.renderItem.bind(this)
    }

    componentWillMount() {
        this.getCsvData();
        // console.log(this.distance(13.692002, 100.75988, 13.48842, 100.7064, "N"))
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

    uniqueNameFlight(name,data,date){
        var count = 0
        for(var i=1;i<data.length;i++){
            if (data[i][1] === '-'){
                count += 1
                console.log(i)
            }
        }
        return count
    }

    getData(result) {
        var num = 2
        var name = result.data[1][1]
        var date = result.data[1][1]
        var count = this.uniqueNameFlight(name,result.data,date)
        for(var j=0;j<count;j++){
            for(var i=num;i<=result.data.length;i++){
                var ground = this.distance(result.data[num][5], result.data[num][4], result.data[i][5], result.data[i][4], "N")
                if(result.data[i][1] === '-'){
                    num = i+1
                    //name = result.data[i][1]
                    this.state.arr[j].data.pop()
                    break;
                }
                if(ground <= 12){
                    this.state.arr[j].data.push([])
                    this.state.arr[j].name = result.data[i][1]
                    this.state.arr[j].type = 'line'
                    this.state.arr[j].showSymbol = false
                    // this.state.arr[j].data[i-num].push(result.data[i][7])
                    // var ground = this.distance(result.data[num][5], result.data[num][4], result.data[i][5], result.data[i][4], "N")
                    this.state.arr[j].data[i-num].push(ground)
                    this.state.arr[j].data[i-num].push(result.data[i][7])
                }
            }
            // console.log(j)
            if(j < count-1){
                this.state.arr.push({name:'', type: 'line',data: [[]]})
            }
        }
        console.log(this.state.arr)
        this.setState({data: this.state.arr});
    }


    async getCsvData() {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.getData
        });
    }
    
    getOption = () => ({
        title: {
            text: 'Departure Attitude'
        },
        tooltip: {
            trigger: 'axis'
        },
        // legend: {
        //     data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        // },
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
                <ReactEcharts option={this.getOption()} style={{width:1500, height:700}} />
            </React.Fragment>
        );
    }
}
export default Flightpath;