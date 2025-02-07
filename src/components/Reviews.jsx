const reviews = [
    {
        name: "John Doe",
        review: "This is an amazing product! Highly recommend it.",
        rating: 5
    },
    {
        name: "Jane Smith",
        review: "Good value for the price.",
        rating: 4
    },
    {
        name: "Sam Wilson",
        review: "Not bad, but could be improved.",
        rating: 3
    }
];

const Reviews = () => {
    return (
        <div className="reviews-section">
            <h2>Customer Reviews</h2>
            {reviews.map((review, index) => (
                <div key={index} className="review">
                    <h3>{review.name}</h3>
                    <p>{review.review}</p>
                    <p>Rating: {review.rating} / 5</p>
                </div>
            ))}
        </div>
    );
};

export default Reviews;