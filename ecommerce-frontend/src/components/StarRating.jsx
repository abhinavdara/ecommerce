import React from 'react';

export function StarRating({ rating = 4.5, totalStars = 5 }) {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5

  for (let i = 1; i <= totalStars; i++) {
    if (i <= roundedRating) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<i key={i} className="bi bi-star-half"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star"></i>);
    }
  }

  return (
    <div className="star-rating" title={`Rating: ${rating} / 5`}>
      {stars}
    </div>
  );
}
