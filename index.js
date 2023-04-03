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
      availableTickets.innerText = data.capacity - data.tickets_sold;
      if (data.capacity - data.tickets_sold === 0) {
        buyTicketBtn.disabled = true;
        buyTicketBtn.innerText = 'Sold Out';
      } else {
        buyTicketBtn.disabled = false;
        buyTicketBtn.innerText = 'Buy Ticket';
      }
      buyTicketBtn.onclick = function() {
        const updatedTickets = data.tickets_sold + 1;
        fetch(`${filmsUrl}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tickets_sold: updatedTickets
          })
        })
          .then(response => response.json())
          .then(data => {
            availableTickets.innerText = data.capacity - data.tickets_sold;
            if (data.capacity - data.tickets_sold === 0) {
              buyTicketBtn.disabled = true;
              buyTicketBtn.innerText = 'Sold Out';
            }
          })
          .catch(error => console.log(error));
      };
    })
    .catch(error => console.log(error));
}
