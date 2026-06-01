'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useBookStore } from '@/lib/store';
import { PREDEFINED_GENRES } from '@/lib/genres';

interface AddBookModalProps {
  onClose: () => void;
}

export default function AddBookModal({ onClose }: AddBookModalProps) {
  const { addBook } = useBookStore();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; author?: string }>({});

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleAddCustomGenre = () => {
    const trimmed = customGenre.trim();
    if (trimmed && !selectedGenres.includes(trimmed)) {
      setSelectedGenres((prev) => [...prev, trimmed]);
    }
    setCustomGenre('');
  };

  const handleSave = () => {
    const newErrors: { title?: string; author?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addBook({
      title: title.trim(),
      author: author.trim(),
      genres: selectedGenres,
      description: description.trim(),
      liked: false,
    });

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[--color-surface] rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[--color-border]">
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-merriweather)' }}>
            Add a Book
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[--color-bg] text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[--color-text-primary]">
              Title <span className="text-[--color-danger]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. The Great Gatsby"
              className={`w-full px-3 py-2.5 rounded-md border text-sm outline-none transition-colors focus:ring-1 focus:ring-[--color-accent] ${
                errors.title ? 'border-[--color-danger]' : 'border-[--color-border] focus:border-[--color-accent]'
              }`}
              autoFocus
            />
            {errors.title && <p className="text-xs text-[--color-danger]">{errors.title}</p>}
          </div>

          {/* Author */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[--color-text-primary]">
              Author <span className="text-[--color-danger]">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
              }}
              placeholder="e.g. F. Scott Fitzgerald"
              className={`w-full px-3 py-2.5 rounded-md border text-sm outline-none transition-colors focus:ring-1 focus:ring-[--color-accent] ${
                errors.author ? 'border-[--color-danger]' : 'border-[--color-border] focus:border-[--color-accent]'
              }`}
            />
            {errors.author && <p className="text-xs text-[--color-danger]">{errors.author}</p>}
          </div>

          {/* Genres */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[--color-text-primary]">Genres</label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-[--color-accent] border-[--color-accent] text-white'
                      : 'border-[--color-border] text-[--color-text-secondary] hover:border-[--color-accent] hover:text-[--color-accent]'
                  }`}
                >
                  {selectedGenres.includes(genre) && <Check size={10} className="inline mr-1" />}
                  {genre}
                </button>
              ))}
            </div>

            {/* Custom genre input */}
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomGenre();
                  }
                }}
                placeholder="Add custom genre..."
                className="flex-1 px-3 py-2 rounded-md border border-[--color-border] text-sm outline-none focus:border-[--color-accent]"
              />
              <button
                type="button"
                onClick={handleAddCustomGenre}
                className="px-3 py-2 text-sm border border-[--color-border] rounded-md text-[--color-text-secondary] hover:border-[--color-accent] hover:text-[--color-accent] transition-colors"
              >
                Add
              </button>
            </div>

            {selectedGenres.length > 0 && (
              <p className="text-xs text-[--color-text-secondary]">
                {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[--color-text-primary]">
              Description <span className="text-[--color-text-secondary] font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this book about?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-md border border-[--color-border] text-sm outline-none focus:border-[--color-accent] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[--color-border]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] rounded-md hover:bg-[--color-bg] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium bg-[--color-accent] text-white rounded-md hover:bg-[--color-accent-hover] transition-colors shadow-sm"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}