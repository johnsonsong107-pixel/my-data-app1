"use client";
import React, { useState, useMemo } from 'react';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, 
  BarChart3, PieChart, Table, Play, Save, Package, Search, FileText
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend 
} from 'recharts';

// --- 常量配置 ---
const COLORS = ['#2563eb', '#f97316', '#10b981', '#ef4444', '#8b5cf6'];
const MOCK_MONTHS = ['2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11'];
const PRICE_RANGES = [
  "0-100", "100-200", "200-300", "300-500", "500-1000", 
  "1000-2000", "2000-3000", "3000-5000", "5000-10000", "10000以上"
];

export default function MarketApp() {
  const [view, setView] = useState<'home' | 'detail' | 'input'>('home');
  const [activeTab, setActiveTab] = useState('市场大盘');
  const [inputText, setInputText] = useState('');
  
  // 新增：录入信息状态
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  // 1. 首页：品类看板 (保持不变)
  const HomeView = () => (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">市场数据分析平台</h1>
          <p className="text-slate-500 mt-2">汉桑 (HANSANG) 内部专用系统</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          <Plus size={20} /> 新建品类
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['黑胶唱片机', 'AI耳机', '蓝牙耳机', '电竞类电脑多媒体音箱', '歌词音箱', '无线条形音箱'].map((item) => (
          <div key={item} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-10">
              <h3 className="font-bold text-xl text-slate-800">{item}</h3>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-100">
                <Database size={12}/> DATA READY
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('detail')} className="flex-[3] bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-black transition">查看报告</button>
              <button onClick={() => setView('input')} className="flex-[2] bg-slate-100 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition">录入</button>
              <button className="p-3 border border-slate-100 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. 录入页：解析引擎 (已按要求增加录入信息标签)
  const InputView = () => (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('home')} className="p-2 border rounded-full hover:bg-white shadow-sm transition-all active:scale-95"><ChevronLeft size={20}/></button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">数据解析引擎</h2>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Category Data Entry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：配置与录入区 */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 新增：录入信息设置卡片 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">录入信息</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">数据月份</label>
                <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-blue-500/10 focus:bg-white outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">价格段</label>
                <select 
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-blue-500/10 focus:bg-white outline-none transition-all cursor-pointer"
                >
                  <option value="">请选择价格段</option>
                  {PRICE_RANGES.map(range => (
                    <option key={range} value={range}>{range} 元</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 原始数据粘贴卡片 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-slate-900 rounded-full"></div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. 粘贴生意参谋原始数据</h3>
            </div>
            <textarea 
              className="w-full h-80 border-none bg-slate-50 rounded-xl p-4 text-sm font-mono focus:ring-2 ring-blue-500/10 focus:bg-white outline-none transition-all resize-none"
              placeholder="请直接全选并粘贴生意参谋导出的表格文本内容..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-slate-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                <Play size={18} fill="currentColor"/> 解析数据
              </button>
              <button className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                <Save size={18}/> 保存至云端
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：结果预览区 */}
        <div className="lg:col-span-7">
          <div className="bg-slate-50 h-full rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-10 min-h-[500px]">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
               <Table size={40} className="opacity-20 text-slate-900"/>
            </div>
            <p className="font-bold text-slate-500 mb-2">等待数据解析</p>
            <p className="text-center text-xs leading-relaxed max-w-xs">
              在左侧设置月份、价格段并粘贴数据后点击“解析”，系统将自动生成结构化预览。
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. 详情页：(保持不变)
  const DetailView = () => (
    <div className="min-h-screen animate-in fade-in duration-500">
      <div className="bg-white/80 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-xl transition"><ChevronLeft /></button>
          <h2 className="text-xl font-black text-slate-800">电竞类电脑多媒体音箱 <span className="text-blue-600 text-sm ml-2 font-normal">2024年度分析</span></h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('input')} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition flex items-center gap-2"><Plus size={16}/> 录入</button>
          <button className="px-4 py-2 border rounded-lg text-sm font-bold hover:bg-slate-50 transition flex items-center gap-2"><Settings size={16}/> 管理</button>
        </div>
      </div>

      {/* Tabs 切换 */}
      <div className="bg-white border-b px-8 flex gap-10">
        {['市场大盘', '竞争分析', '细分品类', '汇总统计'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`py-4 text-sm font-bold transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="p-8 max-w-[1400px] mx-auto space-y-8">
        {activeTab === '市场大盘' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { label: '销售额趋势 (元)', val: '¥2.48M', growth: '+29.1%' },
              { label: '访客数趋势', val: '124,502', growth: '+34.7%' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                   <h3 className="font-bold text-slate-700">{card.label}</h3>
                   <div className="text-right">
                      <div className="text-2xl font-black text-blue-600">{card.val}</div>
                      <div className="text-xs font-bold text-green-500">同比 {card.growth}</div>
                   </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_MONTHS.map(m => ({ name: m, value: Math.random() * 1000 }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                      <YAxis hide />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}} />
                      <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 其他 Tab 内容省略以保持精简，逻辑已在先前版本定义 */}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen text-slate-900 bg-[#F9FAFB]">
      {view === 'home' && <HomeView />}
      {view === 'input' && <InputView />}
      {view === 'detail' && <DetailView />}
    </main>
  );
}