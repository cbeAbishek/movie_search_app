import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import './style.css';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const Movie = () => {
  const [search, setSearch] = useState('Avengers');
  const [data, setData] = useState([]);
  const [likedMovies, setLikedMovies] = useState(() => {
    const storedLikes = localStorage.getItem("likedMovies");
    return storedLikes ? JSON.parse(storedLikes) : {};
  });
  const [view, setView] = useState("HOME"); // Tracks current view
  const [lastSearch, setLastSearch] = useState("Avengers");

  useEffect(() => {
    if (view !== "LIKED") {
      fetchLatest();
    }
  }, [search, view]);

  const fetchLatest = async () => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${search}&apikey=f056c034`);
      const fetchData = await response.json();
      setData(fetchData.Search || []);
    } catch (error) {
      console.error("ERROR FETCHING DATA:", error);
    }
  };

  
  const toggleLike = (movieId) => {
    setLikedMovies((prevLikes) => {
      const updatedLikes = { ...prevLikes, [movieId]: !prevLikes[movieId] };
      localStorage.setItem("likedMovies", JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  };

  const handleOptionClick = (option) => {
    setView(option);
    if (option === "HOME") {
      setSearch("Avengers");
    } else if (option === "VISITED") {
      setSearch(lastSearch);
    } else if (option === "LIKED") {
      const likedMovieList = data.filter(movie => likedMovies[movie.imdbID]);
      setData(likedMovieList);
    }
  };
    const [iconSize, setIconSize] = useState(window.innerWidth < 768 ? 35 : 24);
  
    useEffect(() => {
      const handleResize = () => {
        setIconSize(window.innerWidth < 768 ? 40 : 24);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  return (
    <>
      <div className='header'>
        <div className='logo'>
          <h3>MOVEIFLIX</h3>
        </div>
        <div className='search'>
          <input
            type='text'
            placeholder="Enter a movie title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setLastSearch(search)}
          />
          <button onClick={fetchLatest}>
            <FaSearch />
            
          </button>
        </div>
      </div>

      <div className='option'>
        <h2 onClick={() => handleOptionClick("HOME")}>Home</h2>
        <h2 onClick={() => handleOptionClick("VISITED")}>Visited</h2>
        <h2 onClick={() => handleOptionClick("LIKED")}>Favorite</h2>
      </div>

      <div className="movie">
        <div className="container">
          {data.map((curElm) => {
            const isLiked = likedMovies[curElm.imdbID] || false;
            return (
              <div className='box' key={curElm.imdbID}>
                <div className='img_box'>
                  <img src={curElm.Poster} alt={curElm.Title} />
                </div>
                <div className='detail'>
                  <h3>{curElm.Title}</h3>
                  <h4>Release date: {curElm.Year}</h4>
                  <button className="like-btn" onClick={() => toggleLike(curElm.imdbID)}>
                    {isLiked ? <AiFillHeart color="red" size={iconSize} /> : <AiOutlineHeart color="white" size={iconSize} />}
                  </button>
                    
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Movie;
