import { useState } from "react";
import StarRating from "./StarRating"; // You'll need to create this component

const initialReviews = [
  {
    name: "John Doe",
    title: "Amazing Product!",
    review: "This is an amazing product! Highly recommend it.",
    rating: 5,
    date: "2024-07-15",
    verified: true,
  },
  {
    name: "Jane Smith",
    title: "Good Value",
    review: "Good value for the price.",
    rating: 4,
    date: "2024-07-12",
    verified: true,
  },
  {
    name: "Sam Wilson",
    title: "Could be better",
    review: "Not bad, but could be improved.",
    rating: 3,
    date: "2024-07-10",
    verified: false,
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [sortType, setSortType] = useState("recent");

  const sortReviews = (type) => {
    const sorted = [...reviews].sort((a, b) => {
      if (type === "highest") {
        return b.rating - a.rating;
      } else if (type === "lowest") {
        return a.rating - b.rating;
      } else {
        // recent
        return new Date(b.date) - new Date(a.date);
      }
    });
    setReviews(sorted);
    setSortType(type);
  };

  const averageRating = (
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div
      id="reviews"
      className="reviews-section dark:bg-neutral-800 bg-gray-200 py-20 mt-20 mb-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 md:px-10">
        <div className="section_header_container mb-10">
          <p className="section_header">Customer Reviews</p>
          <div className="flex items-center mt-4">
            <StarRating rating={averageRating} />
            <p className="ml-2 text-lg">{averageRating} out of 5</p>
            <p className="ml-4 text-lg text-gray-600 dark:text-gray-400">
              ({reviews.length} reviews)
            </p>
          </div>
        </div>
        <div className="flex justify-end mb-6">
          <select
            onChange={(e) => sortReviews(e.target.value)}
            value={sortType}
            className="border p-2 rounded-md dark:bg-neutral-700"
          >
            <option value="recent">Sort by: Most Recent</option>
            <option value="highest">Sort by: Highest Rating</option>
            <option value="lowest">Sort by: Lowest Rating</option>
          </select>
        </div>
        <div className="space-y-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="review bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-2">
                <StarRating rating={review.rating} />
                <h3 className="text-xl font-semibold ml-4">{review.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Reviewed on {new Date(review.date).toLocaleDateString()}
                {review.verified && (
                  <span className="ml-2 text-green-500 font-bold">
                    {" "}
                    (Verified Purchase)
                  </span>
                )}
              </p>
              <p className="mb-4">{review.review}</p>
              <p className="font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
