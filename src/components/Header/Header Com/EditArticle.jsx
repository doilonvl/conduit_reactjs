import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Header CSS/Baner.css';
import { useParams, useNavigate } from 'react-router-dom';

const EditArticle = () => {
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tagList, setTagList] = useState([]);
    const [enteredTag, setEnteredTag] = useState('');
    const currToken = localStorage.getItem('currToken');
    const { slug } = useParams();
    const nav = useNavigate()

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${currToken}`,
                    },
                };
                const response = await axios.get(`https://api.realworld.io/api/articles/${slug}`, config);
                const article = response.data.article;

                setTitle(article.title);
                setDescription(article.description);
                setBody(article.body);
                setTagList(article.tagList);
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };
        fetchArticle();
    }, [slug, currToken]);

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!title || !description || !body || !tagList) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all fields!',
            });
            return;
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currToken}`,
                },
            };
            const response = await axios.put(
                `https://api.realworld.io/api/articles/${slug}`,
                {
                    article: {
                        title,
                        description,
                        body,
                        tagList,
                    },
                },
                config
            );
            Swal.fire({
                icon: 'success',
                title: 'Article published successfully!',
            });
            nav(`/article/${slug}`)
        } catch (error) {
            console.error('Error creating article:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    };

    const handleTagChange = (e) => {
        setEnteredTag(e.target.value);
    };

    const handleTagAdd = () => {
        if (enteredTag.trim() !== '' && !tagList.includes(enteredTag.trim())) {
            setTagList((prevTagList) => {
                const newTagList = [...prevTagList, enteredTag.trim()];
                localStorage.setItem('editArticleData', JSON.stringify({ title, description, body, tagList: newTagList }));
                return newTagList;
            });
            setEnteredTag('');
        }
    };
    
    const handleTagRemove = (tagToRemove) => {
        setTagList((prevTagList) => {
            const updatedTagList = prevTagList.filter((tag) => tag !== tagToRemove);
            localStorage.setItem('editArticleData', JSON.stringify({ title, description, body, tagList: updatedTagList }));
            return updatedTagList;
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleTagAdd();
        }
    };

    useEffect(() => {
        localStorage.setItem('editArticleData', JSON.stringify({ title, description, body, tagList }));
    }, [title, description, body, tagList]);


    return (
        <div className='edit'>
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} /><br />
            <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} className='i2' /><br />
            <textarea value={body} onChange={(e) => setBody(e.target.value)}></textarea><br />
            <div>
                <input
                    type='text'
                    value={enteredTag}
                    onChange={handleTagChange}
                    placeholder='Enter tags'
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleTagAdd} style={{ display: 'none' }}></button>
            </div>
            <div className='tag-list'>
                {tagList.map((tag, index) => (
                    <div key={index} className='tag-item'>
                        {tag}
                        <button onClick={() => handleTagRemove(tag)}>X</button>
                    </div>
                ))}
            </div>
            <button onClick={handleEdit} className='pArticle text-white'>Publish Article</button>
        </div>
    );
};

export default EditArticle;
