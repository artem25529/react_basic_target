import '../styles/Skeleton.css';

function Skeleton({ children, pulser, line, main }) {
  return (
    <div className={'skeleton' + (main ? ' main' : '')}>
      {pulser && <div className="skeleton-pulser"></div>}
      {line && <div className="skeleton-line"></div>}
      <div className="skeleton-content">{children}</div>
    </div>
  );
}

function BoxSkeleton({ width, height }) {
  return <div className="box" style={{ width: width, height: height }}></div>;
}

function PostSkeleton() {
  return (
    <div className="post">
      <div className="title"></div>

      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <div className="stat">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </div>
  );
}

export default Skeleton;
export { BoxSkeleton, PostSkeleton };
