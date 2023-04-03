const filmsUrl = 'http://localhost:3000/films';

// Load movie details when the page loads
window.onload = function() {
  loadMovieDetails(1);
  loadMovieList();
};

// Load movie list on the left sidebar
function loadMovieList() {
  const filmList = document.getElementById('films');
  fetch(filmsUrl)
    .then(response => response.json())
    .then(data => {
      filmList.innerHTML = '';
      for (let i = 0; i < data.length; i++) {
        const film = data[i];
        const li = document.createElement('li');
        li.classList.add('film', 'item');
        li.innerText = film.title;
        li.addEventListener('click', function() {
          loadMovieDetails(film.id);
        });
        if (film.capacity - film.tickets_sold === 0) {
          li.classList.add('sold-out');
        }
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', function(event) {
          event.stopPropagation();
          deleteFilm(film.id, li);
        });
        li.appendChild(deleteBtn);
        filmList.appendChild(li);
      }
    })
    .catch(error => console.log(error));
}

// Load movie details in the main area
function loadMovieDetails(id) {
  const movieTitle = document.getElementById('movie-title');
  const poster = document.getElementById('poster');
  const runtime = document.getElementById('runtime');
  const showtime = document.getElementById('showtime');
  const availableTickets = document.getElementById('available-tickets');
  const buyTicketBtn = document.getElementById('buy-ticket-btn');
  fetch(`${filmsUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      movieTitle.innerText = data.title;
      poster.src = data.poster;
      runtime.innerText = `${data.runtime} min`;
      showtime.innerText = data.showtime;
      availableTickets.innerText = `${data.capacity - data.tickets_sold} tickets available`;
      if (data.capacity - data.tickets_sold === 0) {
        buyTicketBtn.disabled = true;
        buyTicketBtn.innerText = 'Sold Out';
      } else {
        buyTicketBtn.disabled = false;
        buyTicketBtn.innerText = 'Buy Ticket';
      }
      buyTicketBtn.removeEventListener('click', buyTicket);
      buyTicketBtn.addEventListener('click', function() {
        buyTicket(id, data.capacity, data.tickets_sold);
      });
    })
    .catch(error => console.log(error));
}

// Buy a ticket for a movie
function buyTicket(id, capacity, ticketsSold) {
  const newTicketsSold = ticketsSold + 1;
  if (newTicketsSold <= capacity) {
    const patchOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tickets_sold: newTicketsSold })
    };
    fetch(`${filmsUrl}/${id}`, patchOptions)
      .then(response => response.json())
      .then(data => {
        loadMovieDetails(id);
      })
      .catch(error => console.log(error));
  }
}

// Delete a film from the server and from the list
function deleteFilm(id, filmElement) {
  const deleteOptions = {
    method: 'DELETE'
  };
  fetch(`${filmsUrl}/${id}`, deleteOptions)
    .then(response => response.json())
    .then(data => {
      filmElement.remove();
    })
    .catch(error => console.log(error));
}
