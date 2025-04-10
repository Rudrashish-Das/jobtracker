import { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
        <form onSubmit={handleSubmit}>
            <h2 className="">Log In</h2>
            <input className='login-input-text' name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input className='login-input-text' name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            <div className='login-button-group'>
                <button type='submit'>Log In</button>
                <button onClick={(e) => {e.preventDefault(); navigate("/register")}}>Register</button>
            </div>
        </form>
    </div>

  );
}
