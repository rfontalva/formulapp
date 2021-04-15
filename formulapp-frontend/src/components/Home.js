import React from 'react';
import Formula from './Formula';

const Home = () => {
    const [formulas, setFormulas] = React.useState([]);
    const getFormulas = () => {
        fetch('http://localhost:4000/')
            .then(response => response.json())
            .then(response => setFormulas(response.results))
            .catch(err => console.error(err));
    }

    React.useEffect(() =>{
        console.log('rerender');
        getFormulas();
    }, []);

    const handleRemove = (id) => {
        fetch(`http://localhost:4000/remove?id_equation=${id}`)
            .then(response => response.json())
            .catch(err => console.error(err));
        getFormulas();
    }

    return(
        <> 
            <div className="container">
                {formulas.map(({id_equation, title, equation, txt})=>{
                    return <Formula key={id_equation} id={id_equation} title={title} equation={equation} txt={txt} handleRemove={handleRemove}/>;
                })}
            </div>
        </>
    );
}

export default Home;