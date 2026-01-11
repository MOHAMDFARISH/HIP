import React, { useEffect, useState } from 'react';
import { supabase, MediaItem } from '../lib/supabaseClient';

const MediaSection: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'video' | 'interview'>('all');

  useEffect(() => {
    fetchMediaItems();
  }, [filter]);

  const fetchMediaItems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('media_items')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('published_date', { ascending: false });

      if (filter === 'video') {
        query = query.in('media_type', ['video']);
      } else if (filter === 'interview') {
        query = query.in('media_type', ['interview']);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching media items:', error);
      } else {
        setMediaItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const renderMediaCard = (item: MediaItem) => {
    const isYouTube = item.source_type === 'youtube' || item.source_type === 'youtube-short';
    const videoId = item.embed_url ? getYouTubeVideoId(item.embed_url) : null;

    return (
      <div
        key={item.id}
        className={`bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all ${
          item.is_featured ? 'ring-2 ring-coral' : ''
        }`}
      >
        {/* Media Content */}
        {isYouTube && videoId ? (
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={item.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : item.thumbnail_url ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.external_url && (
              <a
                href={item.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-dark-slate/50 hover:bg-dark-slate/70 transition-colors"
              >
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </a>
            )}
          </div>
        ) : null}

        {/* Content */}
        <div className="p-6">
          {/* Source Badge */}
          {item.source_name && (
            <div className="mb-3">
              <span className="inline-block bg-ocean-blue/10 text-ocean-blue text-xs font-semibold px-3 py-1 rounded-full">
                {item.source_name}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-heading text-xl text-dark-slate mb-2">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-dark-slate/70 text-sm mb-4 line-clamp-3">
              {item.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-dark-slate/60">
            {item.published_date && <span>{formatDate(item.published_date)}</span>}
            {item.duration_minutes && (
              <span>{item.duration_minutes} min</span>
            )}
          </div>

          {/* External Link */}
          {item.external_url && !isYouTube && (
            <div className="mt-4 pt-4 border-t border-sand-200">
              <a
                href={item.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-coral hover:text-coral/80 font-semibold text-sm"
              >
                Watch Full Video
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}

          {/* Featured Badge */}
          {item.is_featured && (
            <div className="mt-4">
              <span className="inline-block bg-coral/10 text-coral text-xs font-semibold px-3 py-1 rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>
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
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl md:text-6xl text-dark-slate mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-dark-slate/80 max-w-2xl mx-auto">
              Watch interviews, features, and media coverage about "Heal in Paradise" and the journey behind the poetry.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12 gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-body transition-all ${
                filter === 'all'
                  ? 'bg-coral text-white'
                  : 'bg-white text-dark-slate hover:bg-coral/10'
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-6 py-3 rounded-full font-body transition-all ${
                filter === 'video'
                  ? 'bg-coral text-white'
                  : 'bg-white text-dark-slate hover:bg-coral/10'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setFilter('interview')}
              className={`px-6 py-3 rounded-full font-body transition-all ${
                filter === 'interview'
                  ? 'bg-coral text-white'
                  : 'bg-white text-dark-slate hover:bg-coral/10'
              }`}
            >
              Interviews
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
              <p className="mt-4 text-dark-slate/60">Loading media...</p>
            </div>
          )}

          {/* Media Grid */}
          {!loading && mediaItems.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {mediaItems.map((item) => renderMediaCard(item))}
            </div>
          )}

          {/* Empty State */}
          {!loading && mediaItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-slate/60 text-lg">
                No media content available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
