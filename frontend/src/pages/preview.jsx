import React from 'react';
import { Modal } from 'react-bootstrap';
import BookPreview from './BookPreview';
import BookChapterPreview from './BookChapterPreview';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

const BookModal = ({ show, onHide, book }) => {
  if (!book) return null;

  return (
<p>hello world</p>
  );
};

export default BookModal;
