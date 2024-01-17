import React, { useState, useEffect } from 'react';
import "../Header CSS/DetailUser.css"
import axios from 'axios';
import { NavLink, useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Container, Col } from 'react-bootstrap';

const FavoriteArticle = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [myFavoritedArticles, setMyFavoritedArticles] = useState([]);
    const [hoveredArticle, setHoveredArticle] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(5);
    const currUsername = localStorage.getItem("currUsername")
    const currBio = localStorage.getItem("currBio")
    const currToken = localStorage.getItem("currToken")
    const nav = useNavigate()
    const { username } = useParams()
    const url = username.slice(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${currToken}`,
                    },
                };
                const response = await axios.get(`https://api.realworld.io/api/profiles/${url}`, config);
                setIsFollowing(response.data.isFollowing);
                setProfiles(response.data.profile)
                console.log(response.data);
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };
        fetchData()
    }, [url]);

    const handleFollow = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currToken}`,
                },
            };
            const response = await axios.post(`https://api.realworld.io/api/profiles/${url}/follow`, {}, config);
            setIsFollowing(true);
            setProfiles(response.data.profile)
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currToken}`,
                },
            };
            const response = await axios.delete(`https://api.realworld.io/api/profiles/${url}/follow`, config);
            setIsFollowing(false);
            setProfiles(response.data.profile);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currToken}`,
                    },
                };
                const response = await axios.get(`https://api.realworld.io/api/articles?favorited=${url}&limit=20`, config);
                setMyFavoritedArticles(response.data.articles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };
        fetchArticles();
    }, [currToken, url]);

    const handleFavoriteClick = async (slug) => {
        if (currToken) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currToken}`,
                },
            };
            try {
                const article = myFavoritedArticles.find((article) => article.slug === slug);
                if (article.favorited) {
                    await axios.delete(`https://api.realworld.io/api/articles/${slug}/favorite`, config)
                        .then((response) => {
                            article.favorited = response.data.article.favorited;
                            article.favoritesCount = response.data.article.favoritesCount;
                            setMyFavoritedArticles([...myFavoritedArticles]);
                        })
                        .catch((error) => {
                            console.log('Error: ' + error);
                        });
                } else {
                    await axios.post(`https://api.realworld.io/api/articles/${slug}/favorite`, {}, config)
                        .then((response) => {
                            article.favorited = response.data.article.favorited;
                            article.favoritesCount = response.data.article.favoritesCount;
                            setMyFavoritedArticles([...myFavoritedArticles]);
                        })
                        .catch((error) => {
                            console.log('Error: ' + error);
                        });
                }
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            nav('/register')
        }
    };

    console.log(myFavoritedArticles);
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const myFavoritedArticle = myFavoritedArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='profile-page'>
            <div className='user-info'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-xs-12 col-md-10 offset-md-1'>
                            <img ng-src={profiles.image} className='user-img' src={profiles.image} />
                            <h4>{profiles.username}</h4>
                            <p>{profiles.bio}</p>
                            {profiles.username != currUsername ? (<follow-btn className='ng-isolate-scope'>
                                {profiles.following ? (
                                    <button onClick={handleUnfollow} className='btn btn-sm action-btn ng-binding btn-outline-secondary'>
                                        <i className='fa-solid fa-minus'></i>
                                        + Unfollow {`${profiles.username}`}
                                    </button>
                                ) : (
                                    <button onClick={handleFollow} className='btn btn-sm action-btn ng-binding btn-outline-secondary'>
                                        <i className='fa-solid fa-plus'></i>
                                        + Follow {`${profiles.username}`}
                                    </button>
                                )}
                            </follow-btn>) : (<p></p>)}

                        </div>
                    </div>
                    <Row>
                        <Col xs={8}>
                        </Col>
                        <Col>
                            {profiles.username == currUsername ? (<a
                                href='/settings'
                            >
                                <i className="bi bi-gear-wide"></i>
                                &nbsp;Edit Profile Settings
                            </a>) : (<p></p>)}
                        </Col>
                    </Row>
                </div>
            </div>

            <div className='container'>
                <Row>
                    <Col xs={2}></Col>
                    <Col xs={8}>
                        <div className='articles-toogle'>
                            <ul className='nav articles-list outline-active'>
                                <li className='nav-item'>
                                    <NavLink className="text-deco margin-right" to={'/@' + url}>My Articles</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className="text-deco2" to={'/@' + url + '/favorites'}>Favorited Articles</NavLink>
                                </li>
                            </ul>

                        </div>
                    </Col>
                </Row>
                <div style={{ width: "78%", margin: "auto", marginTop: "20px" }}>
                    {myFavoritedArticle.length === 0 ? (
                        <Row>
                            <Col xs={0}></Col>
                            <Col xs={11}>
                                <p style={{borderTop:"1px solid rgba(0, 0, 0, 0.1)"}}>No articles are here... yet.</p>
                            </Col>
                        </Row>

                    ) : (
                        myFavoritedArticle.map(myA => (
                            <div key={myA.slug}>
                                <Row className='article-preview-ar'>
                                    <Col xs={1}></Col>
                                    <Col xs={5} className='flex'>
                                        <a href={'/@' + myA.author.username} className='size-img'>
                                            <img src={myA.author.image} alt="" />
                                        </a>
                                        <div className='user-detail'>
                                            <a href={`/@${myA.author.username}`} className='size-img'>
                                                {myA.author.username}
                                            </a>
                                            <p>{new Date(myA.createdAt).toLocaleDateString("en-US", {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div>
                                            <button
                                                className={`btn btn-sm btn-outline-primary buright flex ${hoveredArticle === myA.slug ? 'hovered' : ''}`}
                                                onClick={() => handleFavoriteClick(myA.slug)}
                                            >
                                                <i className="bi bi-heart-fill"></i>{myA.favoritesCount}
                                            </button>
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col xs={1}></Col>
                                    <Col xs={10}>
                                        <Link to={`/article/${myA.slug}`} className='font-link-ar'>
                                            <h1 className='font-title'>
                                                {myA.title}
                                            </h1>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}></Col>
                                    <Col xs={10}>
                                        <Link to={`/article/${myA.slug}`} className='font-desc-ar'>
                                            <p className='font-desc'>
                                                {myA.description}
                                            </p>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}></Col>
                                    <Col xs={11}>
                                        <Link to={`/article/${myA.slug}`} className='font-tag-ar'>
                                            <span className='font-tag'>Read more...</span>
                                            <ul className="tag-list">
                                                {myA.tagList.map((tag) => (
                                                    <li key={tag} className="tag-default tag-pill tag-outline">
                                                        {tag}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Link>
                                    </Col>
                                </Row>
                            </div>
                        ))
                    )}
                    <Row>
                        <Col xs={1}></Col>
                        <Col xs={11}>
                            <ul className="pagination">
                                {Array.from({ length: Math.ceil(myFavoritedArticle.length / articlesPerPage) }, (_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button onClick={() => paginate(index + 1)} className="page-link">
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>

                </div>
            </div>
        </div>
    );
};

export default FavoriteArticle;