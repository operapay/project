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
            status : true,
            data : null,
            upload: true
            // route : [
            // [{name: 'LEBIM',lat:13.087447 ,lon: 100.473475},
            // {name: 'INNDY',lat:13.271014 ,lon: 100.624633},
            // {name: 'SALSA',lat:13.466314 ,lon: 100.785817},
            // {name: 'LATIN',lat:13.662172 ,lon: 100.839414},
            // {name: 'SE191',lat:13.91385 ,lon: 100.908408},
            // {name: 'EKCHO',lat:13.996256 ,lon: 100.931042}],
            // [{name: 'DOLNI',lat:13.294339 ,lon: 101.180114},
            // {name: 'BEATS',lat:13.364217 ,lon: 101.020128},
            // {name: 'SALSA',lat:13.466314 ,lon: 100.785817},
            // {name: 'LATIN',lat:13.662172 ,lon: 100.839414},
            // {name: 'SE191',lat:13.91385 ,lon: 100.908408},
            // {name: 'EKCHO',lat:13.996256 ,lon: 100.931042}],
            // [{name: 'EASTE',lat:14.309667 ,lon: 101.286244},
            // {name: 'LENTO',lat:14.102892 ,lon: 101.084469},
            // {name: 'TUMBA',lat:13.962453 ,lon: 101.045858},
            // {name: 'SANJO',lat:13.631817 ,lon: 100.9552},
            // {name: 'LATIN',lat:13.662172 ,lon: 100.839414},
            // {name: 'SE191',lat:13.91385 ,lon: 100.908408},
            // {name: 'EKCHO',lat:13.996256 ,lon: 100.931042}],
            // [{name: 'WILLA',lat:14.404717 ,lon: 100.059822},
            // {name: 'BAROK',lat:14.37175 ,lon: 100.191836},
            // {name: 'SW195',lat:14.334878 ,lon: 100.339122},
            // {name: 'SW194',lat:14.298961 ,lon: 100.4822},
            // {name: 'SW193',lat:14.250286 ,lon: 100.675492},
            // {name: 'SW192',lat:13.992608 ,lon: 100.607731},
            // {name: 'SW191',lat:13.962311 ,lon: 100.723583},
            // {name: 'WALTZ',lat:14.043339 ,lon: 100.745058}],
            // [{name: 'NORTA',lat:14.718789 ,lon: 100.639017},
            // {name: 'SW196',lat:14.576814 ,lon: 100.682742},
            // {name: 'FORTE',lat:14.438839 ,lon: 100.725189},
            // {name: 'SW193',lat:14.250286 ,lon: 100.675492},
            // {name: 'SW192',lat:13.992608 ,lon: 100.607731},
            // {name: 'SW191',lat:13.962311 ,lon: 100.723583},
            // {name: 'WALTZ',lat:14.043339 ,lon: 100.745058}]
            // ]
        };

        this.test = props.data
        this.check = props.check

        // this.getData = this.getData.bind(this);
        this.updateData = this.updateData.bind(this)
    }

    // componentWillMount(){
    //   if(this.check === true){
    //       this.getData(this.state.route)
    //   }
    //   // console.log('mount')
    //   // console.log(this.check)
    //   // console.log(this.test)
    // }

    // getData(result){
    //   var i=0;
    //   for(i in result){
    //     var res = 0
    //     // console.log(result[i])
    //     for(var j=1;j<result[i].length;j++){
    //       // console.log(result[i][j-1].lat)
    //       // console.log(result[i][j-1].lon)
    //       res = res + this.distance(result[i][j-1].lat,result[i][j-1].lon,result[i][j].lat,result[i][j].lon,"N")
    //     }
    //     console.log(res)
    //   }
    // }

    // distance(lat1, lon1, lat2, lon2, unit) {
    //   if ((lat1 === lat2) && (lon1 === lon2)) {
    //       return 0;
    //   }
    //   else {
    //       var radlat1 = Math.PI * lat1/180;
    //       var radlat2 = Math.PI * lat2/180;
    //       var theta = lon1-lon2;
    //       var radtheta = Math.PI * theta/180;
    //       var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    //       if (dist > 1) {
    //           dist = 1;
    //       }
    //       dist = Math.acos(dist);
    //       dist = dist * 180/Math.PI;
    //       dist = dist * 60 * 1.1515;
    //       if (unit==="K") { dist = dist * 1.609344 }
    //       if (unit==="N") { dist = dist * 0.8684 }
    //       // console.log('nmi') }
    //       return dist;
    //   }
    // }
    
    handleChange = event => {
        this.setState({
          csvfile: event.target.files[0],
          upload: false
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
            <button onClick={this.importCSV} disabled={this.state.upload}> Upload now!</button>
            {this.state.status === false ? 
            <Detect data={this.test} status={this.state.status} dataref={this.state.data}/>
            : null}
        </div>
      );
    }
  }

  FileReader1.propTypes = {
    data: PropTypes.array,
    check: PropTypes.bool
  };
  
  
  export default FileReader1;