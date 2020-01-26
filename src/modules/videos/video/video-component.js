import React from 'react';
import './video.css';
import YouTube from 'react-youtube';
import TrackRange from '../../track/track-range';

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
        progress: 0,
        duration: 100,
        range: [0, 100]
      };
  
      this.onReady = this.onReady.bind(this);
      this.onChangeVideo = this.onChangeVideo.bind(this);
      this.onPlayVideo = this.onPlayVideo.bind(this);
      this.onPauseVideo = this.onPauseVideo.bind(this);
      this.setSpeed = this.setSpeed.bind(this);
      this.videoTimerProgress = this.videoTimerProgress.bind(this);
      this.handler = this.handler.bind(this)
    }

    videoTimerProgress() {
        this.setState({
            progress: (100 / (this.state.player.getDuration()) * this.state.player.getCurrentTime()),
          });

          if(this.state.player.getCurrentTime() >= this.state.range[1]) {
            this.state.player.seekTo(this.state.range[0]);
          }
          //console.log(this.state);
    }
  
    onReady(event) {
      console.log(`YouTube Player object for videoId: "${this.state.videoId}" has been saved to state.`); // eslint-disable-line
      this.setState({
        player: event.target,
        progress: 0,
        duration: event.target.getDuration()
      });
      

        let videoTimer = setInterval(this.videoTimerProgress, 100);
    }
  
    setSpeed() {
      this.state.player.setPlaybackRate(0.5);
    }
  
    onPlayVideo() {
      this.state.player.playVideo();
      //player.getCurrentTime()
      //player.getDuration()
      //percent = player.getDuration()
      console.log(this.state.player.getDuration());

    }
  
    onPauseVideo() {
      this.state.player.pauseVideo();
    }
  
    onChangeVideo() {
      this.setState({
        videoId: this.state.videoId === videoIdA ? videoIdB : videoIdA,
      });
    }

    handler(event) {
        console.log('handler', event);
        this.setState({
            range: event
        });
        this.state.player.seekTo(event[0]);
    }
  
    render() {
      return (
        <div class="wrapper">
            <section class="main">
                    <YouTube videoId={this.state.videoId} onReady={this.onReady} opts={opts} containerClassName='video' />
                <div class="controls">
                    <div class="track-wrapper">
                        <div class="track-progress" style={{width: this.state.progress + '%'}}></div>
                    </div>
                    <TrackRange handler={this.handler} duration={ this.state.duration } />
                    <div class="buttons">
                        <button onClick={this.onPlayVideo}>Play</button>
                        <button onClick={this.onPauseVideo}>Pause</button>
                        <button onClick={this.onChangeVideo}>Change Video</button>
                        <button onClick={this.setSpeed}>Slow</button>
                    </div>
                </div>
            </section>
            <section class="nav">
                YOOO
            </section>
        </div>
      );
    }
  }
  
  export default VideoComponent;