import React, { useEffect } from 'react';
import {useParams} from 'react-router-dom';
import MathJax from '@innodoc/react-mathjax-node';
import '../index.css';

const InputFormula = () => {
    const {id} = useParams();
    let isNew;
    if (id) isNew = false
    const [item, setItem] = React.useState({});

    useEffect(() => {
        getFormula(id, setItem);
    },[]);

    const getFormula = async(id, setItem) => {
        const defaultItem = {title:'',equation:'',txt:''};
        if (id) {
            const query = `select * from formulapp.equations where id_equation=${parseInt(id)}`;
            const response = await fetch(`http://localhost:4000/query?query=${query}`);
            const results = await response.json();
            setItem(results.results[0]);
        } else {
            setItem(defaultItem);
        }
    }

    const addFormula = (item) => {
        let {title, equation, txt} = item;
        title = title.replace(/\\/g,'\\\\');
        equation = equation.replace(/\\/g,'\\\\');
        txt = txt.replace(/\\/g,'\\\\');
        txt = txt.replace(/<br\s*[/]?>/gi, "\n");
        fetch(`http://localhost:4000/add?title=${title}&equation=${equation}&txt=${txt}`)
            .then(response => response.json())
            .catch(err => console.error(err));
    }

    const editFormula = (item) => {
        let {title, equation, txt} = item;
        title = title.replace(/\\/g,'\\\\');
        equation = equation.replace(/\\/g,'\\\\');
        txt = txt.replace(/\\/g,'\\\\');
        txt = txt.replace(/<br\s*[/]?>/gi, "\n");
        fetch(`http://localhost:4000/edit?id=${parseInt(id)}&title=${title}&equation=${equation}&txt=${txt}`)
            .then(response => response.json())
            .catch(err => console.error(err));
    }
    
    const changeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setItem({...item, [name]:value});
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if(isNew){
            addFormula(item);
        } else {
            editFormula(item);
        }
        setItem({});
    }

    return(
        <article className='grid'>
            <div className="input-formula">
                <form onSubmit={submitHandler}>
                    <label htmlFor="formulaTitle">Title</label>
                    <input type="text" id="formulaTitle" name="title" onChange={changeHandler} value={item.title}/>
                    <label htmlFor="formulaEquation">Equation</label>
                    <input type="text" id="formulaEquation" name="equation" onChange={changeHandler} value={item.equation}/>
                    <label htmlFor="formulaTxt">Description</label>
                    <textarea id="formulaTxt" name="txt" onChange={changeHandler} value={item.txt}/>
                </form>
                <MathJax.Provider>
                    <MathJax.MathJaxNode displayType="inline" texCode={item.equation} />
                </MathJax.Provider>
                <button type="submit" onClick={submitHandler}>Enviar</button>
            </div>
        </article>
    )
}

export default InputFormula;