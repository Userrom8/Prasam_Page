// eslint-disable-next-line react/prop-types
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<span key={i} className="text-yellow-500">&#9733;</span>); // filled star
        } else {
            stars.push(<span key={i} className="text-gray-400">&#9733;</span>); // empty star
        }
    }
    return <div className="flex">{stars}</div>;
};

export default StarRating;