import React from 'react';
import PropTypes from 'prop-types';

const CourseVideoPlayer = ({ youtubeUrl, className = '' }) => {
  // Extract video ID from various YouTube URL formats
  const videoId = youtubeUrl?.match(/(?:youtu\.be\/|v=|\/v\/|\/embed\/|\/watch\?v=|\/watch\?.+&v=)([^&?\/]+)/)?.[1];
  
  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
        className="absolute inset-0 w-full h-full rounded-lg shadow-md"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
        loading="lazy"
      />
    </div>
  );
};

CourseVideoPlayer.propTypes = {
  youtubeUrl: PropTypes.string.isRequired,
  className: PropTypes.string // For custom styling
};

export default CourseVideoPlayer;