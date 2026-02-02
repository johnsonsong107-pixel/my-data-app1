"use client";
import React, { useState, useMemo } from 'react';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, 
  BarChart3, PieChart, Table, Play, Save, Package, Search
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend 
} from 'recharts';

// --- 常量配置 ---
const COLORS = ['#2563eb', '#f97316', '#10b981', '#ef4444', '#8b5cf6'];
const MOCK_MONTHS = ['2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11'];

export default function MarketApp() {
  const [view, setView] = useState<'home' | 'detail' | 'input'>('home');
  const [activeTab, setActiveTab] = useState('市场大盘');
  const [inputText, setInputText] = useState('');

  // 1. 首页：品类看板
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

  // 2. 录入页：解析生意参谋原始数据 (对应图片2)
  const InputView = () => (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('home')} className="p-2 border rounded-full hover:bg-white shadow-sm"><ChevronLeft size={20}/></button>
        <h2 className="text-2xl font-bold">数据解析引擎</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold mb-4 text-slate-700">1. 粘贴生意参谋原始数据</label>
            <textarea 
              className="w-full h-72 border-none bg-slate-50 rounded-xl p-4 text-sm font-mono focus:ring-2 ring-blue-500 outline-none"
              placeholder="请直接全选并粘贴生意参谋导出的表格文本内容..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-700 transition">
                <Play size={18}/> 立即解析数据
              </button>
              <button className="flex-1 bg-slate-100 text-slate-400 py-3.5 rounded-xl font-bold cursor-not-allowed">
                <Save size={18}/> 保存至云端
              </button>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-10">
          <Table size={48} className="mb-4 opacity-20"/>
          <p className="text-center text-sm leading-relaxed">解析后的数据预览将在此显示<br/>支持自动识别：销售额、购买人数、客单价等</p>
        </div>
      </div>
    </div>
  );

  // 3. 详情页：多维度分析 (对应图片3-13)
  const DetailView = () => (
    <div className="min-h-screen">
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

        {activeTab === '细分品类' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
              <h3 className="font-bold mb-8 text-slate-700 flex items-center gap-2"><PieChart size={18}/> 销量占比分析</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePie>
                    <Pie data={[{n:'一体式', v:65}, {n:'分体式', v:35}]} dataKey="v" innerRadius={70} outerRadius={90} paddingAngle={8}>
                      <Cell fill="#2563eb" stroke="none" />
                      <Cell fill="#f97316" stroke="none" />
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" />
                  </RePie>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <h3 className="font-bold mb-6 text-slate-700 flex items-center gap-2"><Table size={18}/> 细分性能排行</h3>
               <table className="w-full text-sm">
                 <thead>
                   <tr className="text-slate-400 border-b"><th className="pb-3 text-left">品类名称</th><th className="pb-3 text-right">销售额占比</th><th className="pb-3 text-right">增长率</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   <tr><td className="py-4 font-bold">一体式 RGB 音箱</td><td className="py-4 text-right">64.2%</td><td className="py-4 text-right text-green-500">+12%</td></tr>
                   <tr><td className="py-4 font-bold">2.1声道 分体音箱</td><td className="py-4 text-right">35.8%</td><td className="py-4 text-right text-red-400">-4%</td></tr>
                 </tbody>
               </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen text-slate-900">
      {view === 'home' && <HomeView />}
      {view === 'input' && <InputView />}
      {view === 'detail' && <DetailView />}
    </main>
  );
}