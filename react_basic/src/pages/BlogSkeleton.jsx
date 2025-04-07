import Skeleton, { PostSkeleton } from '../components/Skeleton.jsx';

function BlogSkeleton() {
  const posts = [];

  for (let i = 0; i < 5; i++) {
    posts.push(<PostSkeleton />);
  }

  return (
    <Skeleton line={true}>
      <div className="blog-skeleton-wrapper">
        <div className="button blog-skeleton-add-post"></div>
        <div className="blog-skeleton-sort-search-wrapper">
          <div className="blog-skeleton-sort">
            <div className="title"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <div className="blog-skeleton-search">
            <div className="circle"></div>
            <div className="title"></div>
          </div>
        </div>
        <div className="blog-skeleton-posts">{posts}</div>
      </div>
    </Skeleton>
  );
}

export default BlogSkeleton;
