import React from 'react';
import VideoListItemComponent from './videos-list-item-component';
import './Videos.css';
import store from 'store';
import queryString from 'query-string';

const videosMock = [
  {
    "title": "The Jimi Hendrix Experience - Purple Haze (Audio)",
    "id": "WGoDaYjdfSg"
  },
  {
    "title": "Metallica: Nothing Else Matters (Official Music Video)",
    "id": "tAGnKpE4NCI"
  },
  {
    "title": "Metallica-Master Of Puppets (Lyrics)",
    "id": "xnKhsTXoKCI"
  },
  {
    "title": "The Troggs- Wild Thing",
    "id": "4qHX493bB3U"
  },
  {
    "title": "Oasis - Songbird (Official Video)",
    "id": "0KJgBkreAuw"
  }
];

class VideosListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		//value: 'ZZYWbx8mqZc',
		//value: '8R6StQfLNbw',
		//value: 'ogl16QSw6aY',
		value: 'https://www.youtube.com/watch?v=PewShF3gNG4',
		videos: store.get('videos') || videosMock
    };

    store.set('videos', this.state.videos);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    //alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
	var that = this;
	
	// parse url
	var ytUrl = queryString.parseUrl(this.state.value);
	console.log('url', ytUrl.query.v);

	// TODO check if already exists

	if(!ytUrl.query.v) {
		alert('Not valid youtube URL, try like https://www.youtube.com/watch?v=PewShF3gNG4');
	}
	else {

	// run youtube api request
    var API_key = "AIzaSyDN3VqrUy4NsJv9D-3yR9pYgE9WRxS4LMA";
    var maxResults = 10;
    var url =
      "https://www.googleapis.com/youtube/v3/videos?key=" +
      API_key +
      "&id=" +
      ytUrl.query.v +
      "&part=snippet,id&order=date&maxResults=" +
	  maxResults;


    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        console.log(data.items[0].snippet.title)
        
        that.setState(state => {
          const videos = [...state.videos, {
            "title": data.items[0].snippet.title,
            "id": state.value,
          }];
    
          store.set('videos', videos);
          
          return {
            videos: videos,
            value: '',
          };
        });
      })
      .catch(error => {
        console.error(error);
      });
    
	}
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Import:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ul>
            {this.state.videos.map(function(video, index) {
              return <VideoListItemComponent key={index} video={video} />;
            })}
        </ul>
      </div>
    );
  }
}

export default VideosListComponent;