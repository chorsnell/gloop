import React from 'react';
import VideoListItemComponent from './video-list-item-component';
import './Videos.css';


function VideosListComponent() {

  const videos = [
    {
      "url": "https://www.youtube.com/watch?v=WGoDaYjdfSg",
      "title": "The Jimi Hendrix Experience - Purple Haze (Audio)",
      "img": "https://i.ytimg.com/vi/WGoDaYjdfSg/hqdefault.jpg"
    },
    {
      "url": "https://www.youtube.com/watch?v=tAGnKpE4NCI",
      "title": "Metallica: Nothing Else Matters (Official Music Video)",
      "img": "https://i.ytimg.com/vi/tAGnKpE4NCI/hqdefault.jpg"
    },
    {
      "url": "https://www.youtube.com/watch?v=xnKhsTXoKCI",
      "title": "Metallica-Master Of Puppets (Lyrics)",
      "img": "https://i.ytimg.com/vi/xnKhsTXoKCI/hqdefault.jpg"
    }
  ];

  return (
    <ul>
        {videos.map(function(video, index) {
					return <VideoListItemComponent key={index} video={video} />;
				})}
    </ul>
  );
}

export default VideosListComponent;
