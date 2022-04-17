import React from 'react';
import Article from './Article';
import Loading from './Loading';

function Posts(props) {
  let articles = props.articles;
  if (articles === null) return <Loading />;
  if (articles.length === 0) return <h1>No Articles are here... yet</h1>;
  return (
    <ul className='feed-list-holder'>
      {articles.map((article, i) => {
        return <Article key={article.slug} article={article} />;
      })}
    </ul>
  );
}

export default Posts;