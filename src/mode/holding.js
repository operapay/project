import { Card } from 'antd';
import React from "react";
import Holding from '../visualize/holding';
import HoldingAnalyze from '../analytics/holding'
import Papa from 'papaparse'

const tabList = [
    {
      key: 'tab1',
      tab: 'visualize',
    },
    {
      key: 'tab2',
      tab: 'analyze',
    },
];

// const contentList = {
//     tab1: <Holding/>,
//     tab2: <HoldingAnalyze/>,
// };

class Mode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 'tab1',
      csvfile: undefined,
      data : null,
      check : false
    };
    // this.test = props.data

    // this.getData = this.getData.bind(this);
    this.updateData = this.updateData.bind(this);
  }
  
    onTabChange = (key, type) => {
      console.log(key, type);
      this.setState({ [type]: key });
    };

    handleChange = event => {
      this.setState({
        csvfile: event.target.files[0],
        check: false
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
      this.setState({data : rawdata, check : true, key : 'tab1'})
      // this.forceUpdate();
    }
  
    render() {
      const contentList = {
        tab1: <Holding check={this.state.check} data={this.state.data}/>,
        tab2: <HoldingAnalyze check={this.state.check} data={this.state.data}/>,
      };
      return (
        <div>
          <h2>Import holding .csv file</h2>
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
          {this.state.check === true ? 
          <Card
            style={{ width: '100%', textAlign: "-webkit-center"}}
            // title="Card title"
            tabList={tabList}
            activeTabKey={this.state.key}
            onTabChange={key => {
              this.onTabChange(key, 'key');
            }}
          >
            {contentList[this.state.key]}
          </Card>
          : null}
        </div>
      );
    }
  }
  
export default Mode;  

