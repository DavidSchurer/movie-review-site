import React, { useState, useEffect } from 'react';
import styles from './MovieCarousel.module.css';

const movies = [
    { title: 'Star Wars', year: 1977, description: 'Luke Skywalker is a Tatooine farmboy who rose from humble beginnings to become a Jedi Padawan after years of training.' },
    { title: 'The Matrix', year: 1999, description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.' },
    { title: 'The Godfather', year: 1972, description: 'The Godfather follows Don Vito Corleone who, after the events of "Corleone"\'s life, decides to become a Godfather.' },
];

const MovieCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const storedReviews = localStorage.getItem('reviews');
        if (storedReviews) {
            setReviews(JSON.parse(storedReviews));
        }
    }, [])

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
            movieTitle: movies[currentIndex].title,
            rating,
            review,
        };
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
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

    const currentMovieReviews = reviews.filter(rev => rev.movieTitle === movies[currentIndex].title);

    return (
        <div className={styles.container}>
            <h2 className={styles.movieTitle}>{movies[currentIndex].title}</h2>
            <div className={styles.posterOutline}></div>
            <div className={styles.movieYear}>{movies[currentIndex].year}</div>
            <p className={styles.movieDescription}>{movies[currentIndex].description}</p>
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