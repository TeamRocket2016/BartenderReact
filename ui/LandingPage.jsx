import React from 'react';
import $ from 'jquery';
import {
  FontIcon,
  IconButton,
  Paper,
  Toolbar,
  TextField,
} from 'material-ui';

import ChatBox from './ChatBox.jsx';
import Message from './Message.jsx';

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
