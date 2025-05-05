import Skeleton, { PostSkeleton } from '../components/Skeleton.jsx';

function AboutSkeleton() {
  return (
    <Skeleton line={true}>
      <div className="about-skeleton-wrapper">
        <div className="about-skeleton-about">
          <div className="title"></div>

          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <div className="about-skeleton-posts-wrapper">
          <div className="title"></div>
          <div className="about-skeleton-posts">
            <div className="circle"></div>
            <PostSkeleton />
            <div className="circle"></div>
          </div>
        </div>
      </div>
    </Skeleton>
  );
}

export default AboutSkeleton;
