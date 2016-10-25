import React from 'react';
import {
  FontIcon,
  IconButton } from 'material-ui';
import { red500, blue500 } from 'material-ui/styles/colors';

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
    if (!navigator.getUserMedia) {
      return;
    }
    new Promise((resolve, reject) => {
      navigator.getUserMedia({ audio: true },
        stream => resolve(stream), error => reject(error));
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

AudioRecorder.propTypes = {
  saveRecording: React.PropTypes.func,
  allowRecording: React.PropTypes.bool,
};

export default AudioRecorder;
