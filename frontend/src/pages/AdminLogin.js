import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail == null) setError('Login failed');
      else if (typeof detail === 'string') setError(detail);
      else if (Array.isArray(detail)) setError(detail.map(e => e.msg || JSON.stringify(e)).join(' '));
      else setError(String(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-['Unbounded'] text-xl font-black text-[#FFE800]">RIFT</span>
          <span className="font-['Unbounded'] text-xl font-light text-[#F5F5F5]">MARKET</span>
          <p className="text-sm text-[#737373] mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="rift-card rounded-sm p-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] font-bold text-[#737373] mb-1 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-[#050505] border-[#262626] text-[#F5F5F5] focus:ring-[#FFE800] focus:border-[#FFE800] rounded-sm"
              data-testid="admin-email-input"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] font-bold text-[#737373] mb-1 block">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-[#050505] border-[#262626] text-[#F5F5F5] focus:ring-[#FFE800] focus:border-[#FFE800] rounded-sm"
              data-testid="admin-password-input"
            />
          </div>
          {error && <p className="text-xs text-[#FF3B30]" data-testid="admin-login-error">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rift-btn-primary rounded-sm h-10 font-bold text-sm"
            data-testid="admin-login-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
