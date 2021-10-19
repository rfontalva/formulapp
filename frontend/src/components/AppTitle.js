import React from 'react';
import MathJax from '@innodoc/react-mathjax-node';

const AppTitle = React.forwardRef((_, ref) => (
  <div ref={ref} id="app-title">
    <a style={{ textDecoration: 'none', color: 'inherit' }} href="/">
      <h1 style={{ display: 'inline' }}>Formulapp</h1>
      <MathJax.Provider>
        <MathJax.MathJaxNode style={{ marginLeft: '2rem' }} displayType="inline" texCode="e^{-j\pi}+1=0" />
      </MathJax.Provider>
    </a>
  </div>
));

export default AppTitle;
