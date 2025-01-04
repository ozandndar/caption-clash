import { useState } from 'react';

export function CaptionForm({ screenshotId, isSubmitting, setIsSubmitting }) {
  const [caption, setCaption] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/captions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screenshotId,
          text: caption.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit caption');
      }

      setCaption('');
      // You might want to trigger a refresh of the caption list here
    } catch (error) {
      console.error('Error submitting caption:', error);
      alert('Failed to submit caption. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
} 