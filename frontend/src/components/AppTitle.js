import React from 'react';
import MathJax from '@innodoc/react-mathjax-node';

const AppTitle = React.forwardRef((_, ref) => (
  <div ref={ref} className="app-title">
    <h1 style={{ display: 'inline' }}>Formulapp</h1>
    <MathJax.Provider>
      <MathJax.MathJaxNode style={{ marginLeft: '2rem' }} displayType="inline" texCode="e^{-j\pi}+i=0" />
    </MathJax.Provider>
  </div>
));

export default AppTitle;