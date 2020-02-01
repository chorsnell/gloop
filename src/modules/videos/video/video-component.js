import React from 'react';
import './video.css';
import YouTube from 'react-youtube';
import TrackRange from '../../track/track-range';
import store from 'store';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import update from 'react-addons-update'; // ES6
import TrackItemComponent from '../../track/track-item';
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

		// get current video and index and add to state
		var videos = store.get('videos') || [];
		const video = videos.find((v) => v.id === props.match.params.id);
		const index = videos.findIndex((v) => v.id === props.match.params.id);

		this.state = {
			videoId: props.match.params.id,
			player: null,
			progress: 0,
			duration: 100,
			range: [0, 100],
			tracks: video.tracks || [],
			video: video,
			index: index, // video index
			trackName: null,
		};

		this.onReady = this.onReady.bind(this);
		this.playVideo = this.playVideo.bind(this);
		this.pauseVideo = this.pauseVideo.bind(this);
		this.setSpeed = this.setSpeed.bind(this);
		this.videoTimerProgress = this.videoTimerProgress.bind(this);
		this.rangeHandler = this.rangeHandler.bind(this);
		this.saveTrack = this.saveTrack.bind(this);
		this.deleteTrack = this.deleteTrack.bind(this);
		this.restartTrack = this.restartTrack.bind(this);

		this.videoTimer = null;

		
		this.TrackRangeElement = React.createRef();

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		//this.setState({trackName: event.target.value});
		console.log(event);
		this.setState({
			//tracks: update(this.state.tracks, {1: {name: {$set: 'updated field name'}}})
		})
	}

	handleSubmit(event) {
	}

	restartTrack() {
		console.log('restart');
		this.state.player.seekTo(this.state.range[0]);
	}

	saveTrack() {
		console.log('save', this.state.range);
		
		//this.state.video.tracks.push(this.state.range);
		//store.set('videos[6]', this.state.video);
		console.log(this.state.video);

		this.setState(state => {
			if(!state.video.tracks) {
				state.video.tracks = [];
			}
			const track = {name: 'New Loop', range: this.state.range}
			const tracks = [...state.video.tracks, track];
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

	deleteTrack(index) {

		this.setState({tracks: this.state.tracks.filter(function(tracks, tindex) {
			return tindex !== index
		})}, () => {
			console.log(this.state.video);
			const video = this.state.video;
			video.tracks = this.state.tracks;

			var videos = store.get('videos') || [];
			videos[this.state.index] = video;
			store.set('videos', videos);
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
				<KeyboardEventHandler
					handleKeys={['c', 'ctrl+home']}
					onKeyEvent={this.restartTrack} />
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
{/*  						{this.state.tracks.map((track, index) =>
							<li key={index}>
								<a onClick={() => this.rangeHandler(track.range)}>
									{track.name}<br></br>
									{track.range[0]} - {track.range[1]}
								</a>
								<button onClick={() => this.editTrack(index)}>edit</button> - <button onClick={() => this.deleteTrack(index)}>delete</button>
								<form onSubmit={this.handleSubmit}>
									<input type="text" value={track.name} onChange={this.handleChange} />
									<input type="submit" value="Submit" />
								</form>
							</li>
						)} */}
						{this.state.tracks.map((track, index) => {
							return <TrackItemComponent TrackRangeElement={this.TrackRangeElement} rangeHandler={() => this.rangeHandler(track.range)} handleSubmit={() => this.handleSubmit} key={index} track={track} />;
						})}
					</ul>
				</section>
			</div>
		);
	}
}

export default VideoComponent;
