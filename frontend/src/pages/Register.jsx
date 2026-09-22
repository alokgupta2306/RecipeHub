import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="bg-cardWhite p-8 rounded-xl shadow-sm border border-borderGray w-full max-w-md">
        <h2 className="text-3xl font-poppins font-bold text-center mb-6">Create Account</h2>
        {error && <div className="bg-errorRed/10 text-errorRed p-3 rounded-lg mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-darkText mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-2 border border-borderGray rounded-lg focus:outline-none focus:border-primary"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-darkText mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-2 border border-borderGray rounded-lg focus:outline-none focus:border-primary"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-darkText mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-2 border border-borderGray rounded-lg focus:outline-none focus:border-primary"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primaryHover text-cardWhite font-bold py-3 rounded-lg transition-colors">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-mutedGray">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;