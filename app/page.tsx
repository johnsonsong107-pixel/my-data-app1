"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, Edit3, X,
  BarChart3, PieChart, Table, Play, Save, FileText, CheckCircle2, 
  Layout, Search, Filter, FolderTree, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend
} from 'recharts';

// --- 【重要】请在此处填入你的信息 ---
const supabaseUrl = 'https://cwjpyqyknllirbydahxl.supabase.co';
const supabaseKey = 'sb_secret_ifUnQwUmABOku2N9ShmgTQ_9ar2HBJ3';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 工具函数 ---
const parseRangeValue = (text: string): number => {
  if (!text) return 0;
  const cleanText = text.replace(/,/g, '');
  const numbers = cleanText.match(/\d+(\.\d+)?/g)?.map(n => {
    let val = parseFloat(n);
    if (cleanText.includes(n + '万')) val *= 10000;
    return val;
  }) || [0];
  return numbers.length === 2 ? (numbers[0] + numbers[1]) / 2 : numbers[0];
};

const getPriceMidPoint = (range: string): number => {
  const nums = range.match(/\d+/g)?.map(Number) || [0];
  if (range.includes('以上')) return nums[0];
  return nums.length === 2 ? (nums[0] + nums[1]) / 2 : nums[0];
};

const COLORS = ['#2563eb', '#f97316', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];
const PRICE_RANGES = ["0-100", "100-200", "200-300", "300-500", "500-1000", "1000-2000", "2000-3000", "3000-5000", "5000-10000", "10000以上"];

export default function MarketIntelligenceApp() {
  const [view, setView] = useState<'home' | 'detail' | 'input' | 'dataManage'>('home');
  const [activeTab, setActiveTab] = useState('市场大盘');
  const [inputText, setInputText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2024-06');
  const [selectedPrice, setSelectedPrice] = useState('200-300');
  
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', note: '' });

  // --- 云端同步逻辑 ---
  useEffect(() => {
    fetchCloudData();
  }, []);

  const fetchCloudData = async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('categories').select('*').order('id', { ascending: false });
    if (cats) setSubCategories(cats);
    const { data: markets } = await supabase.from('market_data').select('*').order('id', { ascending: false });
    if (markets) setParsedData(markets);
    setLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCat.name) return;
    const { data, error } = await supabase.from('categories').insert([{ name: newCat.name, note: newCat.note }]).select();
    if (!error && data) {
      setSubCategories([data[0], ...subCategories]);
      setNewCat({ name: '', note: '' });
      setIsAddingNewCat(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) setSubCategories(subCategories.filter(c => c.id !== id));
  };

  const handleParseAndUpload = async () => {
    const lines = inputText.trim().split('\n');
    const priceMid = getPriceMidPoint(selectedPrice);
    const results = lines.map((line) => {
      const cells = line.split(/\s+/);
      if (cells.length < 5) return null;
      const title = cells[1] || '未知商品';
      const buyers = parseRangeValue(cells[4]);
      return {
        title,
        brand: title.split(' ')[0] || '未知',
        buyers,
        sales: buyers * priceMid,
        month: selectedMonth,
        category: subCategories[0]?.name || '未分类'
      };
    }).filter(Boolean);

    if (results.length > 0) {
      const { data, error } = await supabase.from('market_data').insert(results).select();
      if (!error && data) {
        setParsedData([...data, ...parsedData]);
        setView('detail');
      }
    }
  };

  // --- UI 组件 ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400">
      正在连接云端黑板...
    </div>
  );

  return (
    <main className="min-h-screen text-slate-900 bg-[#F8FAFC]">
      {/* 顶部导航 */}
      {view !== 'home' && (
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-xl transition"><ChevronLeft /></button>
            <h2 className="text-xl font-black">汉桑数据中心</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('input')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">录入数据</button>
            <button onClick={() => setView('dataManage')} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">数据管理</button>
          </div>
        </header>
      )}

      {/* 视图切换 */}
      <div className="p-8 max-w-7xl mx-auto">
        {view === 'home' && (
          <div className="py-20 text-center">
            <h1 className="text-5xl font-black mb-10">市场情报同步系统</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button onClick={() => setView('detail')} className="p-10 bg-white rounded-[2.5rem] shadow-xl hover:scale-105 transition-all">
                <BarChart3 size={40} className="mx-auto mb-4 text-blue-600" />
                <span className="font-bold">查看分析大盘</span>
              </button>
              <button onClick={() => setView('input')} className="p-10 bg-blue-600 text-white rounded-[2.5rem] shadow-xl hover:scale-105 transition-all">
                <Plus size={40} className="mx-auto mb-4" />
                <span className="font-bold">录入新数据</span>
              </button>
            </div>
          </div>
        )}

        {view === 'input' && (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border">
            <h3 className="text-2xl font-black mb-6">数据采集</h3>
            <textarea 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)}
              placeholder="请粘贴生意参谋数据内容..."
              className="w-full h-64 bg-slate-50 rounded-2xl p-4 mb-6 outline-none focus:ring-2 ring-blue-500"
            />
            <button onClick={handleParseAndUpload} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl">
              解析并存入云端
            </button>
          </div>
        )}

        {view === 'detail' && (
          <div>
             <div className="flex gap-6 mb-8 border-b">
                {['市场大盘', '管理'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`pb-4 font-bold ${activeTab === t ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-400'}`}>
                    {t}
                  </button>
                ))}
             </div>

             {activeTab === '市场大盘' && (
               <div className="bg-white p-8 rounded-[3rem] shadow-sm border h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parsedData.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="brand" />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#2563eb" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
             )}

             {activeTab === '管理' && (
               <div className="max-w-3xl mx-auto">
                 <div className="flex justify-between mb-6">
                    <h3 className="font-black text-xl">细分品类维护</h3>
                    <button onClick={() => setIsAddingNewCat(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">+ 新增</button>
                 </div>
                 {isAddingNewCat && (
                   <div className="bg-blue-50 p-6 rounded-2xl mb-6 flex gap-4">
                      <input placeholder="品类名" value={newCat.name} onChange={e=>setNewCat({...newCat, name:e.target.value})} className="flex-1 p-3 rounded-xl border-none outline-none" />
                      <button onClick={handleAddCategory} className="bg-blue-600 text-white px-6 rounded-xl font-bold">保存</button>
                   </div>
                 )}
                 <div className="space-y-3">
                    {subCategories.map(c => (
                      <div key={c.id} className="bg-white p-6 rounded-2xl border flex justify-between items-center">
                        <span className="font-bold">{c.name}</span>
                        <button onClick={() => handleDeleteCategory(c.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                      </div>
                    ))}
                 </div>
               </div>
             )}
          </div>
        )}

        {view === 'dataManage' && (
          <div className="space-y-4">
            {parsedData.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border flex justify-between items-center">
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-xs text-slate-400">品牌: {item.brand} | 销售额: ¥{item.sales.toLocaleString()}</div>
                </div>
                <button onClick={() => {
                  supabase.from('market_data').delete().eq('id', item.id).then(() => fetchCloudData());
                }} className="text-slate-300 hover:text-red-600"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}