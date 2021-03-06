import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import Loading from './Loading';
import LoginUserContext from '../ContextAPI/LoginUserContext';

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.contextInfo = null;
  }

  updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  static contextType = LoginUserContext;

  render() {
    this.contextInfo = this.context;
    let article = this.props.article;
    if (!article.author) return <Loading />;
    return (
      <li className='single-article'>
        <div className='flex space-btw'>
          <div className='img-author-holder flex gap-half'>
            <img
              className='author-img'
              src={article.author.image}
              alt={article.author.username}
            />
            <div className=''>
              <Link to={`/profile/${article.author.username}`}>
                <h3 className='author-name'>{article.author.username}</h3>
              </Link>
              <span className='date'>
                {this.updatedDate(article.updatedAt)}
              </span>
            </div>
          </div>
          <div
            onClick={() =>
              this.props.likeArticle(article.favorited, article.slug)
            }
            className='likes-count-holder'
          >
            {article.favorited ? (
              <AiFillHeart className='likes' />
            ) : (
              <AiOutlineHeart className='heart' />
            )}
            <span className='likes'>{article.favoritesCount}</span>
          </div>
        </div>
        <div className='padd-1'>
          <Link to={`/article/${article.slug}`}>
            <button className='article-title'>{article.title}</button>
            <button className='article-description'>
              {article.description.substring(0, 100)}...
            </button>
          </Link>
        </div>
        <div className='flex space-btw'>
          <Link to={`/article/${article.slug}`}>
            <button className='read-more'>Read more...</button>
          </Link>
          <Link to={`/article/${article.slug}`}>
            <div className='flex gap-half'>
              {article.tagList.map((tag) => {
                return (
                  <button key={tag} className='test'>
                    {tag}
                  </button>
                );
              })}
            </div>
          </Link>
        </div>
      </li>
    );
  }
}

export default Article;
