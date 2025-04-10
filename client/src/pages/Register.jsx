import { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className='register-container'>
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input className='register-input-text' name="name" placeholder="Name" value={form.name} onChange={handleChange}/>
            <input className='register-input-text' name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input className='register-input-text' name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            <div className='register-button-group'>
                <button type='submit'>Register</button>
                <button onClick={(e) => {e.preventDefault(); navigate("/login")}}>Log In</button>
            </div>
        </form>
    </div>
  );
}
