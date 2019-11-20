import { Card } from 'antd';
import React from "react";
import Offset from './mode/offset';
import Holding from './mode/holding';
import './App.css'

const tabList = [
    {
      key: 'tab1',
      tab: 'Offset',
    },
    {
      key: 'tab2',
      tab: 'Holding',
    },
    {
      key: 'tab3',
      tab: 'Wave separate',
    },
];

const contentList = {
    tab1: <Offset/>,
    tab2: <Holding/>,
    tab3: <p>coming soon...</p>,
};

class Home extends React.Component {
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
            style={{ width: '100%' , fontSize : '2rem !important'}}
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
  
export default Home;  
