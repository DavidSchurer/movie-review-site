import React from 'react';
import styles from './MovieReviewHeader.module.css';

const MovieReviewHeader = () => {
    return (
        <div className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>Movie Review App</h1>
        </div>
    );
};

export default MovieReviewHeader;