import React from 'react';
import './video.css';
import YouTube from 'react-youtube';

// TODO - Need to make this a class based on https://stackoverflow.com/questions/36097965/when-to-use-es6-class-based-react-components-vs-functional-es6-react-components
// https://github.com/tjallingt/react-youtube/blob/master/example/example.js

function VideoComponent({ video }) {

    

    const play = () => {
        console.log('play');
        window.player.playVideo();
    }

    const speed = () => {
        console.log('play');
    }

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: { // https://developers.google.com/youtube/player_parameters
          autoplay: 1
        }
      };
      //<iframe width="100%" height="100%" src="https://www.youtube.com/embed/WGoDaYjdfSg?controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


      const _onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
      }
  return (
    <div class="wrapper">
        <section class="main">
            <div class="video">
            <YouTube
            videoId="WGoDaYjdfSg"
            opts={opts}
            onReady={_onReady}
        />

            </div>
            <div class="controls">
                <div class="buttons">
                    <button onClick={play}>Play</button>
                    <button onClick={speed}>Speed</button>
                </div>
            </div>
        </section>
        <section class="nav"></section>
    </div>
  );
}

export default VideoComponent;