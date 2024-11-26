'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define the type for a review
type Review = {
    id: number;
    customerId: number;
    rating: number;
    comment: string;
};

const ReviewsPage = () => {
    const { data: session } = useSession(); // Access session data
    const [reviews, setReviews] = useState<Review[]>([]);
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [showMyReviews, setShowMyReviews] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Extract customerId and customerName from the session
    const customerId = Number(session?.user?.id); // Ensure customerId is a number
    const customerName = session?.user?.full_name;

    console.log("Session Data:", session); // Debug session data
    console.log("Extracted customerId:", customerId);
    console.log("Extracted customerName:", customerName);

    // Fetch all reviews and user-specific reviews on component load
    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                console.log("Fetching all reviews...");
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review/getAllReviews`);
                if (!response.ok) throw new Error('Failed to fetch all reviews.');
                const data: Review[] = await response.json();
                console.log("Fetched all reviews:", data);
                setReviews(data);
            } catch (err) {
                console.error('Error fetching all reviews:', err);
                setError((err as Error).message || 'An unknown error occurred.');
            }
        };

        const fetchMyReviews = async () => {
            if (!customerId) {
                console.warn("No customerId found, skipping fetchMyReviews.");
                return;
            }

            try {
                console.log(`Fetching reviews for customerId: ${customerId}`);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review/getCustomerReviews/${customerId}`
                );
                if (!response.ok) throw new Error('Failed to fetch user reviews.');
                const data: Review[] = await response.json();
                console.log("Fetched user reviews:", data);
                setMyReviews(data);
            } catch (err) {
                console.error('Error fetching user reviews:', err);
                setError((err as Error).message || 'An unknown error occurred.');
            }
        };

        fetchAllReviews();
        fetchMyReviews();
    }, [customerId]);

    // Toggle between "All Reviews" and "My Reviews"
    const toggleView = () => {
        console.log("Toggling review view. Current view:", showMyReviews ? "My Reviews" : "All Reviews");
        setShowMyReviews(!showMyReviews);
    };

    // Handle review submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!rating || !reviewText.trim()) {
            setError('Please provide a valid rating and review.');
            console.warn("Invalid rating or review text.");
            return;
        }

        try {
            console.log(`Submitting review for customerId: ${customerId}, Rating: ${rating}, Comment: ${reviewText}`);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review/create/${customerId}?rating=${rating}&comment=${encodeURIComponent(reviewText)}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // Optional for query parameters
                }
            );

            if (!response.ok) throw new Error('Failed to submit review.');

            console.log("Successfully submitted review.");

            // Reload the page to show the updated list
            window.location.reload();
        } catch (err) {
            console.error('Error submitting review:', err);
            setError((err as Error).message || 'An unknown error occurred.');
        }
    };


    // Handle review deletion
    const handleDeleteReview = async (reviewId: number) => {
        try {
            console.log(`Deleting review with ID: ${reviewId}`);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review/deleteReview/${reviewId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete review.');

            console.log(`Successfully deleted review with ID: ${reviewId}`);
            setMyReviews(myReviews.filter((review) => review.id !== reviewId));
            setReviews(reviews.filter((review) => review.id !== reviewId));
        } catch (err) {
            console.error('Error deleting review:', err);
            setError((err as Error).message || 'An unknown error occurred.');
        }
    };

    return (
        <main className="flex flex-row items-start justify-center min-h-screen bg-background text-foreground p-8 homepage-bg">
            {/* Left Section: Input Fields */}
            <div className="w-1/2 p-6 bg-white rounded-lg shadow-lg mt-20">
                <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {customerId ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="number"
                            value={rating || ''}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value >= 1 && value <= 5) setRating(value);
                            }}
                            placeholder="Enter rating (1-5)"
                            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min={1}
                            max={5}
                        />
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Leave your review here..."
                            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={5}
                        />
                        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                            Submit Review
                        </button>
                    </form>
                ) : (
                    <p className="text-red-500">You must be logged in to leave a review.</p>
                )}
            </div>

            {/* Right Section: Reviews */}
            <div className="w-1/2 p-6 ml-4 bg-white rounded-lg shadow-lg mt-14">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">
                        {showMyReviews ? 'My Reviews' : 'All Reviews'}
                    </h1>
                    {customerId && (
                        <button
                            onClick={toggleView}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            {showMyReviews ? 'Show All Reviews' : 'My Reviews'}
                        </button>
                    )}
                </div>

                <div className="overflow-y-auto max-h-[70vh] space-y-4">
                    {(showMyReviews ? myReviews : reviews).map((review) => (
                        <div key={review.id} className="p-4 bg-gray-100 border rounded-lg">
                            <p>
                                <strong>Customer:</strong> {/* Changed from 'Customer Name: User Undefined' */}
                            </p>
                            <p>
                                <strong>Rating:</strong> {review.rating}
                            </p>
                            <p>
                                <strong>Comment:</strong> {review.comment}
                            </p>
                            {showMyReviews && (
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ReviewsPage;
