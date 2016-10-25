import React from 'react';
import ReactDom from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';
import {
  FontIcon,
  IconButton,
  Paper,
  Toolbar,
  TextField,
} from 'material-ui';
import { red500, blue500 } from 'material-ui/styles/colors';

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
    transitionAppear
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

class AudioRecorder extends React.Component {
  constructor(props) {
    super(props);
    // PROPS: saveRecording: callback, allowRecording: boolean
    this.state = { audioRecorder: null, chunks: [] };
    this.toggleRecording = this.toggleRecording.bind(this);
    this.addAudioChunk = this.addAudioChunk.bind(this);
    this.compileAudioChunks = this.compileAudioChunks.bind(this);
  }

  addAudioChunk(event) {
    console.log('Saving chunks', event);
    this.setState({
      chunks: this.state.chunks.concat([event.data]),
    });
    if (this.state.audioRecorder.state === 'inactive') {
      this.compileAudioChunks();
    }
  }

  compileAudioChunks() {
    const chunks = this.state.chunks;
    if (chunks.length < 1) {
      console.error('No Audio chunks to save');
      return;
    }
    const audioBlob = new Blob(chunks, { type: 'audio/ogg;codecs=opus' });
    this.props.saveRecording(audioBlob);
  }

  componentDidMount() {
    navigator.getUserMedia = navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.getUserMedia;
    if(!navigator.getUserMedia){
      return;
    }
    new Promise((resolve, reject)=>{
      navigator.getUserMedia({ audio: true },
        (stream)=> resolve(stream), (error) => reject(error))
    }).then((localMediaStream) => {
        const audioRecorder = new MediaRecorder(localMediaStream);
        audioRecorder.ondataavailable = this.addAudioChunk;
        this.setState({
          audioRecorder,
        });
      });
  }

  toggleRecording(event) {
    const recorder = this.state.audioRecorder;
    if (recorder.state === 'inactive') {
      console.log('Starting recording');
      this.setState({ chunks: [] });
      recorder.start();
      return;
    }
    recorder.stop();
  }

  render() {
    const that = this;
    const mediaAvailable = (() => {
      if (that.state.audioRecorder) {
        return true;
      }
      return false;
    })();
    const disableRecording = !mediaAvailable || !this.props.allowRecording;
    const color = (() => {
      if (mediaAvailable && that.state.audioRecorder.state !== 'inactive') {
        return red500;
      }
      return blue500;
    })();
    return (
      <IconButton
        onTouchTap={this.toggleRecording}
        disabled={disableRecording}
      >
        <FontIcon
          color={color}
          className="material-icons"
        >
          record_voice_over
        </FontIcon>
      </IconButton>
    );
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

  componentDidUpdate() {
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

class ChatStateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        new Message('remote', 'Hello User! 🍻'),
      ],
      allowRecording: true,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.receiveReply = this.receiveReply.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.saveRecording = this.saveRecording.bind(this);

    const sessionId = Math.floor(Math.random() * 10000000);
    const endpoint = `/api/${sessionId}`;
    this._speechEndpoint = `${endpoint}/speechToText`;
    this._messageEndpoint = `${endpoint}/newMessage`;
  }
  addMessage(message) {
    const messages = this.state.messages.concat([message]);
    this.setState({
      messages,
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

  saveRecording(audioBlob) {
    this.setState({
      allowRecording: false,
    });
    const sendPromise = (() => {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', this._speechEndpoint, true);
        request.addEventListener('load', (event) => {
          resolve(request.response);
        });
        request.addEventListener('error', (event) => {
          reject(event);
        });
        request.addEventListener('abort', (event) => {
          reject(event);
        });
        request.send(audioBlob);
      });
    })();

    let allowRecording = () => {
      this.setState({ allowRecording: true });
    };
    allowRecording = allowRecording.bind(this);

    sendPromise
    .then((transcript) => {
      console.log('Transcript', transcript);
      allowRecording();
      this.sendMessage(transcript);
    })
    .catch((error) => {
      alert(JSON.stringify(error));
      allowRecording();
    });
  }

  render() {
    return (
      <ChatBox
        messages={this.state.messages}
        sendMessage={this.sendMessage}
        saveRecording={this.saveRecording}
        allowRecording={this.state.allowRecording}
      />
    );
  }
}

const LandingPage = () => (
  <ChatStateContainer />
);

export default LandingPage;
