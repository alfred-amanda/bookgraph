'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Heart, BookOpen } from 'lucide-react';
import { Book } from '@/lib/types';
import { useBookStore } from '@/lib/store';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
}

export default function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  const { updateBook, deleteBook, toggleLike } = useBookStore();
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = () => {
    updateBook(book.id, {
      title: title.trim() || book.title,
      author: author.trim() || book.author,
      description: description.trim(),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteBook(book.id);
      onClose();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-[--color-surface] rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[--color-border]">
          <div className="flex-1 pr-4">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg font-semibold bg-transparent border-b-2 border-[--color-accent] outline-none pb-1"
                style={{ fontFamily: 'var(--font-merriweather)' }}
                autoFocus
              />
            ) : (
              <h2
                className="text-lg font-semibold text-[--color-text-primary] leading-snug"
                style={{ fontFamily: 'var(--font-merriweather)' }}
              >
                {book.title}
              </h2>
            )}

            {isEditing ? (
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 w-full text-sm bg-transparent border-b border-[--color-border] outline-none text-[--color-text-secondary]"
              />
            ) : (
              <p className="text-sm text-[--color-text-secondary] mt-0.5">{book.author}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleLike(book.id)}
              className={`p-2 rounded-full transition-colors ${
                book.liked ? 'text-[--color-danger] bg-red-50' : 'text-[--color-text-secondary] hover:text-[--color-danger] hover:bg-red-50'
              }`}
            >
              <Heart size={18} fill={book.liked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-[--color-bg] text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Genres */}
        {book.genres.length > 0 && (
          <div className="px-6 py-3 border-b border-[--color-border] flex flex-wrap gap-2">
            {book.genres.map((genre) => (
              <span
                key={genre}
                className="text-xs px-2.5 py-1 bg-[--color-accent-light] text-[--color-accent-hover] rounded-full font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="px-6 py-4">
          <label className="text-xs font-medium text-[--color-text-secondary] uppercase tracking-wide mb-2 block">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 rounded-md border border-[--color-border] text-sm outline-none focus:border-[--color-accent] resize-none"
              placeholder="Add a description..."
            />
          ) : (
            <p className="text-sm text-[--color-text-primary] leading-relaxed">
              {book.description || (
                <span className="text-[--color-text-secondary] italic">No description yet.</span>
              )}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[--color-border]">
          <button
            onClick={handleDelete}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
              confirmDelete
                ? 'bg-[--color-danger] text-white'
                : 'text-[--color-danger] hover:bg-red-50'
            }`}
          >
            <Trash2 size={14} />
            {confirmDelete ? 'Confirm Delete?' : 'Delete'}
          </button>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(book.title);
                    setAuthor(book.author);
                    setDescription(book.description);
                  }}
                  className="px-4 py-2 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] rounded-md hover:bg-[--color-bg] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium bg-[--color-accent] text-white rounded-md hover:bg-[--color-accent-hover] transition-colors"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium border border-[--color-border] text-[--color-text-secondary] rounded-md hover:border-[--color-accent] hover:text-[--color-accent] transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}