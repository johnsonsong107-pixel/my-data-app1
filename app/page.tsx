"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, Edit3, X, BarChart3, 
  Table, Play, Save, FileText, Layout, Search, Filter, FolderTree, 
  TrendingUp, Calculator, DollarSign, Target, ChevronRight, Menu
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- 配置云端连接 ---
const supabaseUrl = 'https://cwjpyqyknllirbydahxl.supabase.co';
const supabaseKey = 'sb_secret_ifUnQwUmABOku2N9ShmgTQ_9ar2HBJ3';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HansangUltimateSystem() {
  // 核心路由与状态
  const [activeProject, setActiveProject] = useState('电竞类电脑多媒体音箱');
  const [view, setView] = useState<'analytics' | 'finance' | 'dataManage' | 'input'>('analytics');
  const [activeTab, setActiveTab] = useState('市场大盘');
  const [marketData, setMarketData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // 财务模型数据 (精准对应《项目管理-查看项目.png》)
  const [finance, setFinance] = useState({
    taoSales: 149655,
    taoPercent: 30,
    share: 5,
    unitPrice: 1000,
    lifecycle: 36,
    bomCost: 350,
    mouldFee: 500000,
    fixtureFee: 200000,
    rdStaffFee: 1000000,
    rdMaterialFee: 200000,
    opExRate: 15
  });

  // 实时财务计算表达式
  const calc = useMemo(() => {
    const totalMarket = finance.taoSales / (finance.taoPercent / 100);
    const projectTotalQty = totalMarket * (finance.share / 100);
    const totalRevenue = projectTotalQty * finance.unitPrice;
    const totalInvestment = finance.mouldFee + finance.fixtureFee + finance.rdStaffFee + finance.rdMaterialFee;
    const totalOpEx = totalRevenue * (finance.opExRate / 100);
    const totalBom = projectTotalQty * finance.bomCost;
    
    const netProfit = totalRevenue - totalBom - totalOpEx - totalInvestment;
    const netMargin = (netProfit / totalRevenue) * 100;
    const grossMargin = ((finance.unitPrice - finance.bomCost) / finance.unitPrice) * 100;

    return {
      totalMarket: Math.round(totalMarket),
      projectQty: Math.round(projectTotalQty),
      revenue: totalRevenue.toLocaleString(),
      grossMargin: grossMargin.toFixed(2),
      netMargin: netMargin.toFixed(2),
      investment: totalInvestment.toLocaleString()
    };
  }, [finance]);

  // --- 视图组件：左侧导航栏 ---
  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-black italic tracking-tighter text-slate-900">HANSANG <span className="text-blue-600 font-normal">AI</span></h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">我的项目库</p>
        {['电竞类电脑多媒体音箱', '黑胶唱片机', 'AI智能耳机', '蓝牙外设', '歌词音箱'].map(item => (
          <button 
            key={item}
            onClick={() => setActiveProject(item)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${activeProject === item ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {item}
            <ChevronRight size={14} className={activeProject === item ? 'opacity-100' : 'opacity-0'} />
          </button>
        ))}
      </div>
      <div className="p-4 border-t">
        <button onClick={() => setView('input')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          <Plus size={18} /> 录入新数据
        </button>
      </div>
    </aside>
  );

  // --- 视图组件：市场分析 (Tab 切换) ---
  const AnalyticsView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 顶部筛选条 - 还原截图布局 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-end overflow-x-auto">
        {['开始月份', '结束月份', '价格区间', '细分品类'].map(label => (
          <div key={label} className="min-w-[140px]">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">{label}</label>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-bold text-slate-600 flex justify-between items-center cursor-pointer">
              全部 <Filter size={12}/>
            </div>
          </div>
        ))}
      </div>

      {/* 走势图块 - 还原同比增长绿色/红色块 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800">市场大盘走势</h3>
            <div className="flex gap-2"><span className="w-3 h-3 bg-blue-600 rounded-full"></span><span className="text-[10px] font-bold text-slate-400">销售额</span></div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{m:'1月', v:400}, {m:'2月', v:700}, {m:'3月', v:500}, {m:'4月', v:900}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fontSize:10}} />
                <Bar dataKey="v" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-green-500 p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-green-100">
           <p className="text-[10px] font-black uppercase opacity-80 tracking-widest">同比增长率 (YoY)</p>
           <div className="text-6xl font-black italic tracking-tighter">+29.1%</div>
           <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <p className="text-[10px] font-bold opacity-80">本周期总销售额</p>
              <p className="text-xl font-bold">¥ 45,892.4 万</p>
           </div>
        </div>
      </div>
    </div>
  );

  // --- 视图组件：财务决策 (财务公式绑定) ---
  const FinanceView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4">
      {/* 左侧输入参数 */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 text-lg"><Target className="text-blue-600" size={24}/> 市场预估配置</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">预计市场占有率 (%)</label>
              <input type="number" value={finance.share} onChange={e=>setFinance({...finance, share:Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none ring-offset-2 focus:ring-2 ring-blue-500/20" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">单台建议售价 (元)</label>
              <input type="number" value={finance.unitPrice} onChange={e=>setFinance({...finance, unitPrice:Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none ring-offset-2 focus:ring-2 ring-blue-500/20" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">BOM 目标成本 (元)</label>
              <input type="number" value={finance.bomCost} onChange={e=>setFinance({...finance, bomCost:Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-red-600 outline-none ring-offset-2 focus:ring-2 ring-blue-500/20" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">运营费率 (%)</label>
              <input type="number" value={finance.opExRate} onChange={e=>setFinance({...finance, opExRate:Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none ring-offset-2 focus:ring-2 ring-blue-500/20" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 text-lg"><DollarSign className="text-blue-600" size={24}/> 投资预算 (CAPEX/OPEX)</h3>
          <div className="grid grid-cols-2 gap-6">
            <input placeholder="模具费" value={finance.mouldFee} className="bg-slate-50 p-4 rounded-xl border-none outline-none font-bold" />
            <input placeholder="人工研发费" value={finance.rdStaffFee} className="bg-slate-50 p-4 rounded-xl border-none outline-none font-bold" />
          </div>
        </div>
      </div>

      {/* 右侧测算结果 - 黑色卡片还原 */}
      <div className="lg:col-span-5">
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl sticky top-24">
           <h3 className="text-xl font-black mb-10 flex justify-between items-center border-b border-white/10 pb-6">财务回收测算 <Calculator className="text-blue-500" /></h3>
           <div className="space-y-6">
              <div className="flex justify-between items-end"><span className="text-slate-400 text-xs font-bold uppercase">预估总销量</span><span className="text-2xl font-black italic">{calc.projectQty.toLocaleString()} <small className="text-[10px] opacity-40">台</small></span></div>
              <div className="flex justify-between items-end"><span className="text-slate-400 text-xs font-bold uppercase">单台毛利(元)</span><span className="text-2xl font-black text-green-400">{finance.unitPrice - finance.bomCost}</span></div>
              <div className="flex justify-between items-end"><span className="text-slate-400 text-xs font-bold uppercase">毛利率 (%)</span><span className="text-2xl font-black text-green-400">{calc.grossMargin}%</span></div>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">最终净利率预估 (Net Margin)</p>
                <div className="text-7xl font-black italic tracking-tighter text-blue-500">{calc.netMargin}<span className="text-2xl">%</span></div>
              </div>
           </div>
           <button onClick={() => alert('已成功保存至云端项目库')} className="w-full mt-10 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black hover:bg-blue-700 transition shadow-xl shadow-blue-900/40">保存测算并更新项目</button>
        </div>
      </div>
    </div>
  );

  // --- 视图组件：数据管理 (批量操作还原) ---
  const DataManageView = () => (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
      <div className="p-8 border-b flex justify-between items-center bg-slate-50/30">
        <div className="flex items-center gap-6">
          <input type="checkbox" checked={selectedIds.length > 0} onChange={() => setSelectedIds(selectedIds.length > 0 ? [] : [1])} className="w-6 h-6 rounded-lg border-slate-300" />
          <h2 className="text-xl font-black">原始数据中心 <span className="text-slate-300 font-normal ml-2">/ 共 1,248 条</span></h2>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && <button className="bg-red-50 text-red-500 px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-red-500 hover:text-white transition"><Trash2 size={16}/> 批量删除 ({selectedIds.length})</button>}
          <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={16}/><input placeholder="搜索产品..." className="bg-white border-slate-200 rounded-xl pl-10 p-2 text-xs w-64 outline-none" /></div>
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="p-8 flex items-center gap-8 hover:bg-slate-50/50 transition">
            <input type="checkbox" className="w-5 h-5 rounded border-slate-300" />
            <div className="flex-1">
              <h4 className="font-black text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition cursor-pointer">Marshall Acton III 官方无线蓝牙音箱 - 细分品类：一体式</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">店铺：Marshall官方旗舰店 | 录入月份：2024-06</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black italic">¥ 1,899</p>
              <p className="text-[10px] text-slate-400 font-bold">买家数: 1,480</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- 录入引擎组件 ---
  const InputView = () => (
    <div className="max-w-5xl mx-auto py-10 animate-in fade-in">
      <div className="flex items-center gap-4 mb-10 border-b pb-10">
        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-100"><FileText size={32}/></div>
        <div><h2 className="text-3xl font-black italic">数据录入引擎</h2><p className="text-slate-400 font-bold">粘贴生意参谋数据，系统将自动解析并进行云端同步</p></div>
      </div>
      <div className="grid grid-cols-3 gap-10">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">录入设置</label>
             <input type="month" className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold" />
             <select className="w-full bg-slate-50 border-none p-4 rounded-xl font-bold"><option>200-300元</option></select>
          </div>
        </div>
        <div className="col-span-2">
           <textarea className="w-full h-96 bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm font-mono text-xs focus:ring-4 ring-blue-500/5 outline-none" placeholder="此处粘贴原始数据..." />
           <button className="w-full mt-6 bg-slate-900 text-white py-6 rounded-[2rem] font-black italic text-lg shadow-2xl hover:bg-black transition">解析并同步至云端数据库</button>
        </div>
      </div>
    </div>
  );

  // --- 主渲染逻辑 ---
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* 顶部二级导航 */}
        <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-[60]">
          <div className="flex justify-between items-center mb-6">
            <div><h2 className="text-2xl font-black italic">{activeProject}</h2></div>
            <div className="flex gap-3">
              <button onClick={() => setView('analytics')} className={`px-5 py-2 rounded-xl text-xs font-black transition ${view === 'analytics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400'}`}>大盘透视</button>
              <button onClick={() => setView('finance')} className={`px-5 py-2 rounded-xl text-xs font-black transition ${view === 'finance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400'}`}>财务决策</button>
              <button onClick={() => setView('dataManage')} className={`px-5 py-2 rounded-xl text-xs font-black transition ${view === 'dataManage' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400'}`}>管理中心</button>
            </div>
          </div>
          {view === 'analytics' && (
            <div className="flex gap-8">
              {['市场大盘', '竞争分析', '细分品类', '汇总统计', '管理'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`text-sm font-black pb-2 transition-all border-b-4 ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-300'}`}>{t}</button>
              ))}
            </div>
          )}
        </header>

        {/* 主内容区 */}
        <main className="p-10">
          {view === 'analytics' && activeTab === '市场大盘' && <AnalyticsView />}
          {view === 'finance' && <FinanceView />}
          {view === 'dataManage' && <DataManageView />}
          {view === 'input' && <InputView />}
        </main>
      </div>
    </div>
  );
}