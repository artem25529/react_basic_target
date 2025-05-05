import addImg from '../assets/advertisment.jpg';
import '../styles/Advert.css';

function Advert() {
  return (
    <aside className="page-aside">
      <div className="page-advert">
        <a href="#">
          <img src={addImg} alt="advert" />
        </a>
      </div>
    </aside>
  );
}

export default Advert;
