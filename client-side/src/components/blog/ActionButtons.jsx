import React from 'react';
import { ThumbsUp, Heart, Bookmark, MessageCircle, Share2, Copy, Coffee } from 'lucide-react';

export function InteractionButtons() {
  const [state, setState] = React.useState({
    likes: 42,
    appreciated: 12,
    comments: 8,
    isLiked: false,
    isAppreciated: false,
    isSaved: false,
  });

  const handleInteraction = (type) => {
    switch (type) {
      case 'likes':
        setState((prev) => ({
          ...prev,
          likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
          isLiked: !prev.isLiked,
        }));
        break;
      case 'appreciated':
        setState((prev) => ({
          ...prev,
          appreciated: prev.isAppreciated ? prev.appreciated - 1 : prev.appreciated + 1,
          isAppreciated: !prev.isAppreciated,
        }));
        break;
      case 'saved':
        setState((prev) => ({
          ...prev,
          isSaved: !prev.isSaved,
        }));
        break;
      case 'comments':
        setState((prev) => ({
          ...prev,
          comments: prev.comments + 1,
        }));
        break;
      case 'share':
        alert('Sharing...');
        break;
      case 'copy':
        alert('Link copied!');
        break;
      case 'coffee':
        window.open('https://www.buymeacoffee.com', '_blank');
        break;
    }
  };

  const IconsWithCounters = () => (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-800 rounded-lg">
      <button
        onClick={() => handleInteraction('likes')}
        className={`flex items-center gap-2 transition-colors ${
          state.isLiked ? 'text-blue-500' : 'text-gray-400'
        }`}
      >
        <ThumbsUp size={20} /> <span>Like {state.likes}</span>
      </button>
      <button
        onClick={() => handleInteraction('appreciated')}
        className={`flex items-center gap-2 transition-colors ${
          state.isAppreciated ? 'text-red-500' : 'text-gray-400'
        }`}
      >
        <Heart size={20} /> <span>Appreciate {state.appreciated}</span>
      </button>
      <button
        onClick={() => handleInteraction('saved')}
        className={`flex items-center gap-2 transition-colors ${
          state.isSaved ? 'text-yellow-500' : 'text-gray-400'
        }`}
      >
        <Bookmark size={20} fill={state.isSaved ? 'currentColor' : 'none'} /> <span>Save</span>
      </button>
      <button
        onClick={() => handleInteraction('comments')}
        className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors"
      >
        <MessageCircle size={20} /> <span>Comments {state.comments}</span>
      </button>
      <button
        onClick={() => handleInteraction('share')}
        className="flex items-center gap-2 text-gray-400 hover:text-purple-500 transition-colors"
      >
        <Share2 size={20} /> <span>Share</span>
      </button>
      <button
        onClick={() => handleInteraction('copy')}
        className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors"
      >
        <Copy size={20} /> <span>Copy Link</span>
      </button>
      <button
        onClick={() => handleInteraction('coffee')}
        className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors"
      >
        <Coffee size={20} /> <span>Buy me a coffee</span>
      </button>
    </div>
  );

  const FloatingBar = () => (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4 p-4 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
      <button
        onClick={() => handleInteraction('likes')}
        className={`transition-colors ${state.isLiked ? 'text-blue-500' : 'text-gray-400'}`}
      >
        <ThumbsUp size={20} />
      </button>
      <button
        onClick={() => handleInteraction('appreciated')}
        className={`transition-colors ${state.isAppreciated ? 'text-red-500' : 'text-gray-400'}`}
      >
        <Heart size={20} />
      </button>
      <button
        onClick={() => handleInteraction('saved')}
        className={`transition-colors ${state.isSaved ? 'text-yellow-500' : 'text-gray-400'}`}
      >
        <Bookmark size={20} fill={state.isSaved ? 'currentColor' : 'none'} />
      </button>
      <button
        onClick={() => handleInteraction('comments')}
        className="transition-colors text-gray-400 hover:text-green-500"
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Icons with Counters</h2>
        <IconsWithCounters />
      </div>

      <div className="h-screen">
        <h2 className="text-xl font-semibold mb-4">Floating Bar (Scroll down)</h2>
        <div className="h-[200vh]">
          <FloatingBar />
        </div>
      </div>
    </div>
  );
}
