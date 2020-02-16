import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

import React, { Component  } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import VideosListComponent from './modules/videos/videos-list-component';
import VideoComponent from './modules/videos/video/video-component';

// https://medium.com/firebase-developers/how-to-setup-firebase-authentication-with-react-in-5-minutes-maybe-10-bb8bb53e8834
import firebaseApp from './firebase';

class App extends Component {
	render() {
	  const {
		user,
		signOut,
		signInWithGoogle,
	  } = this.props;
  
	  return (
		<div className="App">
		  <header className="App-header">
			{
			  user
				? <p>Hello, {user.displayName} {user.uid}}</p>
				: <p>Please sign in.</p>
			}
  
			{
			  user
				? <button onClick={signOut}>Sign out</button>
				: <button onClick={signInWithGoogle}>Sign in with Google</button>
			}
		  </header>

		  <Router>
			<div className="wrapper">
				<Switch>
					<Route exact path="/">
            <VideosListComponent></VideosListComponent>
					</Route>
					<Route path="/video/:id" component={VideoComponent} />
				</Switch>
			</div>
		</Router>
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
  })(App);
