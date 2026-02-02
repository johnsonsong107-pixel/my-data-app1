"use client";
import React, { useState, useMemo } from 'react';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, Edit3, X,
  BarChart3, PieChart, Table, Play, Save, FileText, CheckCircle2, 
  Layout, Search, Filter, FolderTree, AlertCircle, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend
} from 'recharts';

// --- 常量与类型定义 ---
const COLORS = ['#2563eb', '#f97316', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];
const PRICE_RANGES = ["0-100", "100-200", "200-300", "300-500", "500-1000", "1000-2000", "2000-3000", "3000-5000", "5000-10000", "10000以上"];

// --- 核心工具函数 ---
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
  
  // 数据集
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState([
    {id: '1', name: '一体式音箱', note: '包含所有带RGB灯效的一体化电脑音箱', createTime: '2024-05-20'},
    {id: '2', name: '2.1有源音箱', note: '独立低音炮组合形式', createTime: '2024-05-21'}
  ]);
  
  // 交互状态
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [duplicateCount, setDuplicateCount] = useState(0);

  // --- 逻辑处理：解析与查重 ---
  const handleParse = () => {
    const lines = inputText.trim().split('\n');
    const priceMid = getPriceMidPoint(selectedPrice);
    
    // 生成已存在的唯一标识集合 (标题+月份+价格段)
    const existingKeys = new Set(parsedData.map(d => `${d.title}-${d.month}-${d.priceRange}`));
    
    let skipCount = 0;
    const newResults: any[] = [];

    lines.forEach((line, index) => {
      const cells = line.split(/\s+/);
      if (cells.length < 5) return;
      
      const title = cells[1] || '未知商品';
      const key = `${title}-${selectedMonth}-${selectedPrice}`;

      // 查重逻辑
      if (existingKeys.has(key)) {
        skipCount++;
        return;
      }

      const buyers = parseRangeValue(cells[4]);
      const visitors = parseRangeValue(cells[5]);
      
      newResults.push({
        id: Math.random().toString(36).substr(2, 9),
        title,
        brand: title.split(/[\s|/]/)[0] || '未知',
        model: title.split(/[\s|/]/).slice(1,3).join(' ') || '默认型号',
        buyers,
        visitors,
        sales: buyers * priceMid,
        conversion: visitors > 0 ? (buyers / visitors * 100).toFixed(2) + '%' : '0%',
        month: selectedMonth,
        priceRange: selectedPrice,
        category: subCategories[0]?.name || '未分类'
      });
    });

    setDuplicateCount(skipCount);
    setParsedData(prev => [...prev, ...newResults]);
    if (newResults.length > 0) setView('detail');
    else if (skipCount > 0) alert(`未录入新数据：发现 ${skipCount} 条完全重复的数据已自动跳过。`);
  };

  // --- 子组件：首页 ---
  const HomeView = () => (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-4xl font-black text-slate-900">汉桑市场数据平台</h1>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">Market Intelligence System</p>
        </div>
        <button onClick={() => setView('input')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-2xl shadow-blue-100 transition-all">
          <Plus size={20} /> 录入新数据
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['电竞类电脑多媒体音箱', '黑胶唱片机', 'AI智能耳机'].map((item) => (
          <div key={item} className="bg-white border-2 border-slate-50 p-10 rounded-[3rem] shadow-sm hover:border-blue-200 transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl mb-8 flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
              <Database size={24} />
            </div>
            <h3 className="font-bold text-2xl text-slate-800 mb-12">{item}</h3>
            <div className="flex gap-3">
              <button onClick={() => setView('detail')} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold">详情报告</button>
              <button onClick={() => setView('input')} className="p-4 bg-slate-50 text-slate-400 rounded-2xl"><Plus size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- 子组件：录入页 ---
  const InputView = () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setView('home')} className="p-3 bg-white border rounded-2xl shadow-sm"><ChevronLeft size={20}/></button>
        <h2 className="text-2xl font-black">数据录入中心</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Info size={18}/>
              <span className="text-xs font-black uppercase tracking-widest">录入设置 (自动去重开启)</span>
            </div>
            <div className="space-y-4">
              <input type="month" value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" />
              <select value={selectedPrice} onChange={(e)=>setSelectedPrice(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold">
                {PRICE_RANGES.map(r => <option key={r} value={r}>{r} 元</option>)}
              </select>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <textarea value={inputText} onChange={(e)=>setInputText(e.target.value)} placeholder="在此粘贴文本..." className="w-full h-64 bg-slate-50 border-none rounded-2xl p-4 text-[12px] font-mono mb-6 resize-none outline-none" />
            <button onClick={handleParse} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
              <Play size={18} fill="currentColor"/> 执行解析并去重
            </button>
          </div>
        </div>
        <div className="lg:col-span-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300">
          <AlertCircle size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-bold">系统会自动识别已录入的商品</p>
          <p className="text-xs mt-2">基于：标题 + 月份 + 价格段</p>
        </div>
      </div>
    </div>
  );

  // --- 子组件：详情分析页 ---
  const DetailView = () => {
    return (
      <div className="min-h-screen bg-[#FDFDFD]">
        <header className="bg-white/80 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2.5 hover:bg-slate-100 rounded-xl transition"><ChevronLeft /></button>
            <h2 className="text-xl font-black text-slate-900">电竞类电脑多媒体音箱</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('input')} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold">录入数据</button>
            <button onClick={() => setView('dataManage')} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold">数据管理</button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">项目管理</button>
          </div>
        </header>

        <div className="bg-white border-b px-8 flex gap-10">
          {['市场大盘', '竞争分析', '细分品类', '汇总统计', '管理'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-5 text-sm font-black transition-all border-b-4 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>

        <main className="p-10 max-w-[1400px] mx-auto">
          {activeTab === '市场大盘' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-blue-600 p-10 rounded-[3rem] text-white">
                <p className="text-blue-100 text-xs font-black uppercase mb-4 tracking-widest">本期预估销额</p>
                <h3 className="text-5xl font-black mb-12">¥{parsedData.reduce((s,i)=>s+i.sales,0).toLocaleString()}</h3>
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
                  <div><p className="text-blue-200 text-[10px] font-bold uppercase">有效条目</p><p className="text-xl font-bold">{parsedData.length}</p></div>
                  <div><p className="text-blue-200 text-[10px] font-bold uppercase">自动去重数</p><p className="text-xl font-bold">{duplicateCount}</p></div>
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                <h3 className="font-bold mb-8 flex items-center gap-2"><BarChart3 size={20}/> Top 品牌分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parsedData.slice(0,5)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="brand" />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#2563eb" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === '管理' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-12 rounded-[3.5rem] border text-center shadow-xl shadow-slate-100">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <FolderTree size={40} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">品类架构中心</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-12 font-medium">维护项目的细分品类体系。在此定义的品类将直接用于商品打标与汇总统计。</p>
                <button onClick={() => setIsManageModalOpen(true)} className="bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black text-sm hover:scale-105 transition-transform">
                  管理细分品类
                </button>
              </div>
            </div>
          )}

          {activeTab === '汇总统计' && (
            <div className="bg-white rounded-[3rem] border overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                    <tr><th className="px-8 py-6">品牌</th><th className="px-8 py-6">型号/名称</th><th className="px-8 py-6 text-right">预估销售额</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {parsedData.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-8 py-6 font-black text-blue-600">{d.brand}</td>
                        <td className="px-8 py-6 font-bold text-slate-700 text-sm">{d.model}</td>
                        <td className="px-8 py-6 text-right font-black font-mono">¥{d.sales.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </main>
      </div>
    );
  };

  // --- 子组件：品类管理弹窗 (完整功能架构) ---
  const SubCategoryModal = () => {
    const [newCat, setNewCat] = useState({ name: '', note: '' });
    const [isAdding, setIsAdding] = useState(false);

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-4xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-black text-slate-900">细分品类管理</h3>
              <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Category Architecture Manager</p>
            </div>
            <button onClick={() => setIsManageModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"><X/></button>
          </div>

          <div className="flex-1 overflow-auto pr-4 custom-scrollbar">
            {/* 添加表单 */}
            {!isAdding ? (
              <button onClick={()=>setIsAdding(true)} className="w-full border-2 border-dashed border-slate-200 p-6 rounded-[2rem] flex items-center justify-center gap-2 text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 transition-all mb-8">
                <Plus size={20}/> 新增细分品类
              </button>
            ) : (
              <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-8 border-2 border-blue-100 animate-in slide-in-from-top-4">
                <h4 className="text-xs font-black text-blue-600 uppercase mb-6 tracking-widest flex items-center gap-2">
                  <Edit3 size={14}/> 录入品类信息
                </h4>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block">品类名称</label>
                    <input autoFocus value={newCat.name} onChange={(e)=>setNewCat({...newCat, name: e.target.value})} placeholder="例如：2.1声道音箱" className="w-full bg-white p-4 rounded-xl text-sm font-bold border-none shadow-sm focus:ring-2 ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block">备注信息</label>
                    <input value={newCat.note} onChange={(e)=>setNewCat({...newCat, note: e.target.value})} placeholder="输入品类定义的备注..." className="w-full bg-white p-4 rounded-xl text-sm font-bold border-none shadow-sm focus:ring-2 ring-blue-500" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={()=>{setIsAdding(false); setNewCat({name:'', note:''})}} className="px-6 py-3 font-bold text-slate-400">取消</button>
                  <button onClick={() => {
                    if(newCat.name){
                      setSubCategories([{id: Date.now().toString(), ...newCat, createTime: new Date().toISOString().split('T')[0]}, ...subCategories]);
                      setNewCat({name:'', note:''});
                      setIsAdding(false);
                    }
                  }} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100">确认添加</button>
                </div>
              </div>
            )}

            {/* 列表架构 */}
            <div className="space-y-4">
              {subCategories.map((c) => (
                <div key={c.id} className="group flex justify-between items-center p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-slate-100 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-black group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800 text-lg">{c.name}</h5>
                      <p className="text-xs text-slate-400 font-medium mt-1">{c.note || '暂无备注'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-300 uppercase">创建日期</p>
                      <p className="text-xs font-bold text-slate-500">{c.createTime}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSubCategories(subCategories.filter(x => x.id !== c.id))} className="p-4 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 子组件：数据管理 (编辑功能) ---
  const DataManageView = () => (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-8 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('detail')} className="p-2.5 hover:bg-slate-100 rounded-xl transition"><ChevronLeft /></button>
          <h2 className="text-xl font-black text-slate-900">数据条目档案</h2>
        </div>
      </header>
      <div className="p-8 max-w-6xl mx-auto space-y-4">
        {parsedData.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[2rem] flex justify-between items-center border border-slate-100 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
              <div>
                <h4 className="font-bold text-slate-800 line-clamp-1 w-80">{item.title}</h4>
                <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">
                  {item.month} | {item.priceRange} 元 | {item.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right font-mono font-black text-blue-600">¥{item.sales.toLocaleString()}</div>
              <button onClick={() => setEditingItem(item)} className="p-3 bg-slate-50 rounded-xl"><Edit3 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 编辑弹窗 */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10">
             <h3 className="text-2xl font-black mb-8">编辑数据</h3>
             <div className="space-y-6 mb-10">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">所属品类</label>
                  <select value={editingItem.category} onChange={(e)=>setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none font-bold mt-2">
                    {subCategories.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">品牌名称</label>
                  <input value={editingItem.brand} onChange={(e)=>setEditingItem({...editingItem, brand: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none font-bold mt-2" />
                </div>
             </div>
             <div className="flex gap-3">
               <button onClick={()=>setEditingItem(null)} className="flex-1 py-4 font-bold text-slate-400">取消</button>
               <button onClick={()=>{
                 setParsedData(parsedData.map(p => p.id === editingItem.id ? editingItem : p));
                 setEditingItem(null);
               }} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200">完成修改</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );

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