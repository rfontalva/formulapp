import React from 'react'
import {Link} from 'react-router-dom';
import MathJax from '@innodoc/react-mathjax-node'
import '../index.css'

const Formula = (props) => {
    return(
        <article className="formula">
            <h3 className="formula-title">{props.title}</h3>
            <button className='formula-button' title='Delete formula' onClick={() => props.handleRemove(props.id)}><i className='fa fa-trash'></i></button>
            <Link className='formula-button' title='Edit formula' to={`/edit/${props.id}`}><i className='fa fa-edit'></i></Link>
            <div style={{clear:"both"}}></div>
            <MathJax.Provider>
                <MathJax.MathJaxNode displayType="inline" texCode={props.equation} />
            </MathJax.Provider>
            <p>{props.txt}</p>
        </article>
    );
}

export default Formula;