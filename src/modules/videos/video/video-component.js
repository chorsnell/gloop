import React from 'react';
import './video.scss';
import YouTube from 'react-youtube';
import TrackRange from '../../track/track-range';
import store from 'store';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import update from 'immutability-helper'; // ES6
import MIDISounds from 'midi-sounds-react';

import {
	faPen,
	faTrash,
	faPlay,
	faPause,
	faSave,
	faTachometerAlt,
	faDrum,
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
			playState: 0,
			progress: 0,
			duration: 100,
			range: [0, 100],
			playSpeed: 1,
			tracks: video.tracks || [],
			video: video,
			index: index, // video index
			progressBar: {},
			playingTrack: false, // this shows if we are playing a loopable track
			editTrack: null,
			count: 0,
			timeFirst: 0,
			timePrevious: 0,
			bpm: 0
		};

		this.speedArray = [0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1]; // sets available speeds on youtube speed selector

		console.log(this.state.video);

		this.onReady = this.onReady.bind(this);
		this.setSpeed = this.setSpeed.bind(this);
		this.videoTimerProgress = this.videoTimerProgress.bind(this);
		this.rangeHandler = this.rangeHandler.bind(this);
		this.saveTrack = this.saveTrack.bind(this);
		this.deleteTrack = this.deleteTrack.bind(this);

		this.handleKeys = this.handleKeys.bind(this);
		this.restartTrack = this.restartTrack.bind(this);
		this.seek = this.seek.bind(this);
		this.playPause = this.playPause.bind(this);
		this.setPlayState = this.setPlayState.bind(this);
		this.setMetronome = this.setMetronome.bind(this);
		this.stopMetronome = this.stopMetronome.bind(this);

		this.videoTimer = null;

		
		this.TrackRangeElement = React.createRef();

		this.handleChange = this.handleChange.bind(this); 

		this.progressbarClick = this.progressbarClick.bind(this);

		this.displayTime = this.displayTime.bind(this);
	}

	// TODO move keyboard shortcuts to its own component

	setMetronome() {
		const { count, timeFirst, timePrevious } = this.state;
		const timeSeconds = new Date();
		const time = timeSeconds.getTime();

		//if its been 3 seconds since last click reset the counter & previous time
		if (timePrevious !== 0 && time - timePrevious > 3000) {
			this.setState({
				count: 0,
				timePrevious: time,
			});
			return false;
		}
		//if first click set the initial time and count
		if (count === 0) {
			this.setState({
				timeFirst: time,
				count: count + 1,
			});
		} else {
			const bpmAvg = (60000 * count) / (time - timeFirst);
			let bpm = Math.round((bpmAvg * 100) / 100);
			this.setState({
				bpm,
				count: count + 1,
				timePrevious: time,
			});

			this.midiSounds.stopPlayLoop();
			this.midiSounds.startPlayLoop([[[49], []]], bpm, 1 / 4);
		}
	}
	
	stopMetronome() {
		this.setState({
			bpm: 0
		});
		this.midiSounds.stopPlayLoop();
	}

	handleKeys(key, e) {
		console.log(key, e);
		// c or ctrl+home
		if(key === 'c' || key === 'ctrl+home') {
			this.restartTrack();
		}
		// left or right
		if(key === 'left' || key === 'right') {
			this.seek(key);
		}
		// space
		if(key === 'space') {
			this.playPause();
		}
		if(key === 'b') {
			this.setMetronome();
		}
		if(key === 'n') {
			this.stopMetronome()
		}
		if(key === 's' || key === 'shift+s') {
			this.setSpeed(key);
		}
	}
	restartTrack() {
		console.log('restart');
		this.state.player.seekTo(this.state.range[0]);
	}
	seek(key) {
		let seekTo;
		if(key === 'left') { seekTo = this.state.player.getCurrentTime() - 5; }
		else { seekTo = this.state.player.getCurrentTime() + 5; }
		
		console.log('seek', key, this.state.player.getCurrentTime(), seekTo);
		this.state.player.seekTo(seekTo);
		// defocus so keyboard shortcuts work
		document.activeElement.blur();
	}
	playPause() {
		let playerState = this.state.player.getPlayerState();
		console.log('playPause', playerState);
		// if playing
		if(playerState === 1) {
			this.state.player.pauseVideo();
		}
		else {
			this.state.player.playVideo();
		}
		this.setPlayState();
		// defocus so keyboard shortcuts work
		document.activeElement.blur();
	}

	setPlayState() {
		let playerState = this.state.player.getPlayerState();
		console.log('playPause', playerState);
		// if playing
		this.setState({ playState: playerState});
	}

	//

	
	displayTime (seconds) {
		const format = val => `0${Math.floor(val)}`.slice(-2)
		const hours = seconds / 3600
		const minutes = (seconds % 3600) / 60
	  
		return [minutes, seconds % 60].map(format).join(':')
	}

	progressbarClick(e) {
		console.log(e.nativeEvent, e.nativeEvent.target, e.nativeEvent.toElement);
		let width = 0;

		// check if clicking on track-wrapper or track-progress
		if(e.nativeEvent.target.className === 'track-progress') {
			width = e.nativeEvent.path[1].offsetWidth;
		}
		else {
			width = e.nativeEvent.target.offsetWidth;
		}
		const percent = (100/width) * e.nativeEvent.offsetX;
		const seconds = (this.state.player.getDuration()/100) * percent;

		

		// checks if in loop
		if(seconds > this.state.range[0] && seconds < this.state.range[1]) {
			this.setState({ playingTrack: true });
		}
		else {
			this.setState({ playingTrack: false });
		}

		// sets state

		this.setState({ progressBar: {
			x: e.nativeEvent.offsetX,
			width: width,
			percent: percent,
			seconds: seconds,
		}}, () => {
			console.log(this.state.progressBar);
			this.state.player.seekTo(this.state.progressBar.seconds);
		});
	}

	handleChange(value, index) {
		//this.setState({trackName: event.target.value});
		console.log(value);
		this.setState({
			tracks: update(this.state.tracks, {[index]: {name: {$set: value}}})
		}, () => {
			console.log(this.state.video);
			const video = this.state.video;
			video.tracks = this.state.tracks;

			var videos = store.get('videos') || [];
			videos[this.state.index] = video;
			store.set('videos', videos);
		});
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
		// defocus so keyboard shortcuts work
		document.activeElement.blur();
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
		if(document.activeElement.tagName === 'IFRAME') {
			// defocus so keyboard shortcuts work
			document.activeElement.blur();
		}

		// sets state with progress
		this.setState({
			progress:
				(100 / this.state.player.getDuration()) *
				this.state.player.getCurrentTime(),
		});

		// if in loop, and current time outside of range, restart loop
		if (this.state.playingTrack === true && this.state.player.getCurrentTime() >= this.state.range[1]) {
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
		}, () => {
			// start timer
			this.videoTimer = setInterval(this.videoTimerProgress, 100);
		});
	}

	/**
	 * sets speed of video via player api
	 *
	 * @param {*} event can be event from select dropdown, or keystroke send from this.handleKeys
	 * @memberof VideoComponent
	 */
	setSpeed(event) {
		let speed;
		const index = this.speedArray.indexOf(this.state.playSpeed); // TODO trying to shift up / down the speed in the speedArray
		let newIndex = index;
		
		// if coming from keyboard shortcut
		if(event === 's' || event === 'shift+s') {
			// increase speed
			if(event === 's') {
				// if not max speed
				if (index !== this.speedArray.length-1) {
					newIndex = index+1;
				}
			}
			// decrease speed
			else if(event === 'shift+s') {
				// if not min speed
				if (index !== 0) {
					newIndex = index-1;
				}
			}
			// sets speed based on next / prev speedArray
			speed = this.speedArray[newIndex];
		}
		// if coming from select dropdown
		else {
			// sets speed from select dropdown
			speed = parseFloat(event.target.value); // setPlaybackRate wont accept strings
		}
		
		// set state
		this.setState({
			playSpeed: speed
		});
		// sets youtube playback rate
		this.state.player.setPlaybackRate(speed);
		// defocus so keyboard shortcuts work
		document.activeElement.blur();
	}

	/**
	 * Handles data returned from range track
	 *
	 * @param {*} event
	 * @memberof VideoComponent
	 */
	rangeHandler(event) {
		// sets in loop
		this.setState({
			playingTrack: true
		});
		// sets track range
		this.TrackRangeElement.current.changeTrack(event);
		console.log('rangeHandler', event);
		// sets range in state
		this.setState({
			range: event,
		});
		// resets player to start of range
		this.state.player.seekTo(event[0]);
		// play video
		this.state.player.playVideo();
		// defocus so keyboard shortcuts work
		document.activeElement.blur();
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
					handleKeys={['c', 'ctrl+home', 'left', 'right', 'space', 'b', 'n', 's', 'shift+s']}
					onKeyEvent={(key, e) => this.handleKeys(key, e)} />
				<section className="main">
					<YouTube
						videoId={this.state.videoId} 
						onReady={this.onReady}
						onStateChange={this.setPlayState}
						opts={opts}
						containerClassName="video"
					/>
					<div className="controls">
						<div className="track-wrapper" 
								onClick={this.progressbarClick}>
							<div
								className="track-progress"
								style={{ width: this.state.progress + '%' }}
							></div>
						</div>
						<TrackRange rangeHandler={this.rangeHandler} displayTime={this.displayTime} duration={this.state.duration} ref={this.TrackRangeElement} />
						<div className="buttons">
							<div className="left">
								<button onClick={this.playPause}>
									{
										this.state.playState === 1
										?
										<FontAwesomeIcon icon={faPause} />
										:
										<FontAwesomeIcon icon={faPlay} />
									}
								</button>
								
								<button onClick={this.setMetronome}><FontAwesomeIcon icon={faDrum} /></button>
								{
									this.state.bpm > 0
									?
									<span>
										<button onClick={this.stopMetronome}>BPM: {this.state.bpm}</button>
									</span>
									:
									<span></span>
								}
								<MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} />
							</div>
							<div className="center">
								<button onClick={this.saveTrack}><FontAwesomeIcon icon={faSave} /></button>
							</div>
							<div className="right">
								<span className="fa">
									<FontAwesomeIcon icon={faTachometerAlt} />
									<select value={this.state.playSpeed} onChange={this.setSpeed}>
										{this.speedArray.map(fbb =>
											<option key={fbb} value={fbb}>{(fbb*100).toFixed()+'%'}</option>
										)};
									</select>
								</span>
							</div>
						</div>
					</div>
				</section>
				<section className="nav">
					{
						this.state.tracks.length === 0
						?
						<div className="no-tracks">
							<h2>No loops saved</h2>
							<p>Create one by using the range sliders at the bottom then pressing 'save'</p>
						</div>
						: null
					}
					<ul>
						{this.state.tracks.map((track, index) =>
							<li key={index}>

								
								{ this.state.editTrack === index
									?
									<form onSubmit={() => this.setState({ editTrack: null })}>
										<input autoFocus type="text" value={track.name} onChange={e => this.handleChange(e.target.value, index)} />
										<button>Save</button>
									</form>
									:
									<div>
									<a onClick={() => this.rangeHandler(track.range)}>
										{track.name}<br />
										{this.displayTime(track.range[0])} - {this.displayTime(track.range[1])}
									</a>
									<span>
										<button onClick={() => this.setState({ editTrack: index })}><FontAwesomeIcon icon={faPen} /></button>
										<button onClick={() => this.deleteTrack(index)}><FontAwesomeIcon icon={faTrash} /></button>
									</span>
									</div>
								}

							</li>
						)}
					</ul>
				</section>
			</div>
		);
	}
}

export default VideoComponent;
