import React from 'react';
import {
  Paper,
  Toolbar,
  TextField,
} from 'material-ui';

import WatsonLogo from './WatsonLogo.jsx';

const defaultPaperStyle = {
  padding: '1em',
  margin: '1em',
};

class TextBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {textValue: ''};
  }

  handleKeyPress = (event)=> {
    const value = event.target.value;
    console.log('event', event);
    if(event.key == 'Enter'){
      this.props.inputHandler(value);
      this.setState({textValue: ''});
    } else {
      console.log(value);
      this.setState({textValue: value});
    }
  }

  render() {
    return (
      <Toolbar
        style ={{
          right: '1em',
          left: '1em',
          position: 'fixed',
          bottom: 0,
          maxWidth: '100%',
          backgroundColor: 'rgb(48,48,48)'
        }}
      >
        <TextField
          onChange={this.handleKeyPress}
          onKeyDown={this.handleKeyPress}
          value={this.state.textValue}
          style={{ width: '100%' }}
          hintText="Enter Message" />
      </Toolbar>
    );
  }
}

const messageRightStyle = {
  padding: defaultPaperStyle.padding,
  margin: defaultPaperStyle.margin,
  float: 'right',
  width: '50%',
  textAlign: 'right'
};

const messageLeftStyle = {
  padding: defaultPaperStyle.padding,
  margin: defaultPaperStyle.margin,
  float: 'left',
  width: '50%',
  textAlign: 'left'
};

const Message = ({messageStyle, messageBody}) => (
  <Paper style={messageStyle}>
    <span>{messageBody}</span>
  </Paper>
);

const LandingPage = () => (
  <div>
    <WatsonLogo />
      <Message
        messageStyle={messageLeftStyle}
        messageBody="hello user" />
    <Message
      messageStyle={messageRightStyle}
      messageBody="hello watson" />
    <TextBar
      inputHandler={(textMessage)=>console.log('evt', textMessage)}
    />
  </div>
);

export default LandingPage;
