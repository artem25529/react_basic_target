import { useEffect, useRef, useState, useContext } from 'react';
import { PageWrapperContext } from '../pages/PageWrapper.jsx';
import urlUtils from '../utils/urlUtils.js';
import localStorageService from '../services/localStorageService.js';
import '../styles/SortAndSearch.css';

function SortAndSearch({ searchParams, setSearchParams }) {
  const { user } = useContext(PageWrapperContext);
  const [input, setInput] = useState(searchParams.query);
  const timeout = useRef();

  useEffect(() => {
    handleQueryChange();
  }, [input]);

  function handleSortChange(e) {
    let sort, order;
    const sortField = e.currentTarget.dataset.sort;

    if (sortField === searchParams.sort) {
      if (searchParams.order === 'asc') {
        order = 'desc';
        sort = sortField;
      } else {
        order = null;
        sort = null;
      }
    } else {
      sort = sortField;
      order = 'asc';
    }

    localStorageService.setItemForUser(user, 'sort', sort);
    localStorageService.setItemForUser(user, 'order', order);

    if (sort) {
      urlUtils.changeQuery({
        sort: { operation: 'set', value: sort },
        order: { operation: 'set', value: order },
      });
    } else {
      urlUtils.changeQuery({
        sort: { operation: 'delete' },
        order: { operation: 'delete' },
      });
    }

    setSearchParams((prev) => ({ ...prev, sort: sort, order: order }));
  }

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function handleQueryChange() {
    clearTimeout(timeout.current);

    if (input !== searchParams.query) {
      timeout.current = setTimeout(() => {
        changeQuery(input);
      }, 1000);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    clearTimeout(timeout.current);

    changeQuery(input);
  }

  function changeQuery(value) {
    localStorageService.setItemForUser(user, 'query', value);

    if (value) {
      urlUtils.changeQuery({ query: { operation: 'set', value: value } });
    } else {
      urlUtils.changeQuery({ query: { operation: 'delete' } });
    }

    setSearchParams((prev) => ({ ...prev, query: value }));
  }

  return (
    <section className="sort-search-container">
      <div className="sort-wrapper">
        <div className="sort-title">Sorting:</div>
        <div className="sort-fields">
          <div
            data-sort="views"
            className={
              'sort-field' + (searchParams.sort === 'views' ? ' active' : '')
            }
            onClick={handleSortChange}
          >
            <button type="button" className="sort-prop">
              <span className="material-symbols-outlined">visibility</span>
            </button>

            {searchParams.sort !== 'views' && (
              <span className="material-symbols-outlined sort-icon">
                sync_alt
              </span>
            )}

            {searchParams.sort === 'views' && searchParams.order === 'asc' && (
              <span className="material-symbols-outlined">straight</span>
            )}

            {searchParams.sort === 'views' && searchParams.order === 'desc' && (
              <span data-order="desc" className="material-symbols-outlined">
                straight
              </span>
            )}
          </div>
          <div
            data-sort="likes"
            className={
              'sort-field' + (searchParams.sort === 'likes' ? ' active' : '')
            }
            onClick={handleSortChange}
          >
            <button type="button" className="sort-prop">
              <span className="material-symbols-outlined">thumb_up</span>
            </button>

            {searchParams.sort !== 'likes' && (
              <span className="material-symbols-outlined sort-icon">
                sync_alt
              </span>
            )}

            {searchParams.sort === 'likes' && searchParams.order === 'asc' && (
              <span className="material-symbols-outlined">straight</span>
            )}

            {searchParams.sort === 'likes' && searchParams.order === 'desc' && (
              <span data-order="desc" className="material-symbols-outlined">
                straight
              </span>
            )}
          </div>
        </div>
      </div>
      <form className="search-wrapper" onSubmit={handleFormSubmit}>
        <label htmlFor="search">
          <span className="material-symbols-outlined">search</span>
        </label>
        <input
          type="text"
          id="search"
          placeholder="Search..."
          value={input}
          onChange={handleInputChange}
        />
        {input && (
          <button type="reset" onClick={() => setInput('')}>
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </form>
    </section>
  );
}

export default SortAndSearch;
