import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../animations/data-illustration.json'; // adjust path if needed

const AnimationComponent = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default AnimationComponent;