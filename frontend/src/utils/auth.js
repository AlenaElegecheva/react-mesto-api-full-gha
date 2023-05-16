export const BASE_URL = "https://api.elegant.mesto.nomoredomains.monster";

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

export function register(email, password) {
  return fetch(BASE_URL + '/signup', {
    method: 'POST',
    body: JSON.stringify({email, password}),
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(checkResponse)
}

export function login (email, password) {
  return fetch(BASE_URL + '/signin', {
    method: 'POST',
    credentials: "include",
    body: JSON.stringify({email, password}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(checkResponse)
    .then((res) => {
      if (res.token) {
        localStorage.setItem("jwt", res.token);
      }
      return res;
    });
}

export function getToken(token) {
  return fetch(BASE_URL + '/users/me', {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${token}`
    },
    credentials: "include"
  })
    .then(checkResponse)
}
