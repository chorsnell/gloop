import React from 'react';

function VideoListItemComponent({ video }) {

  return (
    <li key={video.id}>
        <a href={ '/video/' + video.id }>
            <img src={ video.img } />
            <div>{video.title}</div>
        </a>
    </li>
  );
}

export default VideoListItemComponent;