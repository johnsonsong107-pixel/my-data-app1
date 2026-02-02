"use client";
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Database, Settings, BarChart3, Plus, 
  Search, Trash2, ChevronLeft, PieChart, Table, Save, Play, Package
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend 
} from 'recharts';

// --- 模拟数据与常量 ---
const COLORS = ['#2563eb', '#f97316', '#10b981', '#ef4444', '#8b5cf6'];
const MOCK_MONTHS = ['2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03'];

export default function MarketAnalysisPlatform() {
  // 路由与视图控制
  const [view, setView] = useState<'home' | 'detail' | 'input'>('home');
  const [activeTab, setActiveTab] = useState('市场大盘');
  const [selectedCategory, setSelectedCategory] = useState('电竞类电脑多媒体音箱');

  // --- 1. 首页组件 ---
  const HomeView = () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">汉桑市场数据分析平台</h1>
          <p className="text-slate-500 mt-2">管理和分析市场数据</p>
        </div>
        <button className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition">
          <Plus size={20} /> 新建品类
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['黑胶唱片机', 'AI耳机', '蓝牙耳机', '电竞类电脑多媒体音箱', '歌词音箱', '头戴式耳机'].map((name) => (
          <div key={name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-lg text-slate-800">{name}</h3>
              <div className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">
                <Database size={10}/> 有数据
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('detail')} className="flex-[3] bg-black text-white py-2.5 rounded-xl text-sm font-semibold transition hover:bg-slate-800">查看详情</button>
              <button onClick={() => setView('input')} className="flex-[2] border border-slate-200 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">录入数据</button>
              <button className="p-2.5 border border-slate-200 rounded-xl text-red-500 hover:bg-red-50"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- 2. 数据录入组件 (复刻图片2) ---
  const InputView = () => (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('home')} className="p-2 border rounded-full hover:bg-slate-100"><ChevronLeft size={20}/></button>
        <div>
          <h2 className="text-2xl font-bold">数据录入</h2>
          <p className="text-sm text-slate-500">{selectedCategory}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold mb-4 flex items-center gap-2"><Database size={18}/> 录入信息</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">数据月份</label>
                <input type="month" className="w-full border rounded-lg p-2.5 focus:ring-2 ring-black/5 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">价格段</label>
                <select className="w-full border rounded-lg p-2.5 focus:ring-2 ring-black/5 outline-none">
                  <option>全部价格段</option>
                  <option>0-100元</option>
                  <option>100-200元</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold mb-4">原始数据</h4>
            <textarea 
              placeholder="请粘贴从生意参谋复制的原始数据..."
              className="w-full h-64 border rounded-lg p-4 text-sm font-mono focus:ring-2 ring-black/5 outline-none resize-none bg-slate-50"
            />
            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
                <Play size={16}/> 解析数据
              </button>
              <button className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold opacity-50 cursor-not-allowed">
                <Save size={16}/> 保存数据
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
           <Table size={48} className="mb-4 opacity-20"/>
           <p>请先在左侧输入原始数据并点击解析</p>
        </div>
      </div>
    </div>
  );

  // --- 3. 详情分析组件 (复刻图片3-9) ---
  const DetailView = () => {
    const tabs = ['市场大盘', '竞争分析', '细分品类', '汇总统计', '管理'];
    
    return (
      <div className="min-h-screen bg-[#fcfcfc]">
        {/* Header */}
        <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft /></button>
            <div>
              <h2 className="text-xl font-bold">{selectedCategory}</h2>
              <p className="text-[10px] text-slate-400">数据月份: 15个月 | 价格区间: 10个 | 细分品类: 2个</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('input')} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium"><Plus size={14}/> 录入数据</button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50"><Settings size={14}/> 数据管理</button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50"><Package size={14}/> 项目管理</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b px-8 flex gap-8">
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="p-8 max-w-[1400px] mx-auto space-y-8">
          {activeTab === '市场大盘' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 模拟图表卡片 */}
              {[
                { title: '销售额趋势', growth: '+29.1%', color: 'text-green-600' },
                { title: '购买人数趋势', growth: '+9.6%', color: 'text-green-600' },
                { title: '转化率趋势', growth: '-13.4%', color: 'text-red-600' },
                { title: '访客数趋势', growth: '+34.7%', color: 'text-green-600' }
              ].map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                   <h3 className="font-bold text-slate-800 mb-6">{card.title}</h3>
                   <div className="grid grid-cols-3 gap-4 h-full">
                      <div className="col-span-2 h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={MOCK_MONTHS.map(m => ({ name: m, val: Math.random() * 1000 + 500 }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey="val" fill="#2563eb" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col items-center justify-center border-l border-slate-50">
                        <span className="text-xs text-slate-400 font-medium">同比增长</span>
                        <span className={`text-2xl font-black mt-1 ${card.color}`}>{card.growth}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === '细分品类' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <h3 className="font-bold mb-6">各细分品类销量占比</h3>
                  <div className="h-[250px] w-full flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePie>
                        <Pie data={[{n:'一体式', v:69}, {n:'分体式', v:31}]} dataKey="v" innerRadius={60} outerRadius={80} paddingAngle={5}>
                          <Cell fill="#2563eb" />
                          <Cell fill="#f97316" />
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </RePie>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <h3 className="font-bold mb-6">各细分品类销售额占比</h3>
                  <div className="h-[250px] w-full flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePie>
                        <Pie data={[{n:'一体式', v:70}, {n:'分体式', v:30}]} dataKey="v" innerRadius={60} outerRadius={80} paddingAngle={5}>
                          <Cell fill="#2563eb" />
                          <Cell fill="#f97316" />
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </RePie>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === '汇总统计' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 font-bold">价格区间</th>
                    <th className="p-4 font-bold">月均产品数</th>
                    <th className="p-4 font-bold">总销量</th>
                    <th className="p-4 font-bold">总销售额</th>
                    <th className="p-4 font-bold">单品均销量</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { range: '0-100元', count: 10, sales: '35.2万', revenue: '¥2981.8万', avg: '2,445' },
                    { range: '100-200元', count: 18, sales: '33.2万', revenue: '¥5931.9万', avg: '1,217' },
                    { range: '200-300元', count: 8, sales: '19.7万', revenue: '¥5465.5万', avg: '1,579' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-medium">{row.range}</td>
                      <td className="p-4">{row.count}</td>
                      <td className="p-4">{row.sales}</td>
                      <td className="p-4">{row.revenue}</td>
                      <td className="p-4 font-bold text-blue-600">{row.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- 4. 渲染当前视图 ---
  return (
    <div className="min-h-screen font-sans antialiased text-slate-900">
      {view === 'home' && <HomeView />}
      {view === 'input' && <InputView />}
      {view === 'detail' && <DetailView />}
    </div>
  );
}