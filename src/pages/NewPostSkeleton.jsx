import Skeleton from '../components/Skeleton.jsx';

function NewPostSkeleton() {
  return (
    <Skeleton line={true}>
      <div className="new-post-skeleton-wrapper">
        <div className="new-post-skeleton-form">
          <div className="title"></div>
          <div className="new-post-skeleton-fields">
            <div className="new-post-skeleton-field">
              <div className="line"></div>
              <div className="title"></div>
            </div>
            <div className="new-post-skeleton-field">
              <div className="line"></div>
              <div className="title"></div>
            </div>
          </div>
          <div className="button"></div>
        </div>
      </div>
    </Skeleton>
  );
}

export default NewPostSkeleton;
