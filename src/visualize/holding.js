import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import * as maptalks from 'maptalks'
import './holding.css'
import { Select,Checkbox,Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const { Option } = Select;

var map = {
    center: [100.7395539,13.6983666], //mahamek
    zoom: 10,
    // pitch: 100,
    altitudeScale: 3.28,
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    }),
}


class FileReader2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : []
        };
        this.test = props.data
        this.check = props.check
        
        this.getData = this.getData.bind(this);
        // this.updateData = this.updateData.bind(this);
    }
  
    componentWillMount(){
        if(this.check.length !== 0){
            this.getData(this.test)
        }
        // console.log('mount')
        // console.log(this.check)
        // console.log(this.test)
    }

    // componentWillUpdate(nextPorps){
    //     if(nextPorps.check !== this.check && nextPorps.test !== this.test){
    //         console.log(this.check , 'next ', nextPorps.check )
    //         console.log(this.test , 'next ', nextPorps.test)
    //         if(nextPorps.check.length !== 0 && nextPorps.test !== undefined){
    //             this.getData(nextPorps.test)
    //         }
    //     }
    //     // console.log('willl')
    // }

    getData(result){
        this.setState({data:result})
    }

    getOption = () => ({
        maptalks3D: map, 
        series: [
            {
                type: 'lines3D',
                coordinateSystem: 'maptalks3D',
                effect: {
                    show: true,
                    constantSpeed: 40,
                    trailWidth: 2,
                    trailLength: 0.05,
                    trailOpacity: 1,
                },
                //blendMode: 'lighter',
                polyline: true,
                lineStyle: {
                    width: 2,
                    color: 'rgb(50, 60, 170)',
                    opacity: 0.5
                },
                data: this.state.data
            }
        ],
    });
  
    render(props) {
    //   console.log(this.state.csvfile);
      return (
        <div className="App">
          {/* <h1>Holding Visualization</h1>
            <Col>
                <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem", paddingRight:"100 px" }} onChange={e => this.Time_onhandleChange(e,this.state.data_select_time)}>
                    {this.state.distinct_time.map(flight => (
                        <Option style={{ fontSize: "1rem" }} key={flight}>{flight}.00 - {flight}.59</Option>
                    ))}
                </Select>
            </Col>
            <Col>
                <Checkbox.Group options={this.state.name_holding}  value={this.state.checkedList} onChange={e => this.onhandleChange(e,this.state.dataAll)}/>
            </Col> */}
            {/* <Select placeholder="Select Time" style={{ width: 200, fontSize: "1.2rem" }} disabled={true} onChange={e => this.onhandleChange(e,this.state.dataAll)}>
                {this.state.distinct_time.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select> */}
            {/* <Select placeholder="Select Flight" style={{ width: 300, fontSize: "1.2rem" }} onChange={e => this.onhandleChange(e,this.state.dataAll)}>
                {this.state.arr_select.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select> */}
            <ReactEcharts option={this.getOption()}  style={{width:1760, height:900}} />
        </div>
      );
    }
  }
  FileReader2.propTypes = {
    data: PropTypes.array,
    check: PropTypes.array
  };
  
  
  export default FileReader2;