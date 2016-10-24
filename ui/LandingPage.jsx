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

const messageRightStyle = {
  padding: defaultPaperStyle.padding,
  margin: defaultPaperStyle.margin,
  float: 'right',
  width: '50%',
  textAlign: 'right',
};

const messageLeftStyle = {
  padding: defaultPaperStyle.padding,
  margin: defaultPaperStyle.margin,
  float: 'left',
  width: '50%',
  textAlign: 'left',
};

const MessageBubble = ({ messageStyle, messageBody }) => (
  <Paper style={messageStyle}>
    <span>{messageBody}</span>
  </Paper>
);

function Message(type, body) {
  this.type = type;
  this.body = body;

  if (this.type !== 'remote' && this.type !== 'local') {
    throw 'Unknown Message Type Set';
  }
}

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };
    // Bind component to function
    this.handleTextInput = this.handleTextInput.bind(this);
  }

  handleTextInput(event) {
    const value = event.target.value;
    if (event.key === 'Enter') {
      this.props.sendMessage(value);
      this.setState({ inputText: '' });
    } else {
      this.setState({ inputText: value });
    }
  }

  render() {
    const textBar = (
      <Toolbar
        style={{
          right: '1em',
          left: '1em',
          position: 'fixed',
          bottom: 0,
          maxWidth: '100%',
          backgroundColor: 'rgb(48,48,48)',
        }}
      >
        <TextField
          onChange={this.handleTextInput}
          onKeyDown={this.handleTextInput}
          value={this.state.inputText}
          style={{ width: '100%' }}
          hintText="Enter Message"
        />
      </Toolbar>
    );
    return (
      <div>
        <WatsonLogo />
        {this.props.messages.map((message) => {
          const style = (function getStyle() {
            if (message.type === 'remote') {
              return messageLeftStyle;
            }
            return messageRightStyle;
          }());
          return (
            <MessageBubble
              messageStyle={style}
              messageBody={message.body}
            />
          );
        })}
        {textBar}
      </div>
    );
  }
}

class ChatStateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        new Message('remote', 'Hello User!'),
        new Message('local', 'Hello Watson!'),
      ],
    };
    this.sendMessage = this.sendMessage.bind(this);
  }
  sendMessage(message) {
    // TODO
    console.log('TODO: send message', message);
  }

  render() {
    return (
      <ChatBox
        messages={this.state.messages}
        sendMessage={this.sendMessage}
      />
    );
  }
}

const LandingPage = () => (
  <ChatStateContainer />
);

export default LandingPage;
