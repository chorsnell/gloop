import React from 'react';

function VideoListItemComponent({ video }) {

  return (
    <li key={video.id}>
        <a href="/video">
            <img src={ video.img } />
            <div>{video.title}</div>
        </a>
    </li>
  );
}

export default VideoListItemComponent;