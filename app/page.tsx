"use client";
import React, { useState, useMemo } from 'react';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, Edit3, X,
  BarChart3, PieChart, Table, Play, Save, FileText, CheckCircle2, 
  Layout, Search, Filter, FolderTree
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

// --- 常量与类型定义 ---
const COLORS = ['#2563eb', '#f97316', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];
const PRICE_RANGES = ["0-100", "100-200", "200-300", "300-500", "500-1000", "1000-2000", "2000-3000", "3000-5000", "5000-10000", "10000以上"];

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

export default function MarketIntelligenceApp() {
  // --- 状态管理 ---
  const [view, setView] = useState<'home' | 'detail' | 'input' | 'dataManage'>('home');
  const [activeTab, setActiveTab] = useState('市场大盘');
  const [inputText, setInputText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2024-06');
  const [selectedPrice, setSelectedPrice] = useState('200-300');
  
  // 核心数据存储
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState([{id: '1', name: '一体式音箱', note: '包含RGB灯效'}, {id: '2', name: '2.1音箱', note: '带低音炮'}]);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // --- 逻辑处理 ---
  const handleParse = () => {
    const lines = inputText.trim().split('\n');
    const priceMid = getPriceMidPoint(selectedPrice);
    const results = lines.map((line, index) => {
      const cells = line.split(/\s+/);
      if (cells.length < 5) return null;
      const title = cells[1] || '未知商品';
      const buyers = parseRangeValue(cells[4]);
      const visitors = parseRangeValue(cells[5]);
      return {
        id: Math.random().toString(36).substr(2, 9),
        title,
        brand: title.split(' ')[0] || '未知',
        model: title.split(' ').slice(1,3).join(' ') || '默认型号',
        buyers,
        visitors,
        sales: buyers * priceMid,
        conversion: visitors > 0 ? (buyers / visitors * 100).toFixed(2) + '%' : '0%',
        month: selectedMonth,
        priceRange: selectedPrice,
        category: subCategories[0]?.name || '未分类'
      };
    }).filter(Boolean);
    setParsedData([...parsedData, ...results]);
    setView('detail');
  };

  // --- 子组件: 首页 ---
  const HomeView = () => (
    <div className="p-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">汉桑市场数据分析平台</h1>
          <p className="text-slate-500 mt-3 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 系统运行正常 / HANSANG INTERNAL
          </p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-2xl">
          <Plus size={20} /> 新建市场项目
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['电竞类电脑多媒体音箱', '黑胶唱片机', 'AI智能耳机'].map((item) => (
          <div key={item} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all group">
            <h3 className="font-bold text-2xl text-slate-800 mb-12 group-hover:text-blue-600 transition-colors">{item}</h3>
            <div className="flex gap-3">
              <button onClick={() => setView('detail')} className="flex-[3] bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg">查看分析报告</button>
              <button onClick={() => setView('input')} className="flex-[2] bg-slate-50 text-slate-600 py-4 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all">录入数据</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- 子组件: 录入页 ---
  const InputView = () => (
    <div className="p-8 max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setView('home')} className="p-3 bg-white border rounded-2xl shadow-sm"><ChevronLeft size={20}/></button>
        <h2 className="text-2xl font-black">数据录入引擎</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">录入设置</label>
            <div className="space-y-4">
              <input type="month" value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-blue-500/20" />
              <select value={selectedPrice} onChange={(e)=>setSelectedPrice(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-blue-500/20">
                {PRICE_RANGES.map(r => <option key={r} value={r}>{r} 元</option>)}
              </select>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm text-center">
            <textarea value={inputText} onChange={(e)=>setInputText(e.target.value)} placeholder="在此粘贴生意参谋数据..." className="w-full h-64 bg-slate-50 border-none rounded-xl p-4 text-[12px] font-mono mb-6 resize-none outline-none focus:ring-2 ring-blue-500/20" />
            <button onClick={handleParse} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100">
              <Play size={18} fill="currentColor"/> 开始解析并跳转
            </button>
          </div>
        </div>
        <div className="lg:col-span-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400">
          <FileText size={48} className="mb-4 opacity-10" />
          <p className="text-sm font-bold">等待原始数据输入</p>
        </div>
      </div>
    </div>
  );

  // --- 子组件: 详情页 ---
  const DetailView = () => {
    const stats = useMemo(() => {
      const total = parsedData.reduce((s, i) => s + i.sales, 0);
      const buyers = parsedData.reduce((s, i) => s + i.buyers, 0);
      return { total, buyers };
    }, [parsedData]);

    return (
      <div className="min-h-screen bg-[#FDFDFD] animate-in fade-in duration-500">
        {/* 顶部导航 */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2.5 hover:bg-slate-100 rounded-xl transition"><ChevronLeft /></button>
            <h2 className="text-xl font-black text-slate-900">电竞类电脑多媒体音箱</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView('input')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition">录入数据</button>
            <button onClick={() => setView('dataManage')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition">数据管理</button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition">项目管理</button>
          </div>
        </header>

        {/* 标签页切换 */}
        <div className="bg-white border-b px-8 flex gap-10">
          {['市场大盘', '竞争分析', '细分品类', '汇总统计', '管理'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-5 text-sm font-black transition-all border-b-4 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-300 hover:text-slate-500'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <main className="p-10 max-w-[1600px] mx-auto">
          {activeTab === '市场大盘' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl">
                <p className="text-blue-100 text-xs font-bold uppercase mb-4 tracking-widest">预估总销售额</p>
                <h3 className="text-5xl font-black mb-10">¥{stats.total.toLocaleString()}</h3>
                <div className="flex justify-between border-t border-white/10 pt-8">
                  <div><p className="text-blue-200 text-[10px] font-bold">总购买人数</p><p className="text-xl font-bold">{stats.buyers.toLocaleString()}</p></div>
                  <div><p className="text-blue-200 text-[10px] font-bold">活跃品类</p><p className="text-xl font-bold">{subCategories.length}</p></div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2"><BarChart3 size={20}/> 销售趋势图</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parsedData.slice(0,8)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="brand" />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#2563eb" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === '竞争分析' && (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-10">竞争品牌势力图</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePie>
                      <Pie data={parsedData.slice(0,5)} dataKey="sales" nameKey="brand" innerRadius={80} outerRadius={110} paddingAngle={5}>
                        {parsedData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePie>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {parsedData.slice(0,5).map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="font-bold">{item.brand}</span>
                      <span className="font-mono text-blue-600 font-bold">¥{item.sales.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === '细分品类' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                <h3 className="font-bold mb-6">品类构成分析</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subCategories.map(c => ({name: c.name, val: Math.random()*100}))} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Bar dataKey="val" fill="#f97316" radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                <h3 className="font-bold mb-6">各品类销售排行榜</h3>
                <div className="space-y-4">
                  {subCategories.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b">
                      <span className="text-sm font-bold">{c.name}</span>
                      <span className="text-sm text-slate-500">占比 {70 - i*20}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === '汇总统计' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                  <tr><th className="px-8 py-5">商品型号</th><th className="px-8 py-5">品牌</th><th className="px-8 py-5 text-right">计算销售额</th><th className="px-8 py-5 text-right">转化率</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {parsedData.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-bold text-sm">{d.model}</td>
                      <td className="px-8 py-5 text-slate-500 text-xs">{d.brand}</td>
                      <td className="px-8 py-5 text-right font-black text-blue-600 font-mono">¥{d.sales.toLocaleString()}</td>
                      <td className="px-8 py-5 text-right font-bold text-green-500">{d.conversion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === '管理' && (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FolderTree size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">品类架构管理</h3>
                <p className="text-slate-400 text-sm mb-10">在这里维护您的细分品类（例如：2.1声道、RGB音箱等），以便在数据管理中进行归类分析。</p>
                <button onClick={() => setIsManageModalOpen(true)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">管理细分品类</button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  // --- 子组件: 数据管理页 ---
  const DataManageView = () => (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">
      <header className="bg-white border-b px-8 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('detail')} className="p-2.5 hover:bg-slate-100 rounded-xl transition"><ChevronLeft /></button>
          <h2 className="text-xl font-black text-slate-900">数据条目管理</h2>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="搜索商品、品牌..." className="pl-12 pr-6 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 ring-blue-500/20 outline-none w-80" />
        </div>
      </header>
      <div className="p-8 max-w-7xl mx-auto space-y-4">
        {parsedData.map((item, i) => (
          <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">{i+1}</div>
              <div>
                <h4 className="font-bold text-slate-800 line-clamp-1 w-96">{item.title}</h4>
                <div className="flex gap-4 mt-2">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{item.brand}</span>
                  <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-2 py-1 rounded-md">{item.category}</span>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{item.month}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase">预估销售额</p>
                <p className="font-black text-blue-600">¥{item.sales.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingItem(item)} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18}/></button>
                <button onClick={() => setParsedData(parsedData.filter(p => p.id !== item.id))} className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 编辑数据弹窗 */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">编辑条目数据</h3>
              <button onClick={() => setEditingItem(null)}><X/></button>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">商品品牌</label>
                <input value={editingItem.brand} onChange={(e)=>setEditingItem({...editingItem, brand: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl mt-1 text-sm font-bold border-none outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">型号/品名</label>
                <input value={editingItem.model} onChange={(e)=>setEditingItem({...editingItem, model: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl mt-1 text-sm font-bold border-none outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">细分品类归属</label>
                <select value={editingItem.category} onChange={(e)=>setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl mt-1 text-sm font-bold border-none outline-none">
                  {subCategories.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">购买次数</label>
                <input type="number" value={editingItem.buyers} onChange={(e)=>setEditingItem({...editingItem, buyers: Number(e.target.value), sales: Number(e.target.value) * getPriceMidPoint(editingItem.priceRange)})} className="w-full bg-slate-50 p-4 rounded-xl mt-1 text-sm font-bold border-none outline-none" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setEditingItem(null)} className="flex-1 py-4 bg-slate-100 font-bold rounded-2xl">取消</button>
              <button onClick={() => {
                setParsedData(parsedData.map(p => p.id === editingItem.id ? editingItem : p));
                setEditingItem(null);
              }} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100">保存修改</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- 子组件: 细分品类管理弹窗 ---
  const SubCategoryModal = () => {
    const [newCat, setNewCat] = useState({ name: '', note: '' });
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl animate-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black">细分品类维护</h3>
            <button onClick={() => setIsManageModalOpen(false)}><X/></button>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-[2rem] mb-10">
            <h4 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">新增品类</h4>
            <div className="flex gap-4">
              <input value={newCat.name} onChange={(e)=>setNewCat({...newCat, name: e.target.value})} placeholder="名称 (如: RGB音箱)" className="flex-1 bg-white p-4 rounded-xl text-sm font-bold border-none outline-none" />
              <input value={newCat.note} onChange={(e)=>setNewCat({...newCat, note: e.target.value})} placeholder="备注" className="flex-1 bg-white p-4 rounded-xl text-sm font-bold border-none outline-none" />
              <button onClick={() => {
                if(newCat.name){
                  setSubCategories([...subCategories, {id: Date.now().toString(), ...newCat}]);
                  setNewCat({name:'', note:''});
                }
              }} className="bg-blue-600 text-white px-8 rounded-xl font-bold hover:bg-blue-700">添加</button>
            </div>
          </div>

          <div className="space-y-4 max-h-80 overflow-auto pr-2">
            {subCategories.map((c) => (
              <div key={c.id} className="flex justify-between items-center p-6 bg-white border-2 border-slate-50 rounded-[1.5rem] hover:border-blue-100 transition-all">
                <div>
                  <h5 className="font-black text-slate-800">{c.name}</h5>
                  <p className="text-xs text-slate-400 font-medium">{c.note}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSubCategories(subCategories.filter(x => x.id !== c.id))} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen text-slate-900 bg-[#F8FAFC]">
      {view === 'home' && <HomeView />}
      {view === 'input' && <InputView />}
      {view === 'detail' && <DetailView />}
      {view === 'dataManage' && <DataManageView />}
      {isManageModalOpen && <SubCategoryModal />}
    </main>
  );
}