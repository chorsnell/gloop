import React from 'react';
import './video.css';
import YouTube from 'react-youtube';
import TrackRange from '../../track/track-range';

// youtube video options
const opts = {
	height: '100%',
	width: '100%',
	playerVars: {
		// https://developers.google.com/youtube/player_parameters
		autoplay: 0,
		controls: 0,
	},
};

/**
 * Video interface, showing a playing video, controlling with a range slider, and saving loops etc
 *
 * @class VideoComponent
 * @extends {React.Component}
 */
class VideoComponent extends React.Component {
	/**
	 *Creates an instance of VideoComponent.
	 * @param {*} props
	 * @memberof VideoComponent
	 */
	constructor(props) {
		super(props);

		this.state = {
			videoId: props.match.params.id,
			player: null,
			progress: 0,
			duration: 100,
			range: [0, 100],
		};

		this.onReady = this.onReady.bind(this);
		this.playVideo = this.playVideo.bind(this);
		this.pauseVideo = this.pauseVideo.bind(this);
		this.setSpeed = this.setSpeed.bind(this);
		this.videoTimerProgress = this.videoTimerProgress.bind(this);
		this.rangeHandler = this.rangeHandler.bind(this);

		this.videoTimer = null;
	}

	/**
	 * Handles repeatable operations for updating progress etc
	 *
	 * @memberof VideoComponent
	 */
	videoTimerProgress() {
		// sets state with progress
		this.setState({
			progress:
				(100 / this.state.player.getDuration()) *
				this.state.player.getCurrentTime(),
		});

		// if current time outside of range, restart loop
		if (this.state.player.getCurrentTime() >= this.state.range[1]) {
			this.state.player.seekTo(this.state.range[0]);
		}
	}

	/**
	 * When youtube video is ready
	 *
	 * @param {*} event
	 * @memberof VideoComponent
	 */
	onReady(event) {
		console.log(`YouTube Player object for videoId: "${this.state.videoId}" has been saved to state.`);
		// sets player object, and other info
		this.setState({
			player: event.target,
			progress: 0,
			duration: event.target.getDuration(),
		});
	}

	/**
	 * sets speed of video via player api
	 *
	 * @memberof VideoComponent
	 */
	setSpeed(speed) {
		this.state.player.setPlaybackRate(speed);
	}

	/**
	 * Plays video, and starts interval timer
	 *
	 * @memberof VideoComponent
	 */
	playVideo() {
		this.state.player.playVideo();
		// start timer
		this.videoTimer = setInterval(this.videoTimerProgress, 100);
	}

	/**
	 * Pauses video, and clears interval
	 *
	 * @memberof VideoComponent
	 */
	pauseVideo() {
		this.state.player.pauseVideo();
		clearInterval(this.videoTimer);
	}

	/**
	 * Handles data returned from range track
	 *
	 * @param {*} event
	 * @memberof VideoComponent
	 */
	rangeHandler(event) {
		console.log('rangeHandler', event);
		// sets range in state
		this.setState({
			range: event,
		});
		// resets player to start of range
		this.state.player.seekTo(event[0]);
		// play video
		this.playVideo();
	}

	/**
	 * render component
	 *
	 * @returns
	 * @memberof VideoComponent
	 */
	render() {
		return (
			<div class="wrapper">
				<section class="main">
					<YouTube
						videoId={this.state.videoId}
						onReady={this.onReady}
						opts={opts}
						containerClassName="video"
					/>
					<div class="controls">
						<div class="track-wrapper">
							<div
								class="track-progress"
								style={{ width: this.state.progress + '%' }}
							></div>
						</div>
						<TrackRange rangeHandler={this.rangeHandler} duration={this.state.duration} />
						<div class="buttons">
							<button onClick={this.playVideo}>Play</button>
							<button onClick={this.pauseVideo}>Pause</button>
							-
							<button onClick={() => this.setSpeed(0.5)}>0.5</button>
							<button onClick={() => this.setSpeed(0.75)}>0.75</button>
							<button onClick={() => this.setSpeed(1)}>1</button>
						</div>
					</div>
				</section>
				<section class="nav">YOOO</section>
			</div>
		);
	}
}

export default VideoComponent;
