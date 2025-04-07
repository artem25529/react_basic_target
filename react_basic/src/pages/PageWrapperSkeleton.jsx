import Skeleton, { BoxSkeleton } from '../components/Skeleton.jsx';
import BlogSkeleton from './BlogSkeleton.jsx';

function PageWrapperSkeleton() {
  const icons = [];

  for (let i = 0; i < 4; i++) {
    icons.push(<BoxSkeleton width="2.8em" height="2.8em" />);
  }
  return (
    <Skeleton main={true} pulser={true}>
      <div className="page-wrapper-skeleton-wrapper">
        <div className="page-wrapper-skeleton-header">
          <div className="logo-container">
            <BoxSkeleton width="2.5em" height="2.5em" />
            <div className="logo-text title"></div>
          </div>
          <div className="links">
            <div className="title"></div>
            <div className="title"></div>
            <div className="title"></div>
          </div>
          <div className="right">
            <div className="button"></div>
            <div className="button"></div>
            <div className="button"></div>
          </div>
        </div>
        <div className="page-wrapper-skeleton-content">
          <div className="page-wrapper-skeleton-footer">
            <div className="footer-wrapper">
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="links">{icons}</div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
          </div>
          <div className="page-wrapper-skeleton-main">
            <BlogSkeleton />
          </div>
          <div className="page-wrapper-skeleton-aside">
            <BoxSkeleton width="14em" height="18.5em" />
          </div>
        </div>
      </div>
    </Skeleton>
  );
}

export default PageWrapperSkeleton;
