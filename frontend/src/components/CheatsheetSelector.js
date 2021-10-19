import React, { useState } from 'react';
import UserContext from '../context/UserContext';
import dbUtils from '../utils/dbUtils';
import CheatsheetContext from '../context/CheatsheetContext';

const CheatsheetSelector = () => {
  const [cheatsheets, setCheatsheets] = useState([]);
  const [cheatsheetsFiltered, setCheatsheetsFiltered] = useState([]);
  const [cheatsheetName, setCheatsheetName] = useState('');
  const [cheatsheetSearch, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [rerender, setRerender] = useState(false);
  const { user } = React.useContext(UserContext);
  const { selectedCheatsheet, setSelectedCheatsheet } = React.useContext(CheatsheetContext);

  const getCheatsheets = async () => {
    const query = `select id_cheatsheet, title from Cheatsheet join Permission using (id_cheatsheet) join User using (id_user) where username='${user}'`;
    try {
      const results = await dbUtils.getRows(query);
      if (Array.isArray(results)) {
        setCheatsheets(results);
        setCheatsheetsFiltered(results);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const newCheatsheet = async () => {
    try {
      const results = await fetch(`/api/cheatsheet?title=${cheatsheetName}&username=${user}`, { method: 'PUT' });
      if (results.status !== 200) {
        console.log('something went wrong');
        return;
      }
      setShow(false);
      setRerender(!rerender);
    } catch (err) {
      throw new Error(err);
    }
  };

  const SearchHandler = (e) => {
    const { value } = e.target;
    setSearch(value);
    setCheatsheetsFiltered(cheatsheets.filter(({ title }) => title.includes(cheatsheetSearch)));
  };

  const NamingHandler = (e) => {
    const { value } = e.target;
    setCheatsheetName(value);
    if (e.keyCode === 13) {
      newCheatsheet();
    }
  };

  const cleanUp = () => {
    setSearch('');
    setCheatsheetName('');
    setShow(false);
    setCheatsheetsFiltered(cheatsheets);
  };

  const AddToCheatsheet = async (title) => {
    setSelectedCheatsheet(title);
    try {
      await fetch(`/api/cheatsheet&title=${title}`);
    } catch (err) {
      throw new Error(err);
    }
  };

  React.useEffect(() => {
    getCheatsheets();
  }, [rerender]);

  return (
    <>
      <div className="selector" onMouseLeave={cleanUp}>
        <div className="dropdown-selector">
          <input type="text" placeholder="Buscar..." onChange={SearchHandler} value={cheatsheetSearch} />
          <div style={{ marginTop: '5px' }}>
            {cheatsheetsFiltered.map(({ id_cheatsheet, title }) => (
              <button
                type="button"
                key={id_cheatsheet}
                className="dropdown-item"
                onClick={() => AddToCheatsheet(title)}
              >
                {title}
                {selectedCheatsheet === title && <i className="fa fa-check" />}
              </button>
            ))}
          </div>
          {show || <button type="button" className="new-button" onClick={() => setShow(true)}>Crear hoja nueva</button>}
          {show && (
          <div className="add-cheatsheet">
            <input type="text" placeholder="Titulo" onChange={NamingHandler} value={cheatsheetName} />
            <button type="button" className="new-button" onClick={newCheatsheet}>
              <i className="fa fa-check" />
            </button>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheatsheetSelector;
