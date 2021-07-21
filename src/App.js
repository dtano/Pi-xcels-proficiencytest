import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function getData() {
      const response = await fetch('/api/movies');
      console.log(response);
      const payload = await response.json();
      setMovies(payload.data);
    }
    getData();
  }, []);
  
  
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and your changes will live-update automatically.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>Nice Movies:</p>
        <p>
          <ul>
          {movies.map((movie, ind) => {
            return (<li key={ind}><a href="">{movie.title}, {movie.tagline}, {movie.vote_average}</a></li>)
          })}
          </ul>
        </p>
        
      </header>
    </div>
  );
}

export default App;
