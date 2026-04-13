import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { GameController, Package, ShoppingBag, ChartBar, SignOut, Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function useAdminApi() {
  const api = useCallback((method, url, data) => {
    return axios({ method, url: `${API}${url}`, data, withCredentials: true });
  }, []);
  return api;
}

// ---- Stats Panel ----
function StatsPanel() {
  const [stats, setStats] = useState(null);
  const api = useAdminApi();
  useEffect(() => { api('get', '/admin/stats').then(r => setStats(r.data)).catch(() => {}); }, [api]);
  if (!stats) return <div className="text-[#737373] text-sm">Loading stats...</div>;
  const items = [
    { label: 'Total Orders', value: stats.total_orders, color: 'text-[#FFE800]' },
    { label: 'Revenue', value: `$${stats.total_revenue.toFixed(2)}`, color: 'text-[#39FF14]' },
    { label: 'Games', value: stats.total_games, color: 'text-[#FFE800]' },
    { label: 'Products', value: stats.total_products, color: 'text-[#FFE800]' },
    { label: 'Pending Orders', value: stats.pending_orders, color: 'text-[#FF3B30]' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" data-testid="admin-stats-panel">
      {items.map((s, i) => (
        <div key={i} className="rift-card rounded-sm p-4">
          <p className="text-xs uppercase tracking-wider font-bold text-[#737373]">{s.label}</p>
          <p className={`font-['Unbounded'] text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ---- Games Tab ----
function GamesTab() {
  const [games, setGames] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '', is_active: true });
  const api = useAdminApi();

  const loadGames = useCallback(() => {
    api('get', '/games?active_only=false').then(r => setGames(r.data)).catch(() => {});
  }, [api]);

  useEffect(() => { loadGames(); }, [loadGames]);

  const resetForm = () => { setForm({ name: '', slug: '', description: '', image_url: '', is_active: true }); setEditing(null); };

  const openEdit = (game) => {
    setEditing(game);
    setForm({ name: game.name, slug: game.slug, description: game.description || '', image_url: game.image_url || '', is_active: game.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api('put', `/admin/games/${editing.id}`, form);
      } else {
        await api('post', '/admin/games', form);
      }
      loadGames();
      setDialogOpen(false);
      resetForm();
    } catch (e) {
      alert(e.response?.data?.detail || 'Error saving game');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this game and all its products?')) return;
    try {
      await api('delete', `/admin/games/${id}`);
      loadGames();
    } catch (e) {
      alert(e.response?.data?.detail || 'Error deleting game');
    }
  };

  return (
    <div data-testid="admin-games-tab">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-['Unbounded'] text-lg font-bold text-[#F5F5F5]">Games ({games.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rift-btn-primary rounded-sm text-xs font-bold" data-testid="add-game-btn">
              <Plus size={16} className="mr-1" /> Add Game
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111111] border-[#262626] text-[#F5F5F5] max-w-md">
            <DialogHeader>
              <DialogTitle className="font-['Unbounded'] text-[#F5F5F5]">{editing ? 'Edit Game' : 'Add Game'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <Input placeholder="Game Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="game-name-input" />
              <Input placeholder="slug (e.g. blox-fruits)" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="game-slug-input" />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="game-desc-input" />
              <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="game-image-input" />
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} data-testid="game-active-switch" />
                <span className="text-sm text-[#A3A3A3]">Active</span>
              </div>
              <Button onClick={handleSave} className="w-full rift-btn-primary rounded-sm font-bold text-sm" data-testid="game-save-btn">
                {editing ? 'Update Game' : 'Create Game'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rift-card rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#262626] hover:bg-transparent">
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Slug</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Products</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map(game => (
              <TableRow key={game.id} className="border-[#262626] hover:bg-white/5" data-testid={`game-row-${game.id}`}>
                <TableCell className="text-[#F5F5F5] font-medium">{game.name}</TableCell>
                <TableCell className="text-[#A3A3A3] text-sm font-mono">{game.slug}</TableCell>
                <TableCell className="text-[#A3A3A3]">{game.product_count || 0}</TableCell>
                <TableCell>
                  <span className={`text-xs font-bold uppercase tracking-wider ${game.is_active ? 'text-[#39FF14]' : 'text-[#FF3B30]'}`}>
                    {game.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button onClick={() => openEdit(game)} className="p-1.5 hover:bg-white/10 rounded mr-1" data-testid={`edit-game-${game.id}`}>
                    <PencilSimple size={16} className="text-[#A3A3A3]" />
                  </button>
                  <button onClick={() => handleDelete(game.id)} className="p-1.5 hover:bg-white/10 rounded" data-testid={`delete-game-${game.id}`}>
                    <Trash size={16} className="text-[#FF3B30]" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {games.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-[#737373] py-8">No games yet. Add your first game above.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ---- Products Tab ----
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [games, setGames] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ game_id: '', name: '', description: '', image_url: '', price: '', original_price: '', stock: '-1', is_active: true });
  const [filterGameId, setFilterGameId] = useState('all');
  const api = useAdminApi();

  const loadData = useCallback(() => {
    api('get', '/games?active_only=false').then(r => setGames(r.data)).catch(() => {});
    const url = filterGameId && filterGameId !== 'all' ? `/products?game_id=${filterGameId}&active_only=false` : '/products?active_only=false';
    api('get', url).then(r => setProducts(r.data)).catch(() => {});
  }, [api, filterGameId]);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => { setForm({ game_id: '', name: '', description: '', image_url: '', price: '', original_price: '', stock: '-1', is_active: true }); setEditing(null); };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ game_id: p.game_id, name: p.name, description: p.description || '', image_url: p.image_url || '', price: String(p.price), original_price: String(p.original_price || ''), stock: String(p.stock), is_active: p.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, price: parseFloat(form.price), original_price: form.original_price ? parseFloat(form.original_price) : null, stock: parseInt(form.stock) };
      if (editing) {
        await api('put', `/admin/products/${editing.id}`, payload);
      } else {
        await api('post', '/admin/products', payload);
      }
      loadData();
      setDialogOpen(false);
      resetForm();
    } catch (e) {
      alert(e.response?.data?.detail || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api('delete', `/admin/products/${id}`);
      loadData();
    } catch (e) {
      alert(e.response?.data?.detail || 'Error deleting product');
    }
  };

  const getGameName = (gid) => games.find(g => g.id === gid)?.name || 'Unknown';

  return (
    <div data-testid="admin-products-tab">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="font-['Unbounded'] text-lg font-bold text-[#F5F5F5]">Products ({products.length})</h3>
        <div className="flex items-center gap-3">
          <Select value={filterGameId} onValueChange={setFilterGameId}>
            <SelectTrigger className="w-48 bg-[#050505] border-[#262626] text-[#F5F5F5] rounded-sm" data-testid="product-filter-game">
              <SelectValue placeholder="All Games" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-[#262626]">
              <SelectItem value="all" className="text-[#F5F5F5]">All Games</SelectItem>
              {games.map(g => <SelectItem key={g.id} value={g.id} className="text-[#F5F5F5]">{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="rift-btn-primary rounded-sm text-xs font-bold" data-testid="add-product-btn">
                <Plus size={16} className="mr-1" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111111] border-[#262626] text-[#F5F5F5] max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-['Unbounded'] text-[#F5F5F5]">{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <Select value={form.game_id} onValueChange={v => setForm({ ...form, game_id: v })}>
                  <SelectTrigger className="bg-[#050505] border-[#262626] text-[#F5F5F5] rounded-sm" data-testid="product-game-select">
                    <SelectValue placeholder="Select Game" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#262626]">
                    {games.map(g => <SelectItem key={g.id} value={g.id} className="text-[#F5F5F5]">{g.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="product-name-input" />
                <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="product-desc-input" />
                <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="product-image-input" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Price ($)" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="product-price-input" />
                  <Input placeholder="Original Price ($)" type="number" step="0.01" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="product-original-price-input" />
                </div>
                <Input placeholder="Stock (-1 for unlimited)" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="bg-[#050505] border-[#262626] text-[#F5F5F5]" data-testid="product-stock-input" />
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} data-testid="product-active-switch" />
                  <span className="text-sm text-[#A3A3A3]">Active</span>
                </div>
                <Button onClick={handleSave} className="w-full rift-btn-primary rounded-sm font-bold text-sm" data-testid="product-save-btn">
                  {editing ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rift-card rounded-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#262626] hover:bg-transparent">
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Game</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Price</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Stock</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Sold</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.id} className="border-[#262626] hover:bg-white/5" data-testid={`product-row-${p.id}`}>
                <TableCell className="text-[#F5F5F5] font-medium max-w-[200px] truncate">{p.name}</TableCell>
                <TableCell className="text-[#A3A3A3] text-sm">{getGameName(p.game_id)}</TableCell>
                <TableCell className="text-[#FFE800] font-bold">${p.price.toFixed(2)}</TableCell>
                <TableCell className="text-[#A3A3A3]">{p.stock === -1 ? 'Unlimited' : p.stock}</TableCell>
                <TableCell className="text-[#A3A3A3]">{p.sold_count || 0}</TableCell>
                <TableCell>
                  <span className={`text-xs font-bold uppercase tracking-wider ${p.is_active ? 'text-[#39FF14]' : 'text-[#FF3B30]'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-white/10 rounded mr-1" data-testid={`edit-product-${p.id}`}>
                    <PencilSimple size={16} className="text-[#A3A3A3]" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-white/10 rounded" data-testid={`delete-product-${p.id}`}>
                    <Trash size={16} className="text-[#FF3B30]" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-[#737373] py-8">No products. Add games first, then create products.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ---- Orders Tab ----
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const api = useAdminApi();

  const loadOrders = useCallback(() => {
    const url = filterStatus && filterStatus !== 'all' ? `/admin/orders?status=${filterStatus}` : '/admin/orders';
    api('get', url).then(r => { setOrders(r.data.orders); setTotal(r.data.total); }).catch(() => {});
  }, [api, filterStatus]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const updateStatus = async (orderId, status) => {
    try {
      await api('put', `/admin/orders/${orderId}/status`, { status });
      loadOrders();
    } catch (e) {
      alert(e.response?.data?.detail || 'Error updating order');
    }
  };

  return (
    <div data-testid="admin-orders-tab">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="font-['Unbounded'] text-lg font-bold text-[#F5F5F5]">Orders ({total})</h3>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-[#050505] border-[#262626] text-[#F5F5F5] rounded-sm" data-testid="order-filter-status">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-[#262626]">
            <SelectItem value="all" className="text-[#F5F5F5]">All Status</SelectItem>
            <SelectItem value="pending" className="text-[#F5F5F5]">Pending</SelectItem>
            <SelectItem value="paid" className="text-[#F5F5F5]">Paid</SelectItem>
            <SelectItem value="delivered" className="text-[#F5F5F5]">Delivered</SelectItem>
            <SelectItem value="cancelled" className="text-[#F5F5F5]">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rift-card rounded-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#262626] hover:bg-transparent">
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Order #</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Customer</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Items</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Total</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-[#737373] text-xs uppercase tracking-wider text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(o => (
              <TableRow key={o.id} className="border-[#262626] hover:bg-white/5" data-testid={`order-row-${o.id}`}>
                <TableCell className="font-mono text-[#FFE800] text-sm font-bold">{o.order_number}</TableCell>
                <TableCell>
                  <p className="text-[#F5F5F5] text-sm">{o.customer_name}</p>
                  <p className="text-[#737373] text-xs">{o.customer_email}</p>
                </TableCell>
                <TableCell className="text-[#A3A3A3] text-sm">{o.items.length} item(s)</TableCell>
                <TableCell className="text-[#F5F5F5] font-bold">${o.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    o.status === 'delivered' ? 'text-[#39FF14]' :
                    o.status === 'paid' ? 'text-[#FFE800]' :
                    o.status === 'cancelled' ? 'text-[#FF3B30]' :
                    'text-[#A3A3A3]'
                  }`}>{o.status}</span>
                </TableCell>
                <TableCell className="text-[#737373] text-xs">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                    <SelectTrigger className="w-28 bg-[#050505] border-[#262626] text-[#F5F5F5] rounded-sm h-8 text-xs" data-testid={`order-status-select-${o.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#262626]">
                      <SelectItem value="pending" className="text-[#F5F5F5]">Pending</SelectItem>
                      <SelectItem value="paid" className="text-[#F5F5F5]">Paid</SelectItem>
                      <SelectItem value="delivered" className="text-[#F5F5F5]">Delivered</SelectItem>
                      <SelectItem value="cancelled" className="text-[#F5F5F5]">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-[#737373] py-8">No orders yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ---- Main Dashboard ----
export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFE800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="admin-dashboard">
      {/* Admin Header */}
      <div className="border-b border-[#262626] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <span className="font-['Unbounded'] text-sm font-black text-[#FFE800]">RIFT</span>
            <span className="text-xs text-[#737373] border-l border-[#262626] pl-4">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#A3A3A3]">{user.email}</span>
            <button onClick={logout} className="p-2 hover:bg-white/10 rounded" data-testid="admin-logout-btn">
              <SignOut size={18} className="text-[#A3A3A3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-8">
        <StatsPanel />

        <div className="mt-8">
          <Tabs defaultValue="games" className="w-full">
            <TabsList className="bg-[#111111] border border-[#262626] rounded-sm p-1 mb-6" data-testid="admin-tabs">
              <TabsTrigger value="games" className="rounded-sm text-xs font-bold data-[state=active]:bg-[#FFE800] data-[state=active]:text-[#050505] text-[#A3A3A3]" data-testid="tab-games">
                <GameController size={16} className="mr-1" /> Games
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-sm text-xs font-bold data-[state=active]:bg-[#FFE800] data-[state=active]:text-[#050505] text-[#A3A3A3]" data-testid="tab-products">
                <Package size={16} className="mr-1" /> Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-sm text-xs font-bold data-[state=active]:bg-[#FFE800] data-[state=active]:text-[#050505] text-[#A3A3A3]" data-testid="tab-orders">
                <ShoppingBag size={16} className="mr-1" /> Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="games"><GamesTab /></TabsContent>
            <TabsContent value="products"><ProductsTab /></TabsContent>
            <TabsContent value="orders"><OrdersTab /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
