import React, { useState, useEffect } from 'react';
import styles from './MovieCarousel.module.css';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';  
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';  

const hardcodedMovies = [
    { title: 'Star Wars', year: 1977, description: 'Luke Skywalker is a Tatooine farmboy who rose from humble beginnings to become a Jedi Padawan after years of training.' },
    { title: 'The Matrix', year: 1999, description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.' },
    { title: 'The Godfather', year: 1972, description: 'The Godfather follows Don Vito Corleone who, after the events of "Corleone"\'s life, decides to become a Godfather.' },
];
const MovieCarousel = () => {
    const [movies, setMovies] = useState(hardcodedMovies);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('/api/movies/');
                setMovies(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMovies();

        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/reviews/');
                const sortedReviews = response.data.reverse();
                setReviews(sortedReviews);
                localStorage.setItem('reviews', JSON.stringify(sortedReviews));
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, []);

    const nextMovie = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    };
    const prevMovie = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
    };
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };
    const handleReviewChange = (event) => {
        const newReview = event.target.value;
        setReview(newReview);
    };

    const handleSubmitReview = () => {
        const newReview = {
            movie: currentMovie.id,
            rating,
            review,
        };
        
        axios.post('http://127.0.0.1:8000/api/reviews/', newReview)
            .then(response => {
                console.log('Review submitted:', response.data);
                const updatedReviews = [response.data, ...reviews];
                setReviews(updatedReviews);
                localStorage.setItem('reviews', JSON.stringify(updatedReviews));
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });

            setRating(0);
            setReview('');
    };
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span key={index} className={styles.star}>
                {index < rating ? '★' : '☆'}
            </span>
        ));
    };

    if (movies.length === 0) {
        return <div>Loading...</div>;
    }

    const currentMovie = movies[currentIndex];
    const currentMovieReviews = reviews.filter(rev => rev.movie === currentMovie.id);

    return (
        <div className={styles.container}>
            <h2 className={styles.movieTitle}>{currentMovie.title}</h2>
            <div className={styles.posterOutline}></div>
            <div className={styles.movieYear}>{currentMovie.year}</div>
            <p className={styles.movieDescription}>{currentMovie.description}</p>
            <div className={styles.star}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={styles.star} onClick={() => handleRatingChange(star)}>
                        {star <= rating ? '★' : '☆'}
                    </span>
                ))}
            </div>
            <div className={styles.reviewContainer}>
                <textarea
                    className={styles.reviewTextarea}
                    placeholder="Seen this movie? Write a short review about it"
                    value={review}
                    onChange={handleReviewChange}
                    maxLength={300}
                />
                <div className={styles.reviewCounter}>{review.length}/300</div>
                <button className={styles.submitButton} onClick={handleSubmitReview}>
                    Submit Review
                </button>
            </div>
            <div className={styles.navigation}>
                <button className={styles.button} onClick={prevMovie}>&lt; Prev</button>
                <button className={styles.button} onClick={nextMovie}>Next &gt;</button>
            </div>
            <div className={styles.reviewsContainer}>
                {currentMovieReviews.map((rev, index) => (
                    <div key={index} className={styles.review}>
                        <div className={styles.reviewRating}>Rating: {renderStars(rev.rating)}</div>
                        <div className={styles.reviewContent}>Review: {rev.review}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MovieCarousel;