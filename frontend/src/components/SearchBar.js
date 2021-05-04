import React from 'react';
import '../index.css';
import utils from '../utils/urlUtils';

const SearchBar = () => {
  const [search, setSearch] = React.useState('');

  const changeHandler = (e) => {
    setSearch(e.target.value);
  };

  const clickHandler = () => {
    if (search !== '') utils.goToUrl(`search/${search}`);
  };

  return (
    <div className="search-box">
      <input type="text" id="searchBox" name="searchBox" placeholder="Buscar..." onChange={changeHandler} value={search} />
      <button
        aria-label="Search"
        type="button"
        title="Delete formula"
        onClick={clickHandler}
      >
        <i
          className="fa fa-search"
        />
      </button>
    </div>
  );
};

export default SearchBar;
