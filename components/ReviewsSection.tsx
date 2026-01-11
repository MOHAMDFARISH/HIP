import React, { useEffect, useState } from 'react';
import { supabase, Review } from '../lib/supabaseClient';

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? 'text-coral' : 'text-sand-200'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="pt-8 pb-16 md:pb-24">
      <div className="container mx-auto px-6">
        <div
          className="max-w-6xl mx-auto shadow-xl rounded-lg p-8 md:p-12 lg:p-16 ring-1 ring-black ring-opacity-5"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758431623/Gemini_Generated_Image_ufm4haufm4haufm4_udkrj9.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-5xl md:text-6xl text-dark-slate mb-6">
              Reader Reviews
            </h1>
            <p className="text-xl text-dark-slate/80 max-w-2xl mx-auto">
              Hear what readers are saying about "Heal in Paradise" and how the journey through poetry has touched their lives.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
              <p className="mt-4 text-dark-slate/60">Loading reviews...</p>
            </div>
          )}

          {/* Reviews Grid */}
          {!loading && reviews.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow ${
                    review.is_featured ? 'ring-2 ring-coral' : ''
                  }`}
                >
                  {/* Reviewer Info */}
                  <div className="flex items-center gap-4 mb-4">
                    {review.reviewer_photo ? (
                      <img
                        src={review.reviewer_photo}
                        alt={review.reviewer_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center">
                        <span className="text-coral font-heading font-bold text-xl">
                          {getInitials(review.reviewer_name)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-heading text-lg text-dark-slate font-semibold">
                        {review.reviewer_name}
                      </h3>
                      {review.reviewer_title && (
                        <p className="text-sm text-dark-slate/60">
                          {review.reviewer_title}
                        </p>
                      )}
                      {review.reviewer_location && (
                        <p className="text-xs text-dark-slate/50">
                          {review.reviewer_location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  {renderStars(review.rating)}

                  {/* Review Text */}
                  <p className="text-dark-slate/80 font-body leading-relaxed italic">
                    "{review.review_text}"
                  </p>

                  {/* Featured Badge */}
                  {review.is_featured && (
                    <div className="mt-4 pt-4 border-t border-sand-200">
                      <span className="inline-block bg-coral/10 text-coral text-xs font-semibold px-3 py-1 rounded-full">
                        Featured Review
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-slate/60 text-lg">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
