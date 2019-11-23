import React from "react";
import { Button } from 'antd';
import 'antd/dist/antd.css';

class FileReader extends React.Component {
    constructor() {
        super();
        this.state = {
        };

    }

    render() {
      return (
        <div>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="danger">Danger</Button>
            <Button type="link">Link</Button>
        </div>
      );
    }
  }
  
  export default FileReader;