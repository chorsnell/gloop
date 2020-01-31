import React from 'react';
import './video.css';
import YouTube from 'react-youtube';
import TrackRange from '../../track/track-range';
var store = require('store');
// Example plugin usage:
//var operationsPlugin = require('store/plugins/operations');
//store.addPlugin(operationsPlugin)

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

		var videos = store.get('videos') || [];
		const video = videos.find((v) => v.id === props.match.params.id);
		const index = videos.findIndex((v) => v.id === props.match.params.id);
		console.log('main', video, index);

		this.state = {
			videoId: props.match.params.id,
			player: null,
			progress: 0,
			duration: 100,
			range: [0, 100],
			tracks: video.tracks || [],
			video: video,
			index: index,
		};

		console.log(this.state.video);

		this.onReady = this.onReady.bind(this);
		this.playVideo = this.playVideo.bind(this);
		this.pauseVideo = this.pauseVideo.bind(this);
		this.setSpeed = this.setSpeed.bind(this);
		this.videoTimerProgress = this.videoTimerProgress.bind(this);
		this.rangeHandler = this.rangeHandler.bind(this);
		this.saveTrack = this.saveTrack.bind(this);

		this.videoTimer = null;

		
		this.TrackRangeElement = React.createRef();
	}

	saveTrack() {
		console.log('save', this.state.range);
		
		//this.state.video.tracks.push(this.state.range);
		//store.set('videos[6]', this.state.video);
		console.log(this.state.video);

		this.setState(state => {
			const tracks = [...state.video.tracks, this.state.range];
			const video = state.video;
			video.tracks = tracks;

			var videos = store.get('videos') || [];
			videos[this.state.index] = video;
	  
			store.set('videos', videos);
			
			return {
				tracks: tracks,
			};
		  });
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
		this.TrackRangeElement.current.changeTrack(event);
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
			<div className="wrapper">
				<section className="main">
					<YouTube
						videoId={this.state.videoId}
						onReady={this.onReady}
						opts={opts}
						containerClassName="video"
					/>
					<div className="controls">
						<div className="track-wrapper">
							<div
								className="track-progress"
								style={{ width: this.state.progress + '%' }}
							></div>
						</div>
						<TrackRange rangeHandler={this.rangeHandler} duration={this.state.duration} ref={this.TrackRangeElement} />
						<div className="buttons">
							<button onClick={this.playVideo}>Play</button>
							<button onClick={this.pauseVideo}>Pause</button>
							-
							<button onClick={() => this.setSpeed(0.5)}>0.5</button>
							<button onClick={() => this.setSpeed(0.75)}>0.75</button>
							<button onClick={() => this.setSpeed(1)}>1</button>
							-
							<button onClick={this.saveTrack}>Save</button>
						</div>
					</div>
				</section>
				<section className="nav">
				<ul>
					{this.state.tracks.map((track, index) =>
						<li key={index}>{track[0]} - {track[1]} - name - edit - <button onClick={() => this.rangeHandler(track)}>use</button></li>
					)}
				</ul>
				</section>
			</div>
		);
	}
}

export default VideoComponent;
