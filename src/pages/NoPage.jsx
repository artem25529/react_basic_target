import { Link } from 'react-router-dom';
import '../styles/NoPage.css';

function NoPage() {
  return (
    <section className="no-page">
      <div className="msg">
        <strong>Page not found!</strong> <br /> Go to <Link to="/">main</Link>.
      </div>
    </section>
  );
}

export default NoPage;
