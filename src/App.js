import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import VideosListComponent from './modules/videos/videos-list-component';
import VideoComponent from './modules/videos/video/video-component';

function App() {
  return (
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
  );
}

export default App;
