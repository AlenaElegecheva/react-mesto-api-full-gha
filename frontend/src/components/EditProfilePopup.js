import React, { useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useForm } from '../hooks/useForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, loadText }) {
  const currentUser = useContext(CurrentUserContext);
  const {values, handleChange, setValues} = useForm({ name: "", about: "" });

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser(values);
  }

  useEffect(() => {
    setValues(currentUser)
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name={"edit"}
      title={"Редактировать профиль"}
      formName={"edit"}
      formId={"edit"}
      btnText={"Сохранить"}
      btnLoadText={"Сохранение"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      loadText={loadText}
    >
      <input value={values.name || ""} 
      onChange={handleChange} 
      className="popup__input popup__input_field_name" 
      type="text" 
      name="name" 
      placeholder="Имя" 
      minLength="2" 
      maxLength="40" required />
      <span className="popup__error username-error"></span>
      <input value={values.about || ""} 
      onChange={handleChange} 
      className="popup__input popup__input_field_aboutme" 
      type="text" 
      name="about" 
      placeholder="Вид деятельности" 
      minLength="2" 
      maxLength="200" required />
      <span className="popup__error aboutme-error"></span>
    </PopupWithForm>
  )
}

export default EditProfilePopup;