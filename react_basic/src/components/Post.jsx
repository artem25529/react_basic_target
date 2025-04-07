import { useContext, useEffect, useRef, useState } from 'react';
import { PageWrapperContext } from '../pages/PageWrapper.jsx';
import { PostListContext } from './PostList.jsx';
import Loader from '../components/Loader.jsx';
import validationService from '../services/validationService.js';
import localStorageService from '../services/localStorageService.js';
import postService from '../services/postService.js';
import userService from '../services/userService.js';
import '../styles/Post.css';

function Post({ post }) {
  const { shouldUpdate } = useContext(PostListContext);

  const {
    user,
    favorites,
    setFavorites,
    setErrorMsg,
    setSuccessMsg,
    setFullscreenPopupContent,
  } = useContext(PageWrapperContext);

  const [values, setValues] = useState({
    title: post.title,
    text: post.text,
  });

  const [formValues, setFormValues] = useState({
    title: values.title,
    text: values.text,
  });

  const [statValues, setStatValues] = useState({
    likes: post.statistics.likes,
    dislikes: post.statistics.dislikes,
    views: post.statistics.views,
  });

  const [isFav, setIsFav] = useState(favorites.includes(post.id));
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(
    localStorageService.getItemForUser(user, 'likedPosts')?.includes(post.id),
  );
  const [isDisliked, setIsDisliked] = useState(
    localStorageService
      .getItemForUser(user, 'dislikedPosts')
      ?.includes(post.id),
  );

  const postRef = useRef();
  const postEditFormRef = useRef();
  const postTextRef = useRef();
  const applyBtnRef = useRef();

  const intersectionObserverRef = useRef();
  const statValuesCurrent = useRef(statValues);

  useEffect(() => {
    if (shouldUpdate) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setStatValues((prev) => ({ ...prev, views: prev.views + 1 }));
            observer.disconnect();
          }
        },
        { threshold: 1 },
      );

      observer.observe(postRef.current);
      intersectionObserverRef.current = observer;
    }

    return async () => {
      intersectionObserverRef.current?.disconnect();

      if (shouldUpdate) {
        //not updating if only views were changed cause
        // json server often crashes cause of many updates
        if (
          statValuesCurrent.current.likes != post.statistics.likes ||
          statValuesCurrent.current.dislikes != post.statistics.dislikes
        ) {
          try {
            await postService.updatePost({
              id: post.id,
              statistics: statValuesCurrent.current,
            });
          } catch {
            setErrorMsg(`Error updating statistics for post ${post.id}!`);
          }
        }
      }
    };
  }, []);

  useEffect(() => {
    const likedPosts =
      localStorageService.getItemForUser(user, 'likedPosts') ?? [];

    if (isLiked) {
      if (!likedPosts.includes(post.id)) {
        likedPosts.push(post.id);
      }
    } else {
      if (likedPosts.includes(post.id)) {
        const idx = likedPosts.indexOf(post.id);
        likedPosts.splice(idx, 1);
      }
    }

    localStorageService.setItemForUser(user, 'likedPosts', likedPosts);
  }, [isLiked]);

  useEffect(() => {
    const dislikedPosts =
      localStorageService.getItemForUser(user, 'dislikedPosts') ?? [];

    if (isDisliked) {
      if (!dislikedPosts.includes(post.id)) {
        dislikedPosts.push(post.id);
      }
    } else {
      if (dislikedPosts.includes(post.id)) {
        const idx = dislikedPosts.indexOf(post.id);
        dislikedPosts.splice(idx, 1);
      }
    }

    localStorageService.setItemForUser(user, 'dislikedPosts', dislikedPosts);
  }, [isDisliked]);

  useEffect(() => {
    if (shouldUpdate) {
      statValuesCurrent.current = statValues;
    }
  }, [statValues]);

  useEffect(() => {
    if (isEdit) {
      setTextareaHeight();
    }
  }, [isEdit]);

  useEffect(() => {
    setBtnDisabled();
  }, [formValues, isEdit]);

  function setBtnDisabled() {
    if (applyBtnRef.current) {
      applyBtnRef.current.disabled =
        formValues.title === values.title && formValues.text === values.text;
    }
  }

  function setTextareaHeight() {
    if (postTextRef.current) {
      const borderWidth = parseFloat(
        getComputedStyle(postTextRef.current).getPropertyValue('border-width'),
      );

      postTextRef.current.style.height = '';
      postTextRef.current.style.height =
        postTextRef.current.scrollHeight + borderWidth * 2 + 'px';
    }
  }

  function handleValueChange(e) {
    setTextareaHeight();

    const input = e.target;
    setFormValues((prev) => ({ ...prev, [input.name]: input.value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (applyBtnRef.current.disabled) return;

    setIsLoading(true);

    try {
      await validationService.validatePostEditForm(
        postEditFormRef.current,
        setErrors,
      );
    } catch {
      setErrorMsg(`Error validating post ${post.id}!`);
      return;
    } finally {
      setIsLoading(false);
    }

    if (postEditFormRef.current.checkValidity()) {
      setIsLoading(true);

      try {
        await postService.updatePost({
          id: post.id,
          title: formValues.title,
          text: formValues.text,
        });

        setSuccessMsg(`Post ${post.id} updated successfully!`);
        setValues((prev) => ({ ...prev, ...formValues }));
        setIsEdit(false);
      } catch {
        setErrorMsg(`Error updatinng post ${post.id}!`);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handleEditBtn() {
    setBtnDisabled();
    setErrors({});
    setIsEdit(true);
  }

  function handleCancelBtn() {
    setFormValues({ title: values.title, text: values.text });
    setErrors({});
    setIsEdit(false);
  }

  function handleDeleteBtn() {
    setFullscreenPopupContent(
      <div className="post-delete-notification">
        <div className="delete-message">
          Are you sure you want to delete post with id {post.id}?
        </div>
        <div className="delete-controls">
          <button type="button" className="delete" onClick={handleApplyDelete}>
            Delete
          </button>
          <button type="button" className="cancel" onClick={handleCancelDelete}>
            Cancel
          </button>
        </div>
      </div>,
    );
  }

  async function handleApplyDelete() {
    setFullscreenPopupContent();
    setIsLoading(true);

    try {
      await postService.deletePost(post.id);

      setIsDeleted(true);
      setSuccessMsg(`Post ${post.id} deleted successfully!`);
    } catch {
      setErrorMsg(`Error deleting post ${post.id}!.`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancelDelete() {
    setFullscreenPopupContent();
  }

  function handleFavClick() {
    if (user) {
      setIsFav((prev) => !prev);

      let favoritesTemp;

      if (favorites.includes(post.id)) {
        favoritesTemp = [...favorites].filter((f) => f !== post.id);
      } else {
        favoritesTemp = [...favorites, post.id];
      }

      setFavorites(favoritesTemp);

      (async () => {
        try {
          await userService.updateUser({
            id: user.id,
            favorites: favoritesTemp,
          });
        } catch {
          setErrors(`Error updating favorites for user ${user?.email}!`);
        }
      })();
    }
  }

  function handleStatChange(e) {
    if (user && shouldUpdate) {
      const stat = e.currentTarget.dataset.stat;
      let likes = statValues.likes;
      let dislikes = statValues.dislikes;

      if (stat === 'likes') {
        if (isLiked) {
          likes--;
        } else {
          likes++;
        }

        if (isDisliked) {
          setIsDisliked(false);
          dislikes--;
        }

        setIsLiked((prev) => !prev);
      } else if (stat === 'dislikes') {
        if (isDisliked) {
          dislikes--;
        } else {
          dislikes++;
        }

        if (isLiked) {
          setIsLiked(false);
          likes--;
        }

        setIsDisliked((prev) => !prev);
      }

      setStatValues((prev) => ({ ...prev, likes: likes, dislikes: dislikes }));
    }
  }

  return (
    <>
      {!isDeleted && (
        <article ref={postRef} className="post">
          {isLoading && (
            <Loader text="Processing" spinner={1} background={true} />
          )}

          <div className="post-content">
            {user && isEdit && (
              <form
                ref={postEditFormRef}
                id={`post-form-${post.id}`}
                className="post-content-wrapper"
                onSubmit={handleFormSubmit}
                noValidate
              >
                <header className="post-title-wrapper">
                  <input
                    className="post-title"
                    type="text"
                    name="title"
                    value={formValues.title}
                    onChange={handleValueChange}
                    required
                    minLength="5"
                    maxLength="100"
                  />
                </header>
                {errors.title && <div className="err">{errors.title}</div>}

                <textarea
                  ref={postTextRef}
                  className="post-text"
                  name="text"
                  value={formValues.text}
                  onChange={handleValueChange}
                  required
                  minLength="10"
                  maxLength="700"
                />
                {errors.text && <div className="err">{errors.text}</div>}
              </form>
            )}

            {!isEdit && (
              <div className="post-content-wrapper">
                <header className="post-title-wrapper">
                  <h3 className="post-title">{values.title}</h3>
                </header>
                <div className="post-text">{values.text}</div>
              </div>
            )}

            {user && (
              <div className="post-favorite">
                <button
                  disabled={!user || !shouldUpdate}
                  type="button"
                  onClick={handleFavClick}
                >
                  <span
                    className={
                      'material-symbols-outlined fav-icon' +
                      (isFav ? ' active' : '')
                    }
                  >
                    favorite
                  </span>
                </button>
              </div>
            )}
          </div>

          {user && shouldUpdate && (
            <div className="post-controls">
              <div className="post-control edit">
                {user && !isEdit && (
                  <button type="button" onClick={handleEditBtn}>
                    <span className="material-symbols-outlined control-icon">
                      edit_square
                    </span>
                  </button>
                )}

                {user && isEdit && (
                  <>
                    <button
                      ref={applyBtnRef}
                      type="submit"
                      form={`post-form-${post.id}`}
                    >
                      <span className="material-symbols-outlined control-icon">
                        check_circle
                      </span>
                    </button>

                    <button type="button" onClick={handleCancelBtn}>
                      <span className="material-symbols-outlined control-icon">
                        cancel
                      </span>
                    </button>
                  </>
                )}
              </div>
              <div className="post-control remove">
                <button type="button" onClick={handleDeleteBtn}>
                  <span className="material-symbols-outlined control-icon">
                    delete
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="post-statistics">
            <div className="post-statistic views">
              <span className="material-symbols-outlined statistic-icon">
                visibility
              </span>
              <span className="statistic-value">{statValues.views}</span>
            </div>
            <div
              className={
                'post-statistic rating likes' +
                (!user ? ' disabled' : !isLiked ? ' opaque' : '')
              }
            >
              <button
                tabIndex={!shouldUpdate || !user ? -1 : 0}
                type="button"
                data-stat="likes"
                className={user && !shouldUpdate ? 'no-pointer-events' : ''}
                onClick={handleStatChange}
              >
                <span className="material-symbols-outlined statistic-icon">
                  thumb_up
                </span>
              </button>

              <span className="statistic-value">{statValues.likes}</span>
            </div>
            <div
              className={
                'post-statistic rating dislikes' +
                (!user ? ' disabled' : !isDisliked ? ' opaque' : '')
              }
            >
              <button
                tabIndex={!shouldUpdate || !user ? -1 : 0}
                type="button"
                data-stat="dislikes"
                className={user && !shouldUpdate ? 'no-pointer-events' : ''}
                onClick={handleStatChange}
              >
                <span className="material-symbols-outlined statistic-icon">
                  thumb_down
                </span>
              </button>
              <span className="statistic-value">{statValues.dislikes}</span>
            </div>
          </div>
        </article>
      )}
    </>
  );
}

export default Post;
