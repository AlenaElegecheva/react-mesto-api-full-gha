import { useContext } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ cards, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);
  // const cards = Array.from(props.cards)

  return (
    <main className="page">
      <section className="profile">
        <a href="#" className="avatar-hover-effect" onClick={onEditAvatar}>
          <img className="profile__avatar" src={currentUser.avatar} alt="аватар" />
        </a>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <p className="profile__subtitle">{currentUser.about}</p>
          <button className="btn profile__edit-btn" type="button" aria-label="редактировать" onClick={onEditProfile}></button>
        </div>
        <button className="btn profile__add-btn" type="button" aria-label="добавить" onClick={onAddPlace}></button>
      </section>
      <section className="photo-grid">
        {cards.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardDelete={onCardDelete}
              onCardLike={onCardLike} />
          );
        })}
      </section>
    </main>
  )
}

export default Main;