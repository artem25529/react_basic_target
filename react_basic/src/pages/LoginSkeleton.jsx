import Skeleton from '../components/Skeleton.jsx';

function LoginSkeleton() {
  return (
    <Skeleton line={true}>
      <div className="login-skeleton-wrapper">
        <div className="login-skeleton-form">
          <div className="title"></div>
          <div className="login-skeleton-fields">
            <div className="login-skeleton-field">
              <div className="line"></div>
              <div className="title"></div>
            </div>
            <div className="login-skeleton-field">
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

export default LoginSkeleton;
