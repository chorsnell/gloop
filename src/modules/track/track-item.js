import React from 'react';

//function TrackItemComponent({ track, index }) {
class TrackItemComponent extends React.Component {
	/**
	 *Creates an instance of VideoComponent.
		* @param {*} props
		* @memberof VideoComponent
		*/
	constructor(props) {
		super(props);

		this.state = {
			player: null,
			track: this.props.track,
			index: this.props.index,
		};

		//this.onReady = this.onReady.bind(this);
		this.TrackRangeElement = React.createRef();
	}


	render() {
		return (
			<li key={this.state.index}>
				<a onClick={this.props.rangeHandler(this.state.track.range)}>
					{this.state.track.name}<br></br>
					{this.state.track.range[0]} - {this.state.track.range[1]}
				</a>
				<button onClick={() => this.editTrack(this.state.index)}>edit</button> - <button onClick={() => this.deleteTrack(this.state.index)}>delete</button>
				<form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.track.name} onChange={this.handleChange} />
					<input type="submit" value="Submit" />
				</form>
			</li>
		);
	}
}

export default TrackItemComponent;