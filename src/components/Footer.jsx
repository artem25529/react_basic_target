import { Link } from 'react-router-dom';
import facebookIcon from '../assets/social_media_icons/facebook.png';
import instagramIcon from '../assets/social_media_icons/instagram.png';
import linkedinIcon from '../assets/social_media_icons/linkedin.png';
import youtubeIcon from '../assets/social_media_icons/youtube.png';
import '../styles/Footer.css';

function Footer() {
  return (
    <section className="page-footer">
      <div className="footer-wrapper">
        <address className="footer-contacts-wrapper">
          <div className="footer-address">3rd Mozhaisky Lane 11</div>
          <div className="footer-contacts">
            <div className="contact-wrapper">
              <a href="tel:+375294555316">
                <span className="material-symbols-outlined">call</span>
                <div className="contact-label">+375 (29) 455-53-16</div>
              </a>
            </div>
            <div className="contact-wrapper">
              <a href="mailto:writewave@gmail.com">
                <span className="material-symbols-outlined">mail</span>
                <div className="contact-label">writewave@gmail.com</div>
              </a>
            </div>
          </div>
        </address>

        <div className="footer-links">
          <a href="#">
            <img className="footer-link" src={facebookIcon} alt="facebook" />
          </a>
          <a href="#">
            <img className="footer-link" src={instagramIcon} alt="instagram" />
          </a>
          <a href="#">
            <img className="footer-link" src={linkedinIcon} alt="linkedin" />
          </a>
          <a href="#">
            <img className="footer-link" src={youtubeIcon} alt="youtube" />
          </a>
        </div>

        <div className="footer-copyright">
          &copy; {new Date().getFullYear()}{' '}
          <Link to="/">
            <em>WriteWave</em>
          </Link>
          . <br /> All rights reserved.
        </div>
      </div>
    </section>
  );
}

export default Footer;
