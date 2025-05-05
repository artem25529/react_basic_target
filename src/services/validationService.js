import { useState } from 'react';
import userService from './userService';
import postService from './postService';

const validationService = {
  checkAttributeConstraints(input) {
    const val = input.value;
    const validity = input.validity;
    let err;

    if (!validity.valid) {
      if (validity.valueMissing) {
        err = 'Please fill in a value.';
      } else if (validity.tooShort) {
        err = `Value is too short (min length is ${input.minLength}, current is ${val.length}).`;
      } else if (validity.tooLong) {
        err = `Value is too long (max length is ${input.maxLength}, current is ${val.length}).`;
      } else if (validity.typeMismatch) {
        if (input.type === 'email') {
          err = 'Please enter an existing email.';
        } else {
          err = 'Type mismatch.';
        }
      } else {
        err = 'Bad input.';
      }
    }

    return err;
  },

  async validateLoginForm(form, isLogin, setErrors) {
    this.resetFormErrors(form, setErrors);

    const isFormValid = this.validateFormElements(form, setErrors);

    if (!isFormValid) return;

    const emailInput = form.email;
    const passwordInput = form.password;

    if (isLogin) {
      const users = await userService.getUsersByFieldsAsync({
        email: emailInput.value,
        password: passwordInput.value,
      });

      if (!users[0]) {
        const err = 'No match for such email and password!';
        setErrors((prev) => ({ ...prev, [passwordInput.name]: err }));
        passwordInput.setCustomValidity(err);
      }

      return users[0];
    } else {
      const users = await userService.getUsersByFieldsAsync({
        email: emailInput.value,
      });

      if (users[0]) {
        const err = 'User with such an email already exists!';
        setErrors((prev) => ({ ...prev, [emailInput.name]: err }));
        emailInput.setCustomValidity(err);
      }

      return users[0];
    }
  },

  async validatePostEditForm(form, setErrors) {
    this.resetFormErrors(form, setErrors);

    const isFormValid = this.validateFormElements(form, setErrors);

    if (!isFormValid) return;

    const postId = form.id.slice(10);
    const titleInput = form.title;
    const title = titleInput.value;

    const posts = await postService.getPostsByFieldsAsync({ title });

    if (!posts.length) {
      return;
    }

    if (posts[0].id !== postId) {
      const err = 'Post with such title already exists.';

      titleInput.setCustomValidity(err);
      setErrors((prev) => ({ ...prev, [titleInput.name]: err }));
    }
  },

  async validateNewPostForm(form, setErrors) {
    this.resetFormErrors(form, setErrors);

    const isFormValid = this.validateFormElements(form, setErrors);

    if (!isFormValid) return;

    const titleInput = form['post-title'];
    const title = titleInput.value;

    const posts = await postService.getPostsByFieldsAsync({ title });

    if (posts.length) {
      const err = 'Post with such title already exists!';

      titleInput.setCustomValidity(err);
      setErrors((prev) => ({ ...prev, [titleInput.name]: err }));
    }
  },

  validateFormElements(form, setErrors) {
    const isFormValid = form.checkValidity();

    if (!isFormValid) {
      for (const input of form) {
        if (input.matches(':is(input,textarea)[name]')) {
          const err = this.checkAttributeConstraints(input);

          if (err) {
            setErrors((prev) => ({ ...prev, [input.name]: err }));
          }
        }
      }
    }

    return isFormValid;
  },

  resetFormErrors(form, setErrors) {
    for (let formElem of form) {
      formElem.setCustomValidity('');
    }

    setErrors({});
  },
};

export default validationService;
