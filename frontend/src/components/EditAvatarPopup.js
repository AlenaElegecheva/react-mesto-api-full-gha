import { useRef, useEffect } from "react";
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, loadText }) {
  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  useEffect(() => {
    avatarRef.current.value = ''
  }, [isOpen]);

  return (
    <PopupWithForm
      name={"edit-avatar"}
      title={"Обновить аватар"}
      formName={"avatar-edit"}
      formId={"avatar-edit"}
      btnText={"Сохранить"}
      btnLoadText={"Сохранение"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      loadText={loadText}
    >
      <input ref={avatarRef} 
      className="popup__input popup__input_field_avatar-src" 
      type="url" 
      name="avatar" 
      id="avatar" 
      placeholder="Ссылка на картинку" required />
      <span className="popup__error avatar-error"></span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;