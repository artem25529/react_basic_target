import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import billyEdit from '../assets/billy/billy.mp4';
import billyImg from '../assets/billy/billy.jpg';
import '../styles/Billy.css';

function Billy() {
  const navigate = useNavigate();

  const billyEditRef = useRef();
  const toggleSoundBtnRef = useRef();
  const videoWrapperRef = useRef();
  const contentRef = useRef();

  const text1Ref = useRef();
  const text2Ref = useRef();
  const imgRef = useRef();
  const text3Ref = useRef();

  const [currentSlide, setCurrentSlide] = useState();
  const [isMuted, setIsMuted] = useState(true);

  const text1 = (
    <div ref={text1Ref} className="slide text">
      Every time you wanna give up
      <br />
      just remember...
    </div>
  );

  const text2 = (
    <div ref={text2Ref} className="slide text">
      He is watching...
    </div>
  );

  const finalImg = (
    <img ref={imgRef} className="slide img" alt="billy-angel" src={billyImg} />
  );

  const text3 = (
    <div ref={text3Ref} className="slide text">
      Don't let him down...
    </div>
  );

  const slides = [text1, text2, finalImg, text3];

  useEffect(() => {
    billyEditRef.current.ontimeupdate = handleTimeUpdate;

    billyEditRef.current.onended = () => {
      navigate('/');
    };
  }, []);

  useEffect(() => {
    if (typeof currentSlide === 'number') {
      if (currentSlide < slides.length) {
        slides[currentSlide].ref.current.style.animation = 'fadeIn 0.5s both';

        if (currentSlide > 0) {
          slides[currentSlide - 1].ref.current.style.animation =
            'fadeOut 0.5s both';
        }
      } else if (currentSlide === slides.length) {
        slides[currentSlide - 1].ref.current.style.animation =
          'fadeOut 0.5s both';
      }
    }
  }, [currentSlide]);

  function handleTimeUpdate() {
    if (
      billyEditRef.current.duration - billyEditRef.current.currentTime <
      8.6
    ) {
      billyEditRef.current.ontimeupdate = null;
      videoWrapperRef.current.style.animation = 'fadeOut 0.5s both';

      setCurrentSlide(0);

      const interval = setInterval(() => {
        if (currentSlide === slides.length) {
          clearInterval(interval);
        } else {
          setCurrentSlide((prev) => prev + 1);
        }
      }, 2000);
    }
  }

  function handelToggleSound() {
    setIsMuted(!isMuted);
    billyEditRef.current.muted = !billyEditRef.current.muted;
  }

  return (
    <div className="billy-monument">
      <div ref={contentRef} className="content">
        <div ref={videoWrapperRef} className="video-wrapper">
          <video ref={billyEditRef} className="billy-edit" autoPlay muted>
            <source src={billyEdit} />
          </video>

          <button
            ref={toggleSoundBtnRef}
            onClick={handelToggleSound}
            type="button"
          >
            Toogle sound
            {!isMuted && (
              <span className="material-symbols-outlined">volume_up</span>
            )}
            {isMuted && (
              <span className="material-symbols-outlined">volume_off</span>
            )}
          </button>
        </div>

        {slides}
      </div>
    </div>
  );
}

export default Billy;
