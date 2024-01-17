import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Header CSS/Login.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === '' || email === '' || password === '') {
      alert('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const registerResponse = await axios.post(
        'https://api.realworld.io/api/users',
        {
          user: {
            username,
            email,
            password,
          },
        }
      );

      const { user, errors } = registerResponse.data;

      if (user) {
        Swal.fire({
          position: 'top-mid',
          icon: 'success',
          title: 'Registration successful',
          showConfirmButton: false,
          timer: 1500,
        });

        sessionStorage.setItem('currUsername', user.username);
        navigate('/login');
        window.location.reload();
      } else {
          console.error('Registration errors:', errors);
      }
    } catch (error) {
      let x = '';
      const duplicateError = error.response.data.errors;
      for (const key in duplicateError) {
        console.log(key);
        x += (key.charAt(0).toUpperCase() + key.slice(1) + 'has already been taken\n');
      }
      alert(x);
    }
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="card" style={{ width: '600px' }}>
        <div className="card-header text-center">
          <h2>Sign up</h2>
          <Link to="/login" style={{ color: '#ccda8d', textDecoration: 'none' }}>
            Have an account?
          </Link>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group text-left">
              <label htmlFor="Username">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor="Email">Email</label>
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="pass"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-success"
              style={{ float: 'right', marginTop: '20px' }}
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
