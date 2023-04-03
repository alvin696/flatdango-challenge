// Load movie list on the left sidebar
function loadMovieList() {
  fetch(filmsUrl)
    .then(response => response.json())
    .then(data => {
      const filmList = document.getElementById('films');
      filmList.innerHTML = '';
      for (let i = 0; i < data.length; i++) {
        const film = data[i];
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = film.title;
        li.appendChild(a);
        li.classList.add('film', 'item');
        if (film.capacity - film.tickets_sold === 0) {
          li.classList.add('sold-out');
        }
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', function(event) {
          event.stopPropagation();
          deleteFilm(film.id, li);
        });
        a.addEventListener('click', function() {
          loadMovieDetails(film.id);
          const display = document.querySelector('#display');
          display.innerHTML = '';
          const title = document.createElement('h1');
          const poster = document.createElement('img');
          const description = document.createElement('h3');
          const showTime = document.createElement('h4');
          const runtime = document.createElement('h4');
          const tickets = document.createElement('h4');
          const buy = document.createElement('button');
          title.textContent = film.title;
          poster.src = film.poster;
          description.textContent = `Description: ${film.description}`;
          showTime.textContent = `Movie starts at: ${film.showtime}`;
          runtime.textContent = `Duration: ${film.runtime} minutes`;
          tickets.textContent = `Tickets remaining: ${film.capacity - film.tickets_sold}`;
          buy.textContent = `BUY TICKET`;
          display.appendChild(title);
          display.appendChild(poster);
          display.appendChild(description);
          display.appendChild(showTime);
          display.appendChild(runtime);
          display.appendChild(buy);
          display.appendChild(tickets);
          buy.addEventListener('click', (e) => {
            e.preventDefault();
            film.tickets_sold++;
            const remainingTickets = film.capacity - film.tickets_sold;
            fetch(`${filmsUrl}/${film.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                tickets_sold: film.tickets_sold,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  tickets.textContent = `Tickets remaining: ${remainingTickets}`;
                }
              })
              .catch((err) => console.log(err));
            tickets.textContent = `Tickets remaining: ${remainingTickets}`;
          });
        });
        li.appendChild(deleteBtn);
        filmList.appendChild(li);
      }
    })
    .catch(error => console.log(error));
}
