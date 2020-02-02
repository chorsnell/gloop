import React from 'react';

function VideoListItemComponent({ video }) {

  return (
    <li key={video.id}>
        <a href={ '/video/' + video.id }>
            <img src={ 'https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg' } />
            <div>({video.tracks.length}) {video.title}</div>
        </a>
    </li>
  );
}

export default VideoListItemComponent;