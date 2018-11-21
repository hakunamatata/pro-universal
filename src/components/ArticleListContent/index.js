import React from 'react';
import moment from 'moment';
import { Avatar } from 'antd';
import styles from './index.less';

const ArticleListContent = ({ data: { abstract, updatedAt, titleImage, author } }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>{abstract}</div>
    <div className={styles.extra}>
      <Avatar src={titleImage} size="small" />
      <span>{author}</span>发布在于
      <em>{moment(updatedAt).format('YYYY-MM-DD HH:mm')}</em>
    </div>
  </div>
);

export default ArticleListContent;
