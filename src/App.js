import React from 'react';
import MovieCarousel from './MovieCarousel';
import MovieReviewHeader from './MovieReviewHeader';
import styles from './App.module.css';
const App = () => {
  return (
    <>
      <div className={styles.appContainer}>
        <MovieReviewHeader />
        <div className={styles.spaceAfterHeader}>
        <MovieCarousel />
        </div>
      </div>
    </>
  );
}

export default App;