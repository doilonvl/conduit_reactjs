import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../Header CSS/Baner.css"

const NewArticle = () => {
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tagList, setTagList] = useState('');

    const currToken = localStorage.getItem("currToken")

    const handleAdd = async (e) => {
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
                    'Authorization': `Bearer ${currToken}`,
                }
            };
            const response = await axios.post(
                'https://api.realworld.io/api/articles',
                {
                    article: {
                        title,
                        description,
                        body,
                        tagList: tagList.split(',').map(tag => tag.trim()),
                    }
                },
                config
            );
            Swal.fire({
                icon: 'success',
                title: 'Article published successfully!',
            });
        } catch (error) {
            console.error('Error creating article:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    };

    return (
        <div className='edit'>
            <input type='text' onChange={(e) => setTitle(e.target.value)} placeholder='Article Title' /><br />
            <input type='text' onChange={(e) => setDescription(e.target.value)} className='i2' placeholder="What's this article about?" /><br />
            <textarea onChange={(e) => setBody(e.target.value)} placeholder='Write your article (in markdown)'></textarea><br />
            <input type='text' onChange={(e) => setTagList(e.target.value)} className='i2' placeholder='Enter tags' /><br />
            <button onClick={handleAdd} className='pArticle text-white'>Publish Article</button>
        </div>
    );
};

export default NewArticle