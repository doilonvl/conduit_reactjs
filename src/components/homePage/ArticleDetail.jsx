import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "../homePage/homePage.css/ArticleDetail.css"
import { Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const currUsername = localStorage.getItem("currUsername")
    const currToken = localStorage.getItem("currToken")
    const nav = useNavigate()
    const [hoveredArticle, setHoveredArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currToken}`,
                },
            };
            try {
                const response = await axios.get(`https://api.realworld.io/api/articles/${slug}`, config);
                setArticle(response.data.article);
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };
        fetchArticle();
    }, [slug, currToken]);

    if (!article) {
        return <div>Loading articles...</div>;
    }

    const handleFollow = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currToken}`,
                },
            };
            const response = await axios.post(`https://api.realworld.io/api/profiles/${article.author.username}/follow`, {}, config);
            setArticle((prevArticle) => ({
                ...prevArticle,
                author: {
                    ...prevArticle.author,
                    following: response.data.profile.following,
                },
            }));
            console.log(response);
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
            const response = await axios.delete(`https://api.realworld.io/api/profiles/${article.author.username}/follow`, config);
            setArticle((prevArticle) => ({
                ...prevArticle,
                author: {
                    ...prevArticle.author,
                    following: response.data.profile.following,
                },
            }));
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const handleFavoriteClick = async (slug) => {
        if (currToken) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currToken}`,
                },
            };
            try {
                if (article) {
                    if (article.favorited) {
                        await axios.delete(`https://api.realworld.io/api/articles/${slug}/favorite`, config)
                            .then((response) => {
                                setArticle((prevArticle) => ({
                                    ...prevArticle,
                                    favorited: response.data.article.favorited,
                                    favoritesCount: response.data.article.favoritesCount,
                                }));
                            })
                            .catch((error) => {
                                console.log('Error: ' + error);
                            });
                    } else {
                        await axios.post(`https://api.realworld.io/api/articles/${slug}/favorite`, {}, config)
                            .then((response) => {
                                setArticle((prevArticle) => ({
                                    ...prevArticle,
                                    favorited: response.data.article.favorited,
                                    favoritesCount: response.data.article.favoritesCount,
                                }));
                            })
                            .catch((error) => {
                                console.log('Error: ' + error);
                            });
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            nav('/register');
        }
    };

    const handleDeleteArticle = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${currToken}`,
                        },
                    };
                    const response = await axios.delete(`https://api.realworld.io/api/articles/${article.slug}`, config);
                    setArticle(response.data.article);
                    Swal.fire(
                        'Deleted!',
                        'Your article has been deleted.',
                        'success'
                    );
                    nav('/')
                } catch (error) {
                    console.error('Error deleting article:', error);
                    Swal.fire(
                        'Error!',
                        'An error occurred while deleting the article.',
                        'error'
                    );
                }
            }
        });
    };
    
    const handleToEdit = ()=> {
        nav(`/editor/${slug}`);
    }

    return (
        <div>
            <div className='banner-ar'>
                <div className='container-ar'>
                    <Row>
                        <Col xs={2}></Col>
                        <Col xs={8}>
                            <h1 className='text-h1-ar text-font-ar'>{article.title}</h1>
                            <div className='flex'>
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
                                {article.author.username !== currUsername ? (<follow-btn className='ng-isolate-scope'>
                                    {!article.author.following ? (
                                        <button onClick={handleFollow} className='btn btn-sm action-btn ng-binding btn-outline-secondary'>
                                            <i className='fa-solid fa-plus'></i>
                                            + Follow {`${article.author.username}`}
                                        </button>
                                    ) : (
                                        <button onClick={handleUnfollow} className='btn btn-sm action-btn ng-binding btn-outline-secondary'>
                                            <i className='fa-solid fa-minus'></i>
                                            + Unfollow {`${article.author.username}`}
                                        </button>
                                    )}
                                </follow-btn>) : (<p></p>)}
                                {article.author.username !== currUsername ? (<button
                                    className={`btn btn-sm btn-outline-primary buright flex ${hoveredArticle === article.slug ? 'hovered' : ''}`}
                                    onClick={() => handleFavoriteClick(article.slug)}
                                >
                                    {article.favorited ?
                                        (<div>
                                            <i className="bi bi-heart-fill"></i>Unfavorite Article{article.favoritesCount}
                                        </div>)
                                        : (<div>
                                            <i className="bi bi-heart-fill"></i>Favorite Article{article.favoritesCount}
                                        </div>)}

                                </button>) : (<div>
                                    <button onClick={handleToEdit} className='btn btn-sm action-btn ng-binding btn-outline-secondary'>Edit Article</button>
                                    <button onClick={handleDeleteArticle} className='btn btn-sm action-btn ng-binding btn-outline-danger'>Delete Article</button>
                                </div>)}
                            </div>
                        </Col>
                        <Col xs={2}></Col>
                    </Row>
                </div>
            </div>
            <div className='container page'>
                <Row>
                    <Col xs={0}></Col>
                    <Col xs={12} className='xs12'>
                        <p className='font-ar-body'>{article.body}</p>
                    </Col>
                    <Col xs={0}></Col>

                </Row>
                <ul className='same'>
                    {article.tagList.map((tag) => (
                        <li key={tag} className="tag-default tag-pill tag-outline">
                            {tag}
                        </li>
                    ))}
                </ul>
                <Row>
                    <Col xs={3}></Col>
                    <Col xs={7}>
                        <div className='flex'>
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
                            {article.author.username !== currUsername ? (<follow-btn className='ng-isolate-scope'>
                                {!article.author.following ? (
                                    <button onClick={handleFollow} className='btn btn-sm action-btn ng-binding btn-outline-secondary'>
                                        <i className='fa-solid fa-plus'></i>
                                        + Follow {`${article.author.username}`}
                                    </button>
                                ) : (
                                    <button onClick={handleUnfollow} className='btn btn-sm action-btn ng-binding btn-outline-secondary'>
                                        <i className='fa-solid fa-minus'></i>
                                        + Unfollow {`${article.author.username}`}
                                    </button>
                                )}
                            </follow-btn>) : (<p></p>)}
                            {article.author.username !== currUsername ? (<button
                                className={`btn btn-sm btn-outline-primary buright flex ${hoveredArticle === article.slug ? 'hovered' : ''}`}
                                onClick={() => handleFavoriteClick(article.slug)}
                            >
                                {article.favorited ?
                                    (<div>
                                        <i className="bi bi-heart-fill"></i>Unfavorite Article{article.favoritesCount}
                                    </div>)
                                    : (<div>
                                        <i className="bi bi-heart-fill"></i>Favorite Article{article.favoritesCount}
                                    </div>)}

                            </button>) : (<div>
                                <button onClick={handleToEdit} className='btn btn-sm action-btn ng-binding btn-outline-secondary'>Edit Article</button>
                                <button onClick={handleDeleteArticle} className='btn btn-sm action-btn ng-binding btn-outline-danger'>Delete Article</button>
                            </div>)}
                        </div>
                    </Col>
                    <Col xs={2}></Col>
                </Row>
            </div>
        </div >
    );
};

export default ArticleDetail;
