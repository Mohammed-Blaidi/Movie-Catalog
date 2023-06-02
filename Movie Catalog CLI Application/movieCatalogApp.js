const readline = require('readline');
const { readFile, writeFile } = require('./fileHandler');
const { fetchMovieData } = require('./apiHandler');


class MovieCatalog {
  constructor() {
    this.movies = [];
  }

  displayMovies() {
    console.log('Movie Catalog:');
    this.movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseYear}) - ${movie.director} (${movie.genre})`);
    });
  }

  addMovie(movie) {
    this.movies.push(movie);
    console.log('Movie added to catalog.');
  }

  updateMovie(index, updatedMovie) {
    if (index >= 0 && index < this.movies.length) {
      this.movies[index] = updatedMovie;
      console.log('Movie details updated.');
    } else {
      console.log('Invalid movie index.');
    }
  }

  deleteMovie(index) {
    if (index >= 0 && index < this.movies.length) {
      this.movies.splice(index, 1);
      console.log('Movie deleted from catalog.');
    } else {
      console.log('Invalid movie index.');
    }
  }

  searchMovies(criteria) {
    const filteredMovies = this.movies.filter((movie) => {
      const { title, director, genre } = movie;
      return title.includes(criteria) || director.includes(criteria) || genre.includes(criteria);
    });

    console.log(`Search Results for "${criteria}":`);
    filteredMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseYear}) - ${movie.director} (${movie.genre})`);
    });
  }

  filterMovies(criteria, value) {
    const filteredMovies = this.movies.filter((movie) => movie[criteria] === value);

    console.log(`Filtered Movies - ${criteria}: ${value}`);
    filteredMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseYear}) - ${movie.director} (${movie.genre})`);
    });
  }
}

class UserInteraction {
  constructor(movieCatalog) {
    this.movieCatalog = movieCatalog;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  start() {
    this.displayMenu();
  }

  displayMenu() {
    console.log('\================================================');
    console.log('\n===== Movie Catalog CLI =====');
    console.log('1. Display Movie Catalog');
    console.log('2. Add New Movie');
    console.log('3. Update Movie Details');
    console.log('4. Delete Movie');
    console.log('5. Search Movies');
    console.log('6. Filter Movies');
    console.log('0. Exit');
    console.log('\================================================');

    this.rl.question('Enter your choice: ', (choice) => {
      switch (choice) {
        case '1':
          this.movieCatalog.displayMovies();
          break;
        case '2':
          this.promptNewMovie();
          break;
        case '3':
          this.promptUpdateMovie();
          break;
        case '4':
          this.promptDeleteMovie();
          break;
        case '5':
          this.promptSearchMovies();
          break;
        case '6':
          this.promptFilterMovies();
          break;
        case '0':
          this.rl.close();
          return;
        default:
          console.log('Invalid choice.');
      }

      this.displayMenu();
    });
  }

  promptNewMovie() {
    this.rl.question('Enter movie title: ', (title) => {
      this.rl.question('Enter director: ', (director) => {
        this.rl.question('Enter release year: ', (releaseYear) => {
          this.rl.question('Enter genre: ', (genre) => {
            const movie = {
              title: title,
              director: director,
              releaseYear: releaseYear,
              genre: genre
            };

            this.movieCatalog.addMovie(movie);
            this.saveCatalogToFile();
            this.displayMenu();
          });
        });
      });
    });
  }

  promptUpdateMovie() {
    this.movieCatalog.displayMovies();
    this.rl.question('Enter movie index to update: ', (index) => {
      const movie = this.movieCatalog.movies[index - 1];
      if (movie) {
        this.rl.question('Enter updated title (leave blank to skip): ', (title) => {
          this.rl.question('Enter updated director (leave blank to skip): ', (director) => {
            this.rl.question('Enter updated release year (leave blank to skip): ', (releaseYear) => {
              this.rl.question('Enter updated genre (leave blank to skip): ', (genre) => {
                const updatedMovie = {
                  title: title || movie.title,
                  director: director || movie.director,
                  releaseYear: releaseYear || movie.releaseYear,
                  genre: genre || movie.genre
                };

                this.movieCatalog.updateMovie(index - 1, updatedMovie);
                this.saveCatalogToFile();
                this.displayMenu();
              });
            });
          });
        });
      } else {
        console.log('Invalid movie index.');
        this.displayMenu();
      }
    });
  }

  promptDeleteMovie() {
    this.movieCatalog.displayMovies();
    this.rl.question('Enter movie index to delete: ', (index) => {
      this.movieCatalog.deleteMovie(index - 1);
      this.saveCatalogToFile();
      this.displayMenu();
    });
  }

  promptSearchMovies() {
    this.rl.question('Enter search criteria: ', (criteria) => {
      this.movieCatalog.searchMovies(criteria);
      this.displayMenu();
    });
  }

  promptFilterMovies() {
    console.log('\nFilter Options:');
    console.log('1. Filter by Genre');
    console.log('2. Filter by Release Year');

    this.rl.question('Enter filter criteria: ', (criteria) => {
      switch (criteria) {
        case '1':
          this.rl.question('Enter genre: ', (genre) => {
            this.movieCatalog.filterMovies('genre', genre);
            this.displayMenu();
          });
          break;
        case '2':
          this.rl.question('Enter release year: ', (releaseYear) => {
            this.movieCatalog.filterMovies('releaseYear', releaseYear);
            this.displayMenu();
          });
          break;
        default:
          console.log('Invalid filter criteria.');
          this.displayMenu();
      }
    });
  }

  saveCatalogToFile() {
    const catalogData = JSON.stringify(this.movieCatalog.movies, null, 2);
    writeFile('movieCatalog.json', catalogData)
      .then(() => console.log('Catalog saved to file.'))
      .catch((error) => console.log('Error saving catalog:', error));
  }
}

readFile('movieCatalog.json')
  .then((data) => {
    const movieCatalog = new MovieCatalog();
    if (data) {
      movieCatalog.movies = JSON.parse(data);
    }
    const userInteraction = new UserInteraction(movieCatalog);
    userInteraction.start();
  })
  .catch((error) => {
    console.log('Error reading catalog:', error);
    process.exit(1);
  });