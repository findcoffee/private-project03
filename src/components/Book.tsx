import React from 'react';
import {
  BookOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import styles from './Book.module.css';
import { BookResType } from '../types';
import { Link } from 'react-router-dom';

interface BookProps extends BookResType {
  deleteBook: (id: number) => void;
}

// [project] 컨테이너에 작성된 함수를 컴포넌트에서 이용했다.
// [project] BookResType 의 응답 값을 이용하여, Book 컴포넌트를 완성했다.
const Book: React.FC<BookProps> = (book) => {
  return (
    <>
      <div className={styles.title}>
        <Link to={`/book/${book.bookId}`} className={styles.linkDetailTitle}>
          <BookOutlined />
          {book.title}
        </Link>
      </div>
      <div className={styles.author}>
        <Link to={`/book/${book.bookId}`} className={styles.linkDetailAuthor}>
          {book.author}
        </Link>
      </div>
      <div className={styles.created}>{book.createdAt}</div>
      <div className={styles.tooltips}>
        <Tooltip title={book.url}>
          <Link to={`/book/${book.bookId}`} className={styles.linkUrl}>
            <Button
              type="primary"
              className={styles.buttonUrl}
              shape="circle"
              size="small"
              icon={<HomeOutlined />}
            />
          </Link>
        </Tooltip>
        <Tooltip title="Edit">
          <Link to={`/edit/${book.bookId}`}>
            <Button
              type="default"
              className={styles.buttonEdit}
              shape="circle"
              size="small"
              icon={<EditOutlined />}
            />
          </Link>
        </Tooltip>
        <Tooltip title="Delete" className={styles.tooltips}>
          <Button
            type="primary"
            shape="circle"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => book.deleteBook(book.bookId)}
          />
        </Tooltip>
      </div>
    </>
  );
};
export default Book;
