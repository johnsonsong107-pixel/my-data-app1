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

// --- 【1. 自动配置的云端连接】 ---
const supabaseUrl = 'https://cwjpyqyknllirbydahxl.supabase.co';
const supabaseKey = 'sb_secret_ifUnQwUmABOku2N9ShmgTQ_9ar2HBJ3';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 【2. 工具函数：解析生意参谋数据】 ---
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
  // --- 状态管理 ---
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

  // --- 【3. 云端同步核心逻辑】 ---
  useEffect(() => {
    fetchCloudData();
  }, []);

  const fetchCloudData = async () => {
    setLoading(true);
    try {
      const { data: cats } = await supabase.from('categories').select('*').order('id', { ascending: false });
      if (cats) setSubCategories(cats);
      const { data: markets } = await supabase.from('market_data').select('*').order('id', { ascending: false });
      if (markets) setParsedData(markets);
    } catch (e) {
      console.error("加载云端数据失败", e);
    }
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

  const handleParseAndUpload = async () => {
    if (!inputText.trim()) return;
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
        category: subCategories[0]?.name || '默认品类'
      };
    }).filter(Boolean);

    if (results.length > 0) {
      const { data, error } = await supabase.from('market_data').insert(results).select();
      if (!error && data) {
        setParsedData([...data, ...parsedData]);
        alert(`同步成功！已上传 ${data.length} 条数据到云端。`);
        setView('detail');
      } else {
        alert("上传失败，请检查 Supabase 表名是否正确");
      }
    }
  };

  // --- 【4. 视图组件渲染】 ---

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-bold text-slate-400">
      <div className="animate-pulse">正在同步汉桑云端数据库...</div>
    </div>
  );

  // --- 首页项目选择 ---
  const HomeView = () => (
    <div className="p-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">汉桑市场数据分析平台</h1>
          <p className="text-slate-500 mt-3 font-medium">HANSANG CLOUD / 多人协作云端版</p>
        </div>
        <button onClick={() => setView('input')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2">
          <Plus size={20} /> 录入新数据
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['电脑多媒体音箱', '黑胶唱片机', 'AI智能耳机'].map((item) => (
          <div key={item} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl mb-8 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
              <Database size={28} />
            </div>
            <h3 className="font-bold text-2xl text-slate-800 mb-12">{item}</h3>
            <div className="flex gap-3">
              <button onClick={() => setView('detail')} className="flex-[3] bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-black">查看分析</button>
              <button onClick={() => setView('input')} className="flex-[2] bg-slate-50 text-slate-600 py-4 rounded-2xl text-sm font-bold hover:bg-slate-200">录入</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- 录入引擎 ---
  const InputView = () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setView('home')} className="p-3 bg-white border rounded-2xl shadow-sm hover:bg-slate-50 transition"><ChevronLeft size={20}/></button>
        <h2 className="text-2xl font-black">数据录入引擎</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">录入配置</label>
            <input type="month" value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm mb-4 outline-none" />
            <select value={selectedPrice} onChange={(e)=>setSelectedPrice(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm outline-none">
              {PRICE_RANGES.map(r => <option key={r} value={r}>{r} 元</option>)}
            </select>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <textarea value={inputText} onChange={(e)=>setInputText(e.target.value)} placeholder="粘贴生意参谋原始数据..." className="w-full h-64 bg-slate-50 border-none rounded-xl p-4 text-[12px] font-mono mb-6 resize-none outline-none focus:ring-2 ring-blue-500/10" />
            <button onClick={handleParseAndUpload} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100">
              <Play size={18} fill="currentColor"/> 解析并同步云端
            </button>
          </div>
        </div>
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 p-20">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <FileText size={32} />
          </div>
          <p className="font-bold text-slate-900">等待录入原始数据</p>
          <p className="text-sm mt-2">支持生意参谋多行复制，解析后全员同步</p>
        </div>
      </div>
    </div>
  );

  // --- 详情可视化看板 ---
  const DetailView = () => {
    const totalSales = useMemo(() => parsedData.reduce((s, i) => s + (i.sales || 0), 0), [parsedData]);
    
    return (
      <div className="min-h-screen bg-white">
        <header className="px-8 py-6 border-b flex justify-between items-center sticky top-0 bg-white z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2.5 hover:bg-slate-100 rounded-xl transition"><ChevronLeft /></button>
            <h2 className="text-xl font-black">市场情报详情看板</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView('input')} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-50 transition">录入数据</button>
            <button onClick={() => setView('dataManage')} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition">数据管理</button>
          </div>
        </header>

        <div className="flex px-8 border-b bg-slate-50/50">
          {['市场大盘', '竞争分析', '云端管理'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`py-5 px-6 font-bold text-sm transition-all border-b-4 ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>

        <main className="p-8 max-w-[1400px] mx-auto">
          {activeTab === '市场大盘' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">月度总预估销售额</p>
                  <h3 className="text-5xl font-black italic tracking-tighter">¥{totalSales.toLocaleString()}</h3>
                </div>
                <div className="mt-12 flex items-center gap-2 text-green-400 text-xs font-bold">
                  <CheckCircle2 size={14}/> 云端数据同步正常
                </div>
              </div>
              <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2"><BarChart3 size={20} className="text-blue-600"/> 品牌销量 TOP 排行榜</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parsedData.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="brand" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="sales" fill="#2563eb" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === '云端管理' && (
            <div className="max-w-4xl mx-auto py-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black italic">云端细分品类维护</h3>
                <button onClick={() => setIsAddingNewCat(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-50">添加新分类</button>
              </div>
              
              {isAddingNewCat && (
                <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-8 border-2 border-dashed border-slate-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input value={newCat.name} onChange={(e)=>setNewCat({...newCat, name: e.target.value})} placeholder="输入品类名" className="p-4 rounded-xl border-none shadow-sm outline-none font-bold" />
                    <input value={newCat.note} onChange={(e)=>setNewCat({...newCat, note: e.target.value})} placeholder="输入备注" className="p-4 rounded-xl border-none shadow-sm outline-none font-bold" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setIsAddingNewCat(false)} className="px-6 py-3 text-slate-400 font-bold">取消</button>
                    <button onClick={handleAddCategory} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">保存并同步</button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {subCategories.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300"><FolderTree size={20}/></div>
                      <div><span className="font-black text-slate-800 text-lg">{c.name}</span><p className="text-xs text-slate-400 font-medium">{c.note || '云端同步品类'}</p></div>
                    </div>
                    <button onClick={async () => {
                      await supabase.from('categories').delete().eq('id', c.id);
                      setSubCategories(subCategories.filter(x => x.id !== c.id));
                    }} className="p-3 text-slate-200 hover:text-red-600 transition-colors"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  // --- 数据管理页 ---
  const DataManageView = () => (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-8 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('detail')} className="p-2.5 hover:bg-slate-100 rounded-xl transition"><ChevronLeft /></button>
          <h2 className="text-xl font-black">管理原始同步数据</h2>
        </div>
      </header>
      <div className="p-8 max-w-7xl mx-auto space-y-4">
        {parsedData.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
            <div>
              <h4 className="font-bold text-slate-800">{item.title}</h4>
              <p className="text-xs text-slate-400 mt-1">品牌: {item.brand} | 销售额: ¥{item.sales?.toLocaleString()} | 月份: {item.month}</p>
            </div>
            <button onClick={async () => {
              await supabase.from('market_data').delete().eq('id', item.id);
              setParsedData(parsedData.filter(p => p.id !== item.id));
            }} className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen text-slate-900 bg-[#F8FAFC]">
      {view === 'home' && <HomeView />}
      {view === 'input' && <InputView />}
      {view === 'detail' && <DetailView />}
      {view === 'dataManage' && <DataManageView />}
    </main>
  );
}