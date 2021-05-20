import React from 'react';

const useMobile = () => {
  const [width, setWidth] = React.useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = (width <= 768);
  return isMobile;
};

export default useMobile;
