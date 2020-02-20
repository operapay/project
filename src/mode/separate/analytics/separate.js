import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
// import './holding.css'
import { Select,Checkbox,Col,Table, Input, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
// import Tableplot from './table'

const { Option } = Select;

class FileReader2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            runway : [{name:'01R',lat:13.656697,long:100.751831},
            {name:'01L',lat:13.671278,long:100.734664},
            {name:'19L',lat:13.691714,long:100.761033},
            {name:'19R',lat:13.703669,long:100.743178}],
            checkedList: [],
            data_bar : [],
            heavy: ['A38','A35','A33','B74','B77','B78'],
            large: ['A31','A32','B73','A20'],
            small: ['AT7'],
            table : [],
            data_table: [],
            click: false,
            name_table:''
        };
        this.data = props.data
        this.time_pick = props.time_pick
        this.name_pick = props.name
        this.time = props.time
        this.turn = props.turn
        
        // this.getData = this.getData.bind(this);
        // this.updateData = this.updateData.bind(this);
    }

    componentWillMount(){
        // console.log(this.data)
        this.getData(this.data)
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            //   icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
      });
    
      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };

    compute_newcoords(array,point){
        var first,first_lat,first_long,last,last_lat,last_long
        var res = [{name:'',time:'',data:[]}]
        var time = []
        var num = 0
        for(var i=0;i<array.length;i++){
            first = 0
            first_lat = 0
            first_long = 0
            last = 0
            last_lat = 0
            last_long = 0
            for(var j=1;j<array[i].coords.length;j++){
                first_lat = array[i].coords[j-1][1]
                last_lat = array[i].coords[j][1]
                first_long = array[i].coords[j-1][0]
                last_long = array[i].coords[j][0]
                if((point[0].lat >= first_lat && point[0].lat <= last_lat) && (point[0].long >= first_long && point[0].long <= last_long)){
                    // time_min = array[i].coords[j-1][3]
                    // time_max = data[i].data.coords[j][3]
                    first = this.timeStringToFloat( moment(array[i].coords[j-1][3]).format('HH:mm:ss'))
                    last = this.timeStringToFloat( moment(array[i].coords[j][3]).format('HH:mm:ss'))
                    var point_lat = point[0].lat
                    var point_long = point[0].long
                    var turn = '01R'
                    // console.log('if')
                    break
                }
                else if((point[1].lat >= first_lat && point[1].lat <= last_lat) && (point[1].long >= first_long && point[1].long <= last_long)){
                    // time_min = array[i].coords[j-1][3]
                    // time_max = data[i].data.coords[j][3]
                    first = this.timeStringToFloat( moment(array[i].coords[j-1][3]).format('HH:mm:ss'))
                    last = this.timeStringToFloat( moment(array[i].coords[j][3]).format('HH:mm:ss'))
                    var point_lat = point[1].lat
                    var point_long = point[1].long
                    var turn = '01L'
                    // console.log('if')
                    break
                }
                else if((point[2].lat >= last_lat && point[2].lat <= first_lat) && (point[2].long >= last_long && point[2].long <= first_long)){
                    // time_min = array[i].coords[j-1][3]
                    // time_max = data[i].data.coords[j][3]
                    first = this.timeStringToFloat( moment(array[i].coords[j-1][3]).format('HH:mm:ss'))
                    last = this.timeStringToFloat( moment(array[i].coords[j][3]).format('HH:mm:ss'))
                    var point_lat = point[2].lat
                    var point_long = point[2].long
                    var turn = '19L'
                    // console.log('19L')
                    break
                }
                else if((point[3].lat >= last_lat && point[3].lat <= first_lat) && (point[3].long >= last_long && point[3].long <= first_long)){
                    // time_min = array[i].coords[j-1][3]
                    // time_max = data[i].data.coords[j][3]
                    first = this.timeStringToFloat( moment(array[i].coords[j-1][3]).format('HH:mm:ss'))
                    last = this.timeStringToFloat( moment(array[i].coords[j][3]).format('HH:mm:ss'))
                    var point_lat = point[3].lat
                    var point_long = point[3].long
                    var turn = '19R'
                    // console.log('19R')
                    break
                }
            }
            var res_time1 = this.interpolate(parseFloat(first_lat),first,parseFloat(last_lat),last,point_lat)
            var res_time2 = this.interpolate(parseFloat(first_long),first,parseFloat(last_long),last,point_long)
            var avg = (res_time1+res_time2)/2

            // var mydate = moment(String(result[num].date), 'YYYY-MM-DD');
            // console.log(array[i].coords[j-1][3], '--',this.FloattoTime(avg))
            var test1 = moment(array[i].date,'DD/MM/YYYY').format("MM/DD/YYYY")+" " + this.FloattoTime(avg)
            // console.log(test1)
            var time1 = moment(test1).toDate();
            res[i].name = array[i].name
            res[i].time = time1
            res[i].timeint = avg
            res[i].data = array[i]
            res[i].runway = turn
            if(avg !== 0) time.push(array[i].date)
            if(i < array.length-1){
                res.push({name:'',time:'',data:[]})
            }
            // console.log(res)
        }
        return {res: res ,time:time};
    }

    timeStringToFloat(time) {
        // console.log(time)
        var hoursMinutes = time.split(':');
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        var seconds = hoursMinutes[2] ? parseInt(hoursMinutes[2], 10) : 0;
        return hours + minutes /60 + seconds/3600;
    }

    FloattoTime(time){
        // console.log(time)
        var hh = time-(time % 1)
        var min = (time%1)*60
        var mm = min-(min%1)
        var seconds = (min%1)*60
        var ss = seconds-(seconds%1)
        // var ss = ((time-hh*60)-mm)%100
        // console.log(hh)
        return hh + ':' + mm + ':' + ss
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

    interpolate(x1,y1,x2,y2,x){
        // console.log(x1,y1,x2,y2,x)
        var diff = ((y2-y1)/(x2-x1))*(x-x1)
        var res = diff+y1
        return res
    }

    compare( a, b ) {
        if ( a.time < b.time ){
          return -1;
        }
        if ( a.time > b.time ){
          return 1;
        }
        return 0;
    }

    distribution(data){
        let unique3 = [-2,-1,0,1,2,3,4,5,6,7,8];
        let unique4 = [-1,0,1,2,3,4,5,6,7,8,9];
        let unique5 = [0,1,2,3,4,5,6,7,8,9,10];
        let unique6 = [1,2,3,4,5,6,7,8,9,10,11];
        let unique = [[unique3,unique3,unique3],[unique4,unique3,unique3],[unique6,unique5,unique4]]

        var data_distribute = []
        for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i].length;j++){
                var duplicates = unique[i][j].map(value => [value, data[i][j].filter(str => str === value).length]);
                data_distribute.push(duplicates)
            }
            // data_distribute.push(duplicates)
        }

        return data_distribute

        // console.log(data_distribute)
    }

    getData(data){
        var name = this.compute_newcoords(data,this.state.runway)
        var data = name.res
        data.sort(this.compare)
        let unique = [...new Set(name.time)];
        let duplicates = unique.map(value => ({time:value, num:name.time.filter(str => str === value).length}));
        duplicates.sort(this.compare)
        var first,last;
        var lat_min, lon_min, time_min,altitude_min;
        var lat_max, lon_max, time_max,altitude_max;
        var lat,lon,altitude;
        var array = [[[],[],[]],
                    [[],[],[]],
                    [[],[],[]]]
        // var data_array = [[[],[],[]],
        //                 [[],[],[]],
        //                 [[],[],[]]]
        var data_array = [[],[],[],[],[],[],[],[],[]]
        // var scatter = []
        // var line = []
        var data_distribute = []
        for(var i=0;i<data.length-1;i++){
            var dis,dis_runway;
            // var state = 0
            if(data[i].data.date === data[i+1].data.date && data[i].timeint !== 0){
                for(var j=1;j<data[i+1].data.coords.length;j++){
                    first = this.timeStringToFloat( moment(data[i+1].data.coords[j-1][3]).format('HH:mm:ss'))
                    last = this.timeStringToFloat( moment(data[i+1].data.coords[j][3]).format('HH:mm:ss'))
                    if(data[i+1].timeint >= first && data[i+1].timeint <= last){
                        // console.log('if')
                        lon_min = data[i+1].data.coords[j-1][0]
                        lon_max = data[i+1].data.coords[j][0]
                        lat_min = data[i+1].data.coords[j-1][1]
                        lat_max = data[i+1].data.coords[j][1]
                        altitude_min = data[i+1].data.coords[j-1][2]
                        altitude_max = data[i+1].data.coords[j][2]
                        time_min = first
                        time_max = last
                        // state = j-1
                        break
                    }
                    var res_lon = this.interpolate(time_min,parseFloat(lon_min),time_max,parseFloat(lon_max),data[i+1].timeint)
                    var res_lat = this.interpolate(time_min,parseFloat(lat_min),time_max,parseFloat(lat_max),data[i+1].timeint)
                    var res_alt = this.interpolate(time_min,parseFloat(altitude_min),time_max,parseFloat(altitude_max),data[i+1].timeint)
                }
                // console.log(data[i].runway)
                if(data[i].runway === '01R') dis_runway = this.distance(this.state.runway[0].lat,this.state.runway[0].long,res_lat,res_lon)
                else if(data[i].runway === '01L') dis_runway = this.distance(this.state.runway[1].lat,this.state.runway[1].long,res_lat,res_lon) 
                else if(data[i].runway === '19L') dis_runway = this.distance(this.state.runway[2].lat,this.state.runway[2].long,res_lat,res_lon)
                else if(data[i].runway === '19R') dis_runway = this.distance(this.state.runway[3].lat,this.state.runway[3].long,res_lat,res_lon)
                // console.log(data[i].name,data[i+1].name,dis_runway)
                if(dis_runway < 9){
                    // console.log('if')
                    var head; 
                    if(this.state.heavy.includes(data[i].data.aircraft)) head = 'heavy'
                    else if(this.state.large.includes(data[i].data.aircraft)) head = 'large'
                    else if(this.state.small.includes(data[i].data.aircraft)) head = 'small'
                    else head = 'large'
                    // console.log('scatter',scatter)
                    var follow;
                    if(this.state.heavy.includes(data[i+1].data.aircraft)) follow = 'heavy';
                    else if(this.state.large.includes(data[i+1].data.aircraft)) follow = 'large';
                    else if(this.state.small.includes(data[i+1].data.aircraft)) follow = 'small';     
                    else head = 'large'  
                    
                    var real_dis = 0;
                    if(head === 'small') {
                        if(follow === 'small'){
                            array[0][0].push(Math.round(dis_runway))
                            data_array[0].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                        else if(follow === 'large'){
                            array[0][1].push(Math.round(dis_runway))
                            data_array[1].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                        else if(follow === 'heavy'){
                            array[0][2].push(Math.round(dis_runway))
                            data_array[2].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                        // real_dis = 3;
                    }    
                    else if(head === 'large'){
                        if(follow === 'small'){
                            array[1][0].push(Math.round(dis_runway))
                            data_array[3].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                        else if(follow === 'large'){
                            array[1][1].push(Math.round(dis_runway))
                            data_array[4].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                        else if(follow === 'heavy'){
                            array[1][2].push(Math.round(dis_runway))
                            data_array[5].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                    }
                    else if(head === 'heavy'){
                        if(follow === 'small'){
                            array[2][0].push(Math.round(dis_runway))
                            data_array[6].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                        else if(follow === 'large'){
                            array[2][1].push(Math.round(dis_runway))
                            data_array[7].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                        else if(follow === 'heavy'){
                            array[2][2].push(Math.round(dis_runway))
                            data_array[8].push({num:Math.round(dis_runway),data:[{time:data[i].time,head:data[i].name,tail:data[i+1].name}]})
                        }
                    }
                }
            }
            // console.log('dis',array)
        }
        //----------------data distribution----------------
        // console.log('dis',data_array)
        let graph_name = ['Small and Small','Small and Large','Small and Heavy',
        'Large and Small','Large and Large','Large and Heavy',
        'Heavy and Small','Heavy and Large','Heavy and Heavy']
        let plot_data = this.distribution(array)
        let series = []
        for(var i=0;i<plot_data.length;i++){
            series.push({data: plot_data[i],
                name: graph_name[i],
                xAxisIndex: i,
                yAxisIndex: i,
                type: 'bar',})
        }
        this.setState({data_bar:series,table:data_array})
        // this.setState({data_bar:plot_data})
    }

    onChartClick = (param, echarts) => {
        var data_click = {num:param.data[0],data:[]}
        // console.log(param);
        for(var i=0;i<this.state.table.length;i++){
            if(i === param.seriesIndex){
                for(var j=0;j<this.state.table[i].length;j++){
                    // console.log(param.data[0])
                    if(this.state.table[i][j].num === param.data[0]){
                        data_click.data.push(this.state.table[i][j].data)
                        // console.log(this.state.table[i])
                    }
                }
            }
        }
        var data = []
        if(data_click.length !== 0){
            // console.log(data_click.data)
            for(var i=0;i<data_click.data.length;i++){
                // console.log(data_click.data[i][0].time)
                // console.log(data_click.data[i][0].head)
                // console.log(data_click.data[i][0].tail)
                data.push(
                {
                    date:moment(data_click.data[i][0].time).format('MM/DD/YYYY'),
                    key: i,
                    head:data_click.data[i][0].head,
                    tail:data_click.data[i][0].tail
                })
            }
        }
        var name = 'Table between ' + param.seriesName + ' at ' + param.data[0] + ' nmi'
        // console.log(data)
        data.sort(this.compare)
        this.setState({data_table:data,click:true,name_table:name})
        // alert('chart click');
      };

    getOption = () => ({
        // title:[
        //     {text: 'H-Small T-Small' ,gridIndex: 0,},
        //     {text: 'H-Small T-Large' ,gridIndex: 0,},
        //     {text: 'H-Small T-Heavy' ,gridIndex: 0,},
        //     {text: 'H-Large T-Small' ,gridIndex: 0,},
        //     {text: 'H-Large T-Large' ,gridIndex: 0,},
        //     {text: 'H-Large T-Heavy' ,gridIndex: 0,},
        //     {text: 'H-Heavy T-Small' ,gridIndex: 0,},
        //     {text: 'H-Heavy T-Large' ,gridIndex: 0,},
        //     {text: 'H-Heavy T-Heavy' ,gridIndex: 0,},
        // ],
        legend: {},
        tooltip: {},
        // toolbox: {
        //     left: 'center',
        //     feature: {
        //         dataZoom: {}
        //     }
        // },
        grid: [
            { width: '20%', height: '20%'},
            { width: '20%', height: '20%',right:'40%'},
            { width: '20%', height: '20%',right:'10%'},
            { width: '20%', height: '20%',bottom:'40%'},
            { width: '20%', height: '20%',right:'40%',bottom:'40%'},
            { width: '20%', height: '20%',right:'10%',bottom:'40%'},
            { width: '20%', height: '20%',bottom:'5%'},
            { width: '20%', height: '20%',right:'40%',bottom:'5%'},
            { width: '20%', height: '20%',right:'10%',bottom:'5%'},
            
        ],
        xAxis: [
            {type: 'value', gridIndex: 0, name: 'distance'},
            {type: 'value', gridIndex: 1, name: 'distance'},
            {type: 'value', gridIndex: 2, name: 'distance'},
            {type: 'value', gridIndex: 3, name: 'distance'},
            {type: 'value', gridIndex: 4, name: 'distance'},
            {type: 'value', gridIndex: 5, name: 'distance'},
            {type: 'value', gridIndex: 6, name: 'distance'},
            {type: 'value', gridIndex: 7, name: 'distance'},
            {type: 'value', gridIndex: 8, name: 'distance'},
        ],
        yAxis: [
            {type: 'value', gridIndex: 0, name: 'number of flight'},
            {type: 'value', gridIndex: 1, name: 'number of flight'},
            {type: 'value', gridIndex: 2, name: 'number of flight'},
            {type: 'value', gridIndex: 3, name: 'number of flight'},
            {type: 'value', gridIndex: 4, name: 'number of flight'},
            {type: 'value', gridIndex: 5, name: 'number of flight'},
            {type: 'value', gridIndex: 6, name: 'number of flight'},
            {type: 'value', gridIndex: 7, name: 'number of flight'},
            {type: 'value', gridIndex: 8, name: 'number of flight'},
        ],
        series: this.state.data_bar
    });
  
    render(props) {
    //   console.log(this.state.csvfile);
        let onEvents = {
        'click': this.onChartClick,
        // 'legendselectchanged': this.onChartLegendselectchanged
        };
        const columns = [
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date',
              width: '40%',
              ...this.getColumnSearchProps('date'),
            },
            {
              title: 'Head',
              dataIndex: 'head',
              key: 'head',
              width: '30%',
              ...this.getColumnSearchProps('head'),
            },
            {
              title: 'tail',
              dataIndex: 'tail',
              key: 'tail',
              ...this.getColumnSearchProps('tail'),
            },
        ];
        return (
        <div className="App">
            <ReactEcharts ref={(e) => { this.echarts_react = e; } } option={this.getOption()}  style={{width:1280, height:800}} 
            onEvents={onEvents}/>
            <h1>{this.state.name_table}</h1>
            {this.state.click === true ? 
            <Table columns={columns} dataSource={this.state.data_table} bordered />
            : null}
            {/* <Tableplot data={this.state.data_table} check={this.state.click}/> */}
            {/* <Plot data={this.state.data_line}/> */}
        </div>
      );
    }
  }
  FileReader2.propTypes = {
    data: PropTypes.array,
    time_pick: PropTypes.string,
    name : PropTypes.string,
    time : PropTypes.array,
    turn : PropTypes.string
  };
  
  
  export default FileReader2;