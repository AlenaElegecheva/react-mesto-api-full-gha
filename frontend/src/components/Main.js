import { useContext } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {
  const currentUser = useContext(CurrentUserContext);
  const cards = Array.from(props.cards)

  return (
    <main className="page">
      <section className="profile">
        <a href="#" className="avatar-hover-effect" onClick={props.onEditAvatar}>
          <img className="profile__avatar" src={currentUser.avatar} alt="аватар" />
        </a>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <p className="profile__subtitle">{currentUser.about}</p>
          <button className="btn profile__edit-btn" type="button" aria-label="редактировать" onClick={props.onEditProfile}></button>
        </div>
        <button className="btn profile__add-btn" type="button" aria-label="добавить" onClick={props.onAddPlace}></button>
      </section>
      <section className="photo-grid">
        {cards.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onCardClick={props.onCardClick}
              onCardDelete={props.onCardDelete}
              onCardLike={props.onCardLike} />
          );
        })}
      </section>
    </main>
  )
}

export default Main;