/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import '../index.css';
import * as auth from '../utils/auth';
import ImagePopup from './ImagePopup';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App() {
  const [editAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [editProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [addPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loadText, setLoadText] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState('');
  const [successfulRegistr, setSuccessfulRegistr] = useState(false);
  const [InfoTooltipPopup, setInfoToolTipPopup] = useState(false);
  const isOpen = editAvatarPopupOpen || editProfilePopupOpen || addPlacePopupOpen || imagePopupOpen;
  const navigate = useNavigate();


  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(data) { // открытие карточек в зуме
    setSelectedCard(data);
    setImagePopupOpen(true);
  }

  function handleCardLike(card) { // лайки на карточки
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleDeleteClick(card) { //удаление карточек
    api.deleteCards(card._id)
      .then(() => {
        setCards((state) => state.filter((d) => d._id !== card._id))
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleEscClose(e) {
    if (e.key === 'Escape') {
      closePopups();
    }
  }
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
      return () => {
        document.removeEventListener("keydown", handleEscClose);
      };
    }
  }, [isOpen]);

  function closePopups() { // закрытие попапов
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setImagePopupOpen(false);
    setInfoToolTipPopup(false);
  }

  useEffect(() => { // загрузка карточек и данных пользователя с сервера
    if (loggedIn) {
      Promise.all([api.getInitialCards(), api.getUsersData()])
        .then((data) => {
          const dataCard = data[0]
          const dataUser = data[1]
          setCards(dataCard);
          setCurrentUser(dataUser);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [loggedIn]);

  useEffect(() => { // проверка токена
    checkToken()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLoginSubmit(inputValues) { // авторизация пользователя
    auth.login(inputValues)
      .then((data) => {
        setUserInfo(inputValues.email)
        setLoggedIn(true);
        navigate('/', { replace: true })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleRegistrSubmit(inputValues) { // регистрация пользователя
    auth.register(inputValues)
      .then((res) => {
        setSuccessfulRegistr(true);
        navigate('/signin', { replace: true });
      })
      .catch((err) => {
        console.log(err, "При регистрации возникла ошибка. Попробуйте еще раз.");
        setSuccessfulRegistr(false);
      })
      .finally(() => {
        setInfoToolTipPopup(true)
      })
  }

  function checkToken() { // проверка токена
    // const jwt = localStorage.getItem('jwt')
      auth.getToken()
        .then((data) => {
            setLoggedIn(true);
            setUserInfo(data.email)
            navigate('/', { replace: true })
        })
        .catch(err => console.log(err))
  }

  function handleSignOut() { // выход из профиля
    setLoggedIn(false);
    setUserInfo('');
    // localStorage.removeItem("jwt");
    navigate("/signin", { replace: true });
  }

  function handleUpdateUser(data) { // редактирование пользователя
    setLoadText(true);
    api.setUsersData(data)
      .then((newInfo) => {
        setCurrentUser(newInfo);
        closePopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadText(false);
      })
  }

  function handleUpdateAvatar(data) { // редактирование аватара
    setLoadText(true);
    api.setAvatar(data)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closePopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadText(false);
      })
  }

  function handleAddPlaceSubmit(data) { // добавление карточки
    setLoadText(true);
    api.createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closePopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadText(false);
      })
  }

  return (
    <div className="root">
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={userInfo} loggedIn={loggedIn} onSignOut={handleSignOut} />
        <Routes>
          <Route path="/signin" element={<Login onLogin={handleLoginSubmit} />} />
          <Route path="/signup" element={<Register onRegister={handleRegistrSubmit} />} />
          <Route path="*" element={<Login onLogin={handleLoginSubmit} />} />
          <Route
            path="/"
            element={<ProtectedRoute element={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleDeleteClick}
              cards={cards}
              loggedIn={loggedIn} />} />
        </Routes>
        <Footer />

        {/* <!--Попап редактирования--> */}
        <EditProfilePopup isOpen={editProfilePopupOpen} onClose={closePopups} onUpdateUser={handleUpdateUser} loadText={loadText} />

        {/* <!--Попап добавления карточки--> */}
        <AddPlacePopup isOpen={addPlacePopupOpen} onClose={closePopups} onAddPlace={handleAddPlaceSubmit} loadText={loadText} />

        {/* <!--Попап картинки--> */}
        <ImagePopup card={selectedCard} isOpen={imagePopupOpen} onClose={closePopups} />

        {/* <!--Попап редактирования аватара--> */}
        <EditAvatarPopup isOpen={editAvatarPopupOpen} onClose={closePopups} onUpdateAvatar={handleUpdateAvatar} loadText={loadText} />

        <InfoTooltip isOpen={InfoTooltipPopup} onClose={closePopups} regSuccess={successfulRegistr} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
