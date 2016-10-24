import React from 'react';
import ReactDom from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';
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
  <ReactCSSTransitionGroup
    transitionName="message-bubble"
    transitionEnterTimeout={0}
    transitionLeaveTimeout={0}
    transitionAppear={true}
    transitionAppearTimeout={500}
    >
    <Paper style={messageStyle}>
      <span>{messageBody}</span>
    </Paper>
  </ReactCSSTransitionGroup>
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

  componentDidUpdate(){
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    if (!this.props.messages) {
      return null;
    }
    const lastMessage = this.props.messages[this.props.messages.length - 1];
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
          disabled={lastMessage.type === 'local'}
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
        <div style={{ paddingBottom: '120px', overflow: 'hidden' }}>
          {this.props.messages.map((message, index) => {
            const style = (function getStyle() {
              if (message.type === 'remote') {
                return messageLeftStyle;
              }
              return messageRightStyle;
            }());
            return (
              <MessageBubble
                key={index}
                messageStyle={style}
                messageBody={message.body}
              />
            );
          })}
        </div>
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
        new Message('remote', 'Hello User! 🍻'),
      ],
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.receiveReply = this.receiveReply.bind(this);
    this.addMessage = this.addMessage.bind(this);

    const sessionId = Math.floor(Math.random() * 10000000);
    const endpoint = `/api/${sessionId}`;
    this._speechEndpoint = `${endpoint}/speechToText`;
    this._messageEndpoint = `${endpoint}/newMessage`;
  }
  addMessage(message) {
    const messages = this.state.messages.concat([message]);
    this.setState({
      messages: messages,
    });
  }
  receiveReply(reply) {
    const replyMessage = new Message('remote', reply.messageBody);
    this.addMessage(replyMessage);
  }
  sendMessage(message) {
    $.ajax({
      type: 'POST',
      url: this._messageEndpoint,
      data: { messageBody: message },
      dataType: 'json',
      success: this.receiveReply,
    })
    .fail((error) => {
      window.alert(`Failed to send message: ${JSON.stringify(error)}`);
    });
    const sentMessage = new Message('local', message);
    this.addMessage(sentMessage);
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
