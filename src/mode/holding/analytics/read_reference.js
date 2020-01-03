import React from "react";
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'
import 'mapbox-echarts'
import './holding.css'
import Papa from 'papaparse'
import { Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Detect from './detect_holding'


const { Option } = Select;

class FileReader1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csvfile: undefined,
            // dataAll : [{name:'', coords: [['', '', '']], date: [['','']] }],
            // arr: [{
            //     name:'',
            //     coords: [[]],
            //     date: [[]]
            // }],
            // arr_select : [],
            // select : "",
            // dataHoldingDist : [],
            // dataHoldingTime : [],
            status : true,
            data : null
        };

        this.test = props.data
        this.check = props.check

        // this.getData = this.getData.bind(this);
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

    render(props) {
      console.log(this.state.data);
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
            {this.state.status === false ? 
            <Detect data={this.test} status={this.state.status} dataref={this.state.data}/>
            : null}
          {/* <h1>Holding Analyze</h1>
            <Select placeholder="Select Flight" style={{ width: 300, fontSize: "1.2rem" }} onChange={e => this.onhandleChange(e,this.state.dataAll)} disabled={this.state.status}>
                {this.state.arr_select.map(flight => (
                    <Option style={{ fontSize: "1rem" }} key={flight}>{flight}</Option>
                ))}
            </Select>
            <ReactEcharts option={this.getOption()} style={{width:1300, height:500}} />
                <ReactEcharts option={this.getOptiontime()} style={{width:1300, height:500}} /> */}
        </div>
      );
    }
  }

  FileReader1.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool
  };
  
  
  export default FileReader1;