import Spinner1 from './Spinner1.jsx';
import Spinner2 from './Spinner2.jsx';
import '../styles/Loader.css';

function Loader({ text, spinner, background, vpFixedContent }) {
  return (
    <div
      className={
        'loader' +
        (background ? ' background' : '') +
        (vpFixedContent ? ' vpFixedContent' : '')
      }
    >
      {background && <div className="loader-back"></div>}

      <div className="loader-content">
        {text && <div className="loader-text">{text}</div>}

        {spinner === 1 && <Spinner1 />}
        {spinner === 2 && (
          <Spinner2 style={text ? { transform: 'translateY(0.15em)' } : null} />
        )}
      </div>
    </div>
  );
}

export default Loader;
