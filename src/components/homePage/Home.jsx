import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Baner from '../Header/Header Com/Baner';
import { Row, Container, Col } from 'react-bootstrap';
import "../homePage/homePage.css/Home.css";
import { Tags } from 'react-bootstrap-icons';

const Home = () => {
    const nav = useNavigate()
    const [articles, setArticles] = useState([]);
    const [y, setY] = useState([]);
    const [tags, setTags] = useState([]);
    const [activeFeed, setActiveFeed] = useState('global');
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(10);
    const [hoveredArticle, setHoveredArticle] = useState(null);
    const [clickedArticle, setClickedArticle] = useState(null);
    const [favorited, setFavorited] = useState([]);
    const [favoritesCount, setFavoritesCount] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [tagFilter, setTagFilter] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    const currToken = localStorage.getItem("currToken");
    const currUsername = localStorage.getItem("currUsername");

    const handleFeedToggle = (feedType) => {
        setActiveFeed(feedType);
    };


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://api.realworld.io/api/articles?limit=200');
                setArticles(response.data.articles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        const yourFeeds = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        'Authorization': `Bearer ${currToken}`,
                    },
                };
                const response = await axios.get(`https://api.realworld.io/api/articles/feed?limit=200`, config);
                setY(response.data.articles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        yourFeeds();
    }, [currToken, currUsername]);

    useEffect(() => {
        setLoading(true);
        axios.get('https://api.realworld.io/api/tags')
            .then((response) => {
                setTags(response.data.tags);
            })
            .catch((error) => {
                console.log('Error tags: ' + error);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleFavoriteClick = async (slug) => {
        if (currToken) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currToken}`,
                },
            };
            try {
                const article = articles.find((article) => article.slug === slug);
                if (article.favorited) {
                    await axios.delete(`https://api.realworld.io/api/articles/${slug}/favorite`, config)
                        .then((response) => {
                            article.favorited = response.data.article.favorited;
                            article.favoritesCount = response.data.article.favoritesCount;
                            setArticles([...articles]);
                            console.log(response.data);
                        })
                        .catch((error) => {
                            console.log('Error: ' + error);
                        });
                } else {
                    await axios.post(`https://api.realworld.io/api/articles/${slug}/favorite`, {}, config)
                        .then((response) => {
                            article.favorited = response.data.article.favorited;
                            article.favoritesCount = response.data.article.favoritesCount;
                            setArticles([...articles]);
                            console.log(response.data);
                        })
                        .catch((error) => {
                            console.log('Error: ' + error);
                        });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            nav('/register')
        }
    };
    const renderTagList = () => {
        return (
            <div className='sidebar'>
                <p>Popular Tags</p>
                <ul>
                    {tags.map((tag) => (
                        <li key={tag}>
                            <button className='tag-button' onClick={() => {
                                setActiveFeed('tag');
                                console.log('Clicked tag:', tag);
                                setSelectedTag(tag);
                                setCurrentPage(1);
                                setTagFilter(tag);
                            }}>
                                {tag}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )
    };

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const yourFeed = y.slice(indexOfFirstArticle, indexOfLastArticle);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
        <>
            {!currToken && <Baner />}
            <Container className='page'>
                <Row>
                    <Col md={9}>
                        <div className='flex botbor'>
                            {currToken && (
                                <div
                                    className={`your ${activeFeed === 'your' ? 'active' : ''}`}
                                    onClick={() => handleFeedToggle('your')}
                                >
                                    Your Feed
                                </div>
                            )}
                            <div
                                className={`global ${activeFeed === 'global' ? 'active' : ''}`}
                                onClick={() => handleFeedToggle('global')}
                            >
                                Global Feed
                            </div>
                            {selectedTag && (
                                <div
                                    className={`tag ${activeFeed === 'tag' ? 'active' : ''}`}
                                    onClick={() => handleFeedToggle('tag')}
                                >
                                    <i class="bi bi-threads"></i> {selectedTag}
                                </div>

                            )}

                        </div>
                        {/* Display content based on activeFeed */}
                        {activeFeed === 'your' && currToken && <div>
                            {loading && <p>Loading articles...</p>}
                            {yourFeed.map(y => (
                                <div key={y.slug}>
                                    <Row className='article-preview'>
                                        <Col xs="6" className='flex'>
                                            <a href={'/@' + y.author.username} className='size-img'>
                                                <img src={y.author.image} alt="" />
                                            </a>
                                            <div className='user-detail'>
                                                <a href={`/@${y.author.username}`} className='size-img'>
                                                    {y.author.username}
                                                </a>
                                                <p>{new Date(y.createdAt).toLocaleDateString("en-US", {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</p>
                                            </div>
                                        </Col>
                                        <Col xs="6">
                                            <div>
                                                <button
                                                    className={`btn btn-sm btn-outline-primary buright flex ${hoveredArticle === y.slug ? 'hovered' : ''}`}
                                                    onClick={() => handleFavoriteClick(y.slug)}
                                                >
                                                    <i className="bi bi-heart-fill"></i>{y.favoritesCount}
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Link to={`/article/${y.slug}`} className='font-link-ar'>
                                        <h1 className='font-title'>
                                            {y.title}
                                        </h1>
                                    </Link>
                                    <Link to={`/article/${y.slug}`} className='font-desc-ar'>
                                        <p className='font-desc'>
                                            {y.description}
                                        </p>
                                    </Link>
                                    <Link to={`/article/${y.slug}`} className='font-tag-ar'>
                                        <span className='font-tag'>Read more...</span>
                                        <ul className="tag-list">
                                            {y.tagList.map((tag) => (
                                                <li key={tag} className="tag-default tag-pill tag-outline">
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>
                                    </Link>
                                </div>
                            ))}
                            {/* Pagination */}
                            <ul className="pagination">
                                {Array.from({ length: Math.ceil(y.length / articlesPerPage) }, (_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button onClick={() => paginate(index + 1)} className="page-link">
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>}
                        {activeFeed === 'global' && (
                            <div>
                                {loading && <p>Loading articles...</p>}
                                {currentArticles.map(article => (
                                    <div key={article.slug}>
                                        <Row className='article-preview'>
                                            <Col xs="6" className='flex'>
                                                <a href={'/@' + article.author.username} className='size-img'>
                                                    <img src={article.author.image} alt="" />
                                                </a>
                                                <div className='user-detail'>
                                                    <a href={`/@${article.author.username}`} className='size-img'>
                                                        {article.author.username}
                                                    </a>
                                                    <p>{new Date(article.createdAt).toLocaleDateString("en-US", {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</p>
                                                </div>
                                            </Col>
                                            <Col xs="6">
                                                <div>
                                                    <button
                                                        className={`btn btn-sm btn-outline-primary buright flex ${hoveredArticle === article.slug ? 'hovered' : ''}`}
                                                        onClick={() => handleFavoriteClick(article.slug)}
                                                    >
                                                        <i className="bi bi-heart-fill"></i>{article.favoritesCount}
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Link to={`/article/${article.slug}`} className='font-link-ar'>
                                            <h1 className='font-title'>
                                                {article.title}
                                            </h1>
                                        </Link>
                                        <Link to={`/article/${article.slug}`} className='font-desc-ar'>
                                            <p className='font-desc'>
                                                {article.description}
                                            </p>
                                        </Link>
                                        <Link to={`/article/${article.slug}`} className='font-tag-ar'>
                                            <span className='font-tag'>Read more...</span>
                                            <ul className="tag-list">
                                                {article.tagList.map((tag) => (
                                                    <li key={tag} className="tag-default tag-pill tag-outline">
                                                        {tag}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Link>
                                    </div>
                                ))}
                                {/* Pagination */}
                                <ul className="pagination">
                                    {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button onClick={() => paginate(index + 1)} className="page-link">
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeFeed === 'tag' && (
                            <div>
                                {loading && <p>Loading articles...</p>}
                                {articles
                                    .filter((article) => selectedTag && article.tagList.includes(selectedTag))
                                    .slice(indexOfFirstArticle, indexOfLastArticle)
                                    .map((article) => (
                                        <div key={article.slug}>
                                            <Row className='article-preview'>
                                                <Col xs="6" className='flex'>
                                                    <a href={'/@' + article.author.username} className='size-img'>
                                                        <img src={article.author.image} alt="" />
                                                    </a>
                                                    <div className='user-detail'>
                                                        <a href={'/@' + article.author.username} className='size-img'>
                                                            {article.author.username}
                                                        </a>
                                                        <p>{new Date(article.createdAt).toLocaleDateString("en-US", {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}</p>
                                                    </div>
                                                </Col>
                                                <Col xs="6">
                                                    <div>
                                                        <button
                                                            className={`btn btn-sm btn-outline-primary buright flex ${hoveredArticle === article.slug ? 'hovered' : ''}`}
                                                            onClick={() => handleFavoriteClick(article)}
                                                            onMouseEnter={() => setHoveredArticle(article.slug)}
                                                            onMouseLeave={() => setHoveredArticle(null)}
                                                        >
                                                            <i className="bi bi-heart-fill"></i>{article.favoritesCount}
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Link to={`/article/${article.slug}`} className='font-link-ar'>
                                                <h1 className='font-title'>
                                                    {article.title}
                                                </h1>
                                            </Link>
                                            <Link to={`/article/${article.slug}`} className='font-desc-ar'>
                                                <p className='font-desc'>
                                                    {article.description}
                                                </p>
                                            </Link>
                                            <Link to={`/article/${article.slug}`} className='font-tag-ar'>
                                                <span className='font-tag'>Read more...</span>
                                                <ul className="tag-list">
                                                    {article.tagList.map((tag) => (
                                                        <li key={tag} className="tag-default tag-pill tag-outline">
                                                            {tag}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Link>
                                        </div>
                                    ))}

                                {/* Pagination */}
                                <ul className="pagination">
                                    {Array.from({ length: Math.ceil(articles.filter((article) => selectedTag && article.tagList.includes(selectedTag)).length / articlesPerPage) }, (_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button onClick={() => paginate(index + 1)} className="page-link">
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Col>
                    <Col md={3}>
                        {renderTagList()}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Home;