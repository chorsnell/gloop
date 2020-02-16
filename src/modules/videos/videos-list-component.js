import React from 'react';
import VideoListItemComponent from './videos-list-item-component';
import './Videos.scss';
import store from 'store';
import queryString from 'query-string';

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import firebaseApp, { todosRef, databaseRef } from '../../firebase';

const videosMock = [{
	"title": "The Jimi Hendrix Experience - Purple Haze (Audio)",
	"id": "WGoDaYjdfSg",
	"tracks": [{
		"name": "intro",
		"range": [0, 23.5],
		"edit": false
	}, {
		"name": "chords",
		"range": [23, 73],
		"edit": false
	}, {
		"name": "solo",
		"range": [72.5, 97.5],
		"edit": false
	}]
}, {
	"title": "Metallica: Nothing Else Matters (Official Music Video)",
	"id": "tAGnKpE4NCI",
	"tracks": [{
		"name": "intro - marty p1",
		"range": [0, 37.5],
		"edit": false
	}, {
		"name": "barre chord picking - marty p3",
		"range": [37, 60.5],
		"edit": false
	}, {
		"name": "marty p2",
		"range": [60, 126],
		"edit": false
	}, {
		"name": "chords",
		"range": [125.5, 141.5],
		"edit": false
	}, {
		"name": "melodic picking",
		"range": [183, 226],
		"edit": false
	}, {
		"name": "solo",
		"range": [295.5, 324.5],
		"edit": false
	}]
}, {
	"title": "Metallica-Master Of Puppets (Lyrics)",
	"id": "xnKhsTXoKCI",
	"tracks": [{
		"name": "intro",
		"range": [3, 22],
		"edit": false
	}, {
		"name": "New Loop",
		"range": [21.5, 31]
	}, {
		"name": "New Loop",
		"range": [31, 50.5]
	}]
}, {
	"title": "Iron Maiden - Afraid To Shoot Strangers (Official Video)",
	"id": "0c9iYZdsZMM",
	"tracks": [{
		"name": "intro",
		"range": [0, 38],
		"edit": false
	}, {
		"name": "rhythm",
		"range": [0, 159],
		"edit": false
	}, {
		"name": "epic riff",
		"range": [158.5, 214.5],
		"edit": false
	}, {
		"name": "gallop",
		"range": [213, 247.5],
		"edit": false
	}, {
		"name": "solo",
		"range": [245.5, 277.5],
		"edit": false
	}, {
		"name": "afraid!!",
		"range": [276, 308],
		"edit": false
	}, {
		"name": "bridge",
		"range": [323, 347.5],
		"edit": false
	}]
}, {
	"title": "Blues Jam Track Key of A (Blues Backing Tracks)",
	"id": "zj9lDIqVTuI",
	"tracks": [{
		"name": "New Loop",
		"range": [0, 350]
	}]
}];

class VideosListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		//value: 'ZZYWbx8mqZc',
		//value: '8R6StQfLNbw',
		//value: 'ogl16QSw6aY',
		value: '',
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
			"id": ytUrl.query.v,
			"tracks": [],
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

  componentDidMount() {
	console.log('componentDidMount', this.props);

	// check for auth state change
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
		  console.log('user', user);
		} else {
		  // User is signed out.
		  // ...
		}
	  });
  }

  

  componentDidUpdate() {
	//console.log('componentDidUpdate', this.props);
/* 	if (this.props.user && this.props.user.uid) {
		console.log('uid', this.props.user.uid);
		console.log('currentUser', firebase.auth().currentUser);

		const newvideos = videosMock.map(obj => ({ ...obj, uid: this.props.user.uid }));

		this.state.videos.map(obj => {
			console.log('obj', obj);

			todosRef.child(obj.id).set({ ...obj, uid: this.props.user.uid });
		});

		console.log(newvideos);
	} */
  }

  render() {
    return (
      <div className="videos-list">
        <form onSubmit={this.handleSubmit}>
        	<input type="text" value={this.state.value} placeholder="https://www.youtube.com/watch?v=PewShF3gNG4" onChange={this.handleChange} />
        	<button>Import</button>
        </form>
		<div className="intro">
			<h1>gLoop - Youtube Video looper for Guitar</h1>
			<p>Import any Youtube URL, or try out one of these pre-configured demos</p>
		</div>

        <ul>
            {this.state.videos.map(function(video, index) {
              return <VideoListItemComponent key={index} video={video} />;
            })}
        </ul>
      </div>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export default withFirebaseAuth({
	providers,
	firebaseAppAuth,
  })(VideosListComponent);