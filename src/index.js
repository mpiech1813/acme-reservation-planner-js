import axios from 'axios';

const userList = document.querySelector('#user-list');
const restaurantList = document.querySelector('#rest-list');
const reservationList = document.querySelector('#reserv-list');

let userId;

const renderUsers = async () => {
  try {
    const users = (await axios.get('/api/users')).data;

    const html = `
            ${users
              .map(
                (user) => `
            <li><a href="#${user.id}">${user.name}</a></li>
            `
              )
              .join('')}
        `;
    userList.innerHTML = html;
  } catch (err) {
    console.log(err);
  }
};

const renderRestaurants = async () => {
  try {
    const restaurants = (await axios.get('/api/restaurants')).data;

    const html = `
            ${restaurants
              .map(
                (restaurant) => `
            <li>${restaurant.name}</li>
            `
              )
              .join('')}
        `;
    restaurantList.innerHTML = html;
  } catch (err) {
    console.log(err);
  }
};

const renderReservations = (reservations) => {
  try {
    const html = `
        ${reservations
          .map(
            (reservation) => `
        <li>${reservation.restaurant.name} @ ${reservation.createdAt}</li><button data-id='${reservation.id}'>X</button>
        `
          )
          .join('')}
    `;
    reservationList.innerHTML = html;
  } catch (err) {
    console.log(err);
  }
};

async function getAllReservations(userId) {
  const URL = `/api/users/${userId}/reservations`;
  const reservations = (await axios.get(URL)).data;
  return reservations;
}

window.addEventListener('hashchange', async () => {
  try {
    const userId = window.location.hash.slice(1);

    // const URL = `/api/users/${userId}/reservations`;
    // const reservations = (await axios.get(URL)).data;
    renderReservations(await getAllReservations(userId));
  } catch (err) {
    console.log(err);
  }
});

restaurantList.addEventListener('click', async (ev) => {
  const target = ev.target;
  const userId = window.location.hash.slice(1);
  let restaurantObj;
  // console.log(userId);
  if (target.tagName === 'LI') {
    const restaurants = (await axios.get('/api/restaurants')).data;
    restaurantObj = restaurants.find(function (elem) {
      if (elem.name === target.innerHTML) {
        return elem;
      }
    });
    const _reservation = {
      restaurantId: restaurantObj.id,
    };

    const response = (
      await axios.post(`/api/users/${userId}/reservations`, _reservation)
    ).data;
    const reservationsArr = await getAllReservations(userId);
    // console.log(typeof getAllReservations());
    // console.log(`response: ${JSON.stringify(response)}`);
    // console.log(`reservationsArr is ${JSON.stringify(reservationsArr)} `);
    renderReservations(reservationsArr);
  }
});

reservationList.addEventListener('click', async (ev) => {
  const target = ev.target;
  const userId = window.location.hash.slice(1);
  if (target.tagName === 'BUTTON') {
    const reservationId = target.getAttribute('data-id');
    // console.log(reservationId);
    const response = await axios.delete(`/api/reservations/${reservationId}`);

    //get a lsit of all of the reservatiosn
    // find the correct one
    // pull out the id number
    //send it to app.delete
    const reservationsArr = await getAllReservations(userId);
    renderReservations(reservationsArr);
  }
});

renderUsers();
renderRestaurants();
