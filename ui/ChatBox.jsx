import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  Paper,
  Toolbar,
  TextField,
} from 'material-ui';
import WatsonLogo from './WatsonLogo.jsx';
import AudioRecorder from './AudioRecorder.jsx';

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
    transitionAppear
    transitionAppearTimeout={500}
  >
    <Paper style={messageStyle}>
      <span>{messageBody}</span>
    </Paper>
  </ReactCSSTransitionGroup>
);

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };
    // Bind component to function
    this.handleTextInput = this.handleTextInput.bind(this);
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
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
        <AudioRecorder
          allowRecording={this.props.allowRecording}
          saveRecording={this.props.saveRecording}
        />
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

export default ChatBox;
