import React from 'react';
import './video.css';
import YouTube from 'react-youtube';

// TODO - Need to make this a class based on https://stackoverflow.com/questions/36097965/when-to-use-es6-class-based-react-components-vs-functional-es6-react-components
// https://github.com/tjallingt/react-youtube/blob/master/example/example.js



const videoIdA = 'WGoDaYjdfSg';
const videoIdB = 'tAGnKpE4NCI';
const opts = {
    height: '100%',
    width: '100%',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 0
    }
  };

class VideoComponent extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        videoId: props.match.params.id,
        player: null,
      };
  
      this.onReady = this.onReady.bind(this);
      this.onChangeVideo = this.onChangeVideo.bind(this);
      this.onPlayVideo = this.onPlayVideo.bind(this);
      this.onPauseVideo = this.onPauseVideo.bind(this);
      this.setSpeed = this.setSpeed.bind(this);
    }
  
    onReady(event) {
      console.log(`YouTube Player object for videoId: "${this.state.videoId}" has been saved to state.`); // eslint-disable-line
      this.setState({
        player: event.target,
      });
    }
  
    setSpeed() {
      this.state.player.setPlaybackRate(0.5);
    }
  
    onPlayVideo() {
      this.state.player.playVideo();
    }
  
    onPauseVideo() {
      this.state.player.pauseVideo();
    }
  
    onChangeVideo() {
      this.setState({
        videoId: this.state.videoId === videoIdA ? videoIdB : videoIdA,
      });
    }
  
    render() {
      return (
        <div class="wrapper">
            <section class="main">
                    <YouTube videoId={this.state.videoId} onReady={this.onReady} opts={opts} containerClassName='video' />
                <div class="controls">
                    <div class="buttons">
                        <button onClick={this.onPlayVideo}>Play</button>
                        <button onClick={this.onPauseVideo}>Pause</button>
                        <button onClick={this.onChangeVideo}>Change Video</button>
                        <button onClick={this.setSpeed}>Slow</button>
                    </div>
                </div>
            </section>
            <section class="nav"></section>
        </div>
      );
    }
  }
  
  export default VideoComponent;