import axios from "axios";

const userList = document.querySelector("#user-list");
const restaurantList = document.querySelector("#rest-list");
const reservationList = document.querySelector("#reserv-list");

let userId;

const renderUsers = async () => {
    try {
        const users = (await axios.get("/api/users")).data;

        const html = `
            ${users
                .map(
                    (user) => `
            <li> 
                <a href="#${user.id}">
                    ${user.name}
                </a>
            </li>
            `,
                )
                .join("")}
        `;
        userList.innerHTML = html;
    } catch (err) {
        console.log(err);
    }
};

const renderRestaurants = async () => {
    try {
        const restaurants = (await axios.get("/api/restaurants")).data;

        const html = `
            ${restaurants
                .map(
                    (restaurant) => `
            <li> 
                    ${restaurant.name}
            </li>
            `,
                )
                .join("")}
        `;
        restaurantList.innerHTML = html;
    } catch (err) {
        console.log(err);
    }
};

const renderReservations = async () => {
    try {
        const reservations = (
            await axios.get(`/api/users/${userId}/reservations`)
        ).data;
        console.log(reservations);
    } catch (err) {
        console.log(err);
    }
};

window.addEventListener("hashchange", async () => {
    try {
        const userId = window.location.hash.slice(1);
        const URL = `/api/users/${userId}/reservations`;
        renderReservations();
    } catch (err) {
        console.log(err);
    }
});

renderUsers();
renderRestaurants();
