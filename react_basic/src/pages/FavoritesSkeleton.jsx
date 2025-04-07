import Skeleton, { PostSkeleton } from '../components/Skeleton.jsx';

function FavoritesSkeleton() {
  const posts = [];
  const circles = [];

  for (let i = 0; i < 2; i++) {
    posts.push(<PostSkeleton />);
  }

  for (let i = 0; i < 5; i++) {
    circles.push(<div className="circle"></div>);
  }

  return (
    <Skeleton line={true}>
      <div className="favorites-skeleton-wrapper">
        <div className="favorites-skeleton-posts">{posts}</div>
        <div className="favorites-skeleton-pages">{circles}</div>
      </div>
    </Skeleton>
  );
}

export default FavoritesSkeleton;
