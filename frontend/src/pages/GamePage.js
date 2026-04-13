import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, MagnifyingGlass } from '@phosphor-icons/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' } }),
};

export default function GamePage() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/games/${slug}`),
      axios.get(`${API}/products?game_slug=${slug}`),
    ]).then(([gameRes, productsRes]) => {
      setGame(gameRes.data);
      setProducts(productsRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFE800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <p className="text-[#737373] text-lg">Game not found</p>
        <Link to="/" className="text-[#FFE800] text-sm hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="game-page">
      {/* Game Header */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        {game.image_url ? (
          <img src={game.image_url} alt={game.name} className="w-full h-full object-cover opacity-40" />
        ) : (
          <div className="w-full h-full bg-[#111111]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 pb-6">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-[#A3A3A3] hover:text-[#FFE800] transition-colors mb-3" data-testid="back-to-home">
            <ArrowLeft size={14} /> Back to Games
          </Link>
          <h1 className="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] tracking-tight" data-testid="game-title">
            {game.name}
          </h1>
          {game.description && (
            <p className="text-sm text-[#A3A3A3] mt-2 max-w-2xl">{game.description}</p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
        {/* Search */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-[#111111] border-[#262626] text-[#F5F5F5] focus:ring-[#FFE800] focus:border-[#FFE800] rounded-sm"
              data-testid="product-search"
            />
          </div>
          <span className="text-sm text-[#737373]">{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#737373] text-lg mb-2">No products found</p>
            <p className="text-[#A3A3A3] text-sm">{products.length === 0 ? 'Products will appear here once the admin adds them.' : 'Try a different search term.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.03}
                className="rift-card rounded-sm overflow-hidden group"
                data-testid={`product-card-${product.id}`}
              >
                <div className="aspect-square bg-[#1A1A1A] relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#737373] text-xs">No Image</div>
                  )}
                  {product.stock !== -1 && product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 text-[10px] px-2 py-1 bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/30 rounded-sm font-bold uppercase tracking-wider">
                      {product.stock} left
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-[#F5F5F5] mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-[#737373] mb-2 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#FFE800]">${product.price.toFixed(2)}</span>
                      {product.original_price > product.price && (
                        <span className="text-xs text-[#737373] line-through">${product.original_price.toFixed(2)}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addItem(product)}
                      className="rift-btn-primary rounded-sm h-8 px-3 text-xs font-bold"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <ShoppingCart size={14} className="mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
