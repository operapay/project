import { Card } from 'antd';
import React from "react";
import Offset from '../visualize/offset';
import OffsetAnalyze from '../analytics/offset'

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
    tab1: <Offset/>,
    tab2: <OffsetAnalyze/>,
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

