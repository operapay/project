import { Card } from 'antd';
import React from "react";
import Holding from '../visualize/holding';
import HoldingAnalyze from '../analytics/holding'

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

const contentList = {
    tab1: <Holding/>,
    tab2: <HoldingAnalyze/>,
};

class Mode extends React.Component {
    state = {
      key: 'tab1',
    };
  
    onTabChange = (key, type) => {
      console.log(key, type);
      this.setState({ [type]: key });
    };
  
    render() {
      return (
        <div>
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
        </div>
      );
    }
  }
  
export default Mode;  

