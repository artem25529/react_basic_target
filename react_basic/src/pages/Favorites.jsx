import { useContext, useEffect, useState } from 'react';
import { PageWrapperContext } from './PageWrapper.jsx';
import PostList from '../components/PostList.jsx';
import Loader from '../components/Loader.jsx';
import postService from '../services/postService.js';
import '../styles/Favorites.css';
import windowUtils from '../services/windowUtils.js';

const MAX_PAGE_LINKS = 7;
const LINKS_AROUND_CURRENT = Math.floor((MAX_PAGE_LINKS - 2) / 2);

function Favorites() {
  const { favorites, setErrorMsg } = useContext(PageWrapperContext);

  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(+1);
  const [pageNumbers, setPageNumbers] = useState([]);

  const [response, setResponse] = useState({
    pages: null,
    data: null,
    error: null,
    isInProgress: false,
    isDone: false,
  });

  useEffect(() => {
    if (favorites?.length > 0) {
      const params = {
        _page: page,
        _limit: 3,
        id_like: `^(${favorites.join('|')})$`,
      };

      postService.getPostsWUrlParams(params, setResponse);
    }
  }, [page]);

  useEffect(() => {
    if (response.isDone) {
      if (response.error) {
        setErrorMsg('Error loading posts!');
      } else if (response.data) {
        setPostList(response.data);

        setPagination();
      }
    }

    if (response.isInProgress) {
      windowUtils.toggleWindowScroll(false);
    } else {
      windowUtils.toggleWindowScroll(true);
    }
  }, [response]);

  function setPagination() {
    if (response.pages) {
      const curPage = +page;
      const pageNumbersTemp = [];

      if (response.pages.last <= MAX_PAGE_LINKS) {
        for (let i = 1; i <= response.pages.last; i++) {
          pageNumbersTemp.push(i);
        }
      } else {
        let secondLink =
          curPage - LINKS_AROUND_CURRENT <= 1
            ? 2
            : curPage - LINKS_AROUND_CURRENT;

        let lastButOneLink =
          curPage + LINKS_AROUND_CURRENT >= response.pages.last
            ? response.pages.last - 1
            : curPage + LINKS_AROUND_CURRENT;

        if (curPage - LINKS_AROUND_CURRENT <= 1) {
          const res = curPage - LINKS_AROUND_CURRENT;

          for (let i = res; i <= 1; i++) {
            lastButOneLink++;
          }
        }

        if (curPage + LINKS_AROUND_CURRENT >= response.pages.last) {
          const res = curPage + LINKS_AROUND_CURRENT;

          for (let i = response.pages.last; i <= res; i++) {
            secondLink--;
          }
        }

        pageNumbersTemp.push(1);

        for (let i = secondLink; i <= lastButOneLink; i++) {
          pageNumbersTemp.push(i);
        }

        pageNumbersTemp.push(response.pages.last);

        if (pageNumbersTemp[1] - pageNumbersTemp[0] > 1) {
          pageNumbersTemp.splice(1, 0, '...');
        }

        if (pageNumbersTemp.at(-1) - pageNumbersTemp.at(-2) > 1) {
          pageNumbersTemp.splice(-1, 0, '...');
        }
      }

      setPageNumbers(pageNumbersTemp);
    } else {
      setPageNumbers([]);
    }
  }

  function handlePageChange(e) {
    const targetPage = +e.currentTarget.dataset.pageNum;

    if (
      !targetPage ||
      targetPage === page ||
      targetPage < 1 ||
      targetPage > response.pages.last
    ) {
      return;
    }

    setPage(targetPage);
  }

  return (
    <section className="favorites-page">
      {response.isInProgress && (
        <Loader
          text="Loading"
          spinner={2}
          background={true}
          vpFixedContent={true}
        />
      )}

      <div className="favorites-title">
        {favorites?.length > 0
          ? 'Your favorite posts.'
          : "You don't have favorite posts yet."}
      </div>

      {postList.length > 0 && <PostList posts={postList} />}

      {pageNumbers?.length > 0 && (
        <section className="favorites-pagination">
          <button
            type="button"
            className={
              'page-num arrow fast' +
              (page === pageNumbers[0] ? ' disabled' : '')
            }
            data-page-num={pageNumbers[0]}
            onClick={handlePageChange}
          >
            <span className="material-symbols-outlined">first_page</span>
          </button>

          <button
            type="button"
            className={
              'page-num arrow' + (page === pageNumbers[0] ? ' disabled' : '')
            }
            data-page-num={page - 1}
            onClick={handlePageChange}
          >
            <span className="material-symbols-outlined">chevron_backward</span>
          </button>

          {pageNumbers.map((val) => (
            <button
              type="button"
              data-page-num={typeof val === 'number' ? val : undefined}
              key={val}
              className={
                typeof val === 'number'
                  ? 'page-num' + (page === val ? ' active' : '')
                  : 'dots'
              }
              onClick={handlePageChange}
            >
              {val}
            </button>
          ))}

          <button
            type="button"
            className={
              'page-num arrow' +
              (page === pageNumbers.at(-1) ? ' disabled' : '')
            }
            data-page-num={+page + 1}
            onClick={handlePageChange}
          >
            <span className="material-symbols-outlined">chevron_forward</span>
          </button>
          <button
            type="button"
            className={
              'page-num arrow fast' +
              (page === pageNumbers.at(-1) ? ' disabled' : '')
            }
            data-page-num={pageNumbers.at(-1)}
            onClick={handlePageChange}
          >
            <span className="material-symbols-outlined">last_page</span>
          </button>
        </section>
      )}
    </section>
  );
}

export default Favorites;
