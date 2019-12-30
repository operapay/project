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
            data : [],
            checkedList: [],
        };
        this.test = props.data
        this.name = props.name
        
        // this.getData = this.getData.bind(this);
        // this.updateData = this.updateData.bind(this);
    }
  

    onhandleChange(value,data) {
        // console.log(`selected ${value}`);
        var data_select = []
        // console.log(value)
        this.setState({checkedList : value})
        for(var j=0;j<value.length;j++){
            for(var i=0;i<data.length;i++){
                if(data[i].name === value[j]){
                    data_select.push(data[i])
                    console.log(data[i])
                }
            }
        }
        // console.log(data_select)
        this.setState({data : data_select})
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
            <Col>
                <Select
                    mode="multiple"
                    style={{ width: '50%' }}
                    placeholder="Please select flight"
                    value={this.state.checkedList}
                    // defaultValue={['a10', 'c12']}
                    onChange={e => this.onhandleChange(e,this.test)}
                    //options={this.check}
                >
                    {this.name.map(flight => (
                            <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                    ))}
                </Select>
            </Col>
            <ReactEcharts option={this.getOption()}  style={{width:1760, height:900}} />
        </div>
      );
    }
  }
  FileReader2.propTypes = {
    data: PropTypes.array,
    name: PropTypes.array
  };
  
  
  export default FileReader2;