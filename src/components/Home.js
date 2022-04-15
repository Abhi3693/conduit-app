import React from 'react';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import Posts from './Posts';
import Sidebar from './Sidebar';
import FeedNav from './FeedNav';
import Pagination from './Pagination';
import { articlesURL, feedURL } from '../utils/constant';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: null,
      articlesCount: 0,
      articlesPerPage: 10,
      activePageIndex: 1,
      activeTag: '',
      feedSelected: '',
      error: '',
    };
  }

  emptyTab = () => {
    this.setState({ activeTag: '' });
  };
  addTab = (val) => {
    this.setState({ activeTag: val });
  };

  changeFeedSelected = (val) => {
    this.setState({ feedSelected: val }, () => {
      this.state.feedSelected === 'myFeed' ? this.myFeed() : this.getArticles();
    });
  };

  componentDidMount() {
    let isLoggedIn = this.props.token;
    if (isLoggedIn) {
      this.setState({ feedSelected: 'myFeed' }, this.myFeed());
    } else {
      this.setState({ feedSelected: 'globalFeed' }, this.getArticles());
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.activeTag !== this.state.activeTag) {
      this.getArticles();
    }
  }

  getArticles = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.activePageIndex - 1) * 10;
    let tag = this.state.activeTag;
    let token = JSON.parse(localStorage.getItem('token'));
    fetch(
      articlesURL +
        `/?offset=${offset}&limit=${limit}` +
        (tag && `&tag=${tag}`),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
          error: '',
        });
      })
      .catch((err) => this.setState({ error: err }));
  };

  myFeed = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.activePageIndex - 1) * 10;
    let token = JSON.parse(localStorage.getItem('token'));
    fetch(feedURL + `/?offset=${offset}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
          feedSelected: 'myFeed',
          tagSelected: '',
          error: '',
        });
      })
      .catch((err) => this.setState({ error: err }));
  };

  updateCurrentPageIndex = (val) => {
    this.setState({ activePageIndex: val }, this.getArticles);
  };

  render() {
    let {
      articles,
      articlesCount,
      articlesPerPage,
      activePageIndex,
      activeTag,
      error,
    } = this.state;
    let token = this.props.token;
    if (error) return <Error error={error} />;
    return (
      <main>
        <Banner />
        <section id='main'>
          <div className='container'>
            <div className='row flex space-btw'>
              <div className='feed'>
                <FeedNav
                  activeTag={activeTag}
                  emptyTab={this.emptyTab}
                  changeFeedSelected={this.changeFeedSelected}
                  feedSelected={this.state.feedSelected}
                  token={token}
                />
                <Posts articles={articles || []} token={token} />
              </div>
              <Sidebar addTab={this.addTab} />
            </div>
            <Pagination
              articlesCount={articlesCount}
              articlesPerPage={articlesPerPage}
              activePageIndex={activePageIndex}
              updateCurrentPageIndex={this.updateCurrentPageIndex}
            />
          </div>
        </section>
      </main>
    );
  }
}

function Banner() {
  return (
    <section id='hero-section'>
      <h1 className='hero-heading'>conduit</h1>
      <h2 className='hero-subheading'>A place to share your knowledge.</h2>
    </section>
  );
}

export default withRouter(Home);
