import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from '@phosphor-icons/react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

export default function ProofsPage() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/proofs?limit=50`).then(r => setProofs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FFE800] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12" data-testid="proofs-page">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="mb-12">
          <span className="rift-badge rounded-sm inline-block mb-4">Proof of Delivery</span>
          <h1 className="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] tracking-tight">Delivery Proofs</h1>
          <p className="text-sm text-[#A3A3A3] mt-2 max-w-2xl">Every order is photographed and logged. See our track record of successful deliveries below.</p>
        </div>

        {proofs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#737373] text-lg mb-2">No proofs uploaded yet</p>
            <p className="text-[#A3A3A3] text-sm">Delivery proofs will appear here as orders are completed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofs.map((proof, i) => (
              <motion.div key={proof.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.05}
                className="rift-card rounded-sm overflow-hidden group" data-testid={`proof-card-${proof.id}`}>
                <div className="relative aspect-[4/3] bg-[#1A1A1A] overflow-hidden">
                  <img src={proof.image_url} alt={proof.product_name || 'Delivery proof'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-sm bg-[#39FF14] text-[#050505] text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle size={12} weight="fill" /> Delivered
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#F5F5F5]">{proof.product_name || 'Item Delivered'}</p>
                    {proof.price > 0 && <p className="text-sm font-bold text-[#FFE800]">${proof.price.toFixed(2)}</p>}
                  </div>
                  <div className="flex items-center gap-1 text-[#737373] text-xs">
                    <Clock size={12} />
                    {proof.created_at ? new Date(proof.created_at).toLocaleDateString() : ''}
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
