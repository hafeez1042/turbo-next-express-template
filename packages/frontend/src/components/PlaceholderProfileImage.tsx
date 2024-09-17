import React from "react";

export const PlaceholderProfileImage: React.FC<
  IPlaceholderProfileImageProps
> = (props) => {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3689_9075)">
        <rect width="96" height="96" rx="48" fill="#757986" />
        <g opacity="0.18">
          <path
            d="M13.5879 92.8296C13.5879 75.4893 29.2963 61.9473 47.9997 61.9473C66.7031 61.9473 82.4114 75.4893 82.4114 92.8296V95.4767H13.5879V92.8296Z"
            fill="white"
          />
          <path
            d="M29.4707 38.1232C29.4707 27.8896 37.7666 19.5938 48.0001 19.5938C58.2336 19.5938 66.5295 27.8896 66.5295 38.1232C66.5295 48.3567 58.2336 56.6526 48.0001 56.6526C37.7666 56.6526 29.4707 48.3567 29.4707 38.1232Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_3689_9075">
          <rect width="96" height="96" rx="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface IPlaceholderProfileImageProps {}
