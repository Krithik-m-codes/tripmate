const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-4 h-4 ${ratingValue <= rating ? "text-yellow-500" : "text-gray-300"}`}
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 15.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"
                        />
                        <path
                            d="M9.438 11.63c.023.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"
                        />
                        <path
                            d="M6.5 6.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"
                        />
                    </svg>
                );
            })}
        </div>
    );
};

export default StarRating;