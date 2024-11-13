'use client';
import React, { useState } from 'react';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<string[]>([]);
    const [reviewText, setReviewText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (reviewText.trim() !== '') {
            // Add the new review to the list
            setReviews([...reviews, reviewText]);
            setReviewText(''); // Clear the textarea
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 homepage-bg">
            <div className="opaque-box">
            <h1 className="text-3xl font-bold mb-6 ">User Reviews</h1>

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Leave your review here..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
        />
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Submit Review
                </button>
            </form>

            {/* Display Submitted Reviews */}
            <div className="w-full max-w-md mt-10">
                {reviews.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">All Reviews:</h2>
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-100 border rounded-lg text-foreground"
                            >
                                {review}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
        </main>
    );
};

export default ReviewsPage;
