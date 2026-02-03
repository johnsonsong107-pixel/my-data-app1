"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, Trash2, ChevronLeft, Calculator, Save, Download, 
  Target, TrendingUp, DollarSign, CheckCircle2, Search, Trash, 
  FileText, Database, Layers
} from 'lucide-react';

const supabaseUrl = 'https://cwjpyqyknllirbydahxl.supabase.co';
const supabaseKey = 'sb_secret_ifUnQwUmABOku2N9ShmgTQ_9ar2HBJ3';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HansangProApp() {
  // 视图切换
  const [view, setView] = useState<'home' | 'projectDetail' | 'dataManage'>('home');
  const [marketData, setMarketData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // 批量操作状态

  // --- 财务测算状态 (与截图功能精准绑定) ---
  const [finance, setFinance] = useState({
    id: null,
    projectName: "电竞音箱开发项目",
    taoSales: 149655,      // 淘系市场容量 (从大盘获取)
    taoPercent: 30,        // 淘系占比
    share: 5,              // 预计市占率
    price: 1000,           // 售价
    months: 36,            // 生命周期
    bom: 350,              // BOM成本
    mould: 500000,         // 模具费
    rdStaff: 800000,       // 研发人工
    marketingRate: 15,     // 运营费率
  });

  // --- 自动计算逻辑 (JS 表达式绑定) ---
  const calc = useMemo(() => {
    const totalMarket = finance.taoSales / (finance.taoPercent / 100);
    const projectTotalSales = totalMarket * (finance.share / 100);
    const annualSales = projectTotalSales / (finance.months / 12);
    const totalRevenue = projectTotalSales * finance.price;
    
    const totalInvest = finance.mould + finance.rdStaff; // 总投入
    const totalOpEx = totalRevenue * (finance.marketingRate / 100);
    const totalBomCost = projectTotalSales * finance.bom;
    
    const grossProfitUnit = finance.price - finance.bom;
    const grossMargin = (grossProfitUnit / finance.price) * 100;
    
    const netProfitTotal = totalRevenue - totalBomCost - totalOpEx - totalInvest;
    const netMargin = (netProfitTotal / totalRevenue) * 100;

    return {
      totalMarket: Math.round(totalMarket),
      annualSales: Math.round(annualSales),
      totalRevenue: totalRevenue.toLocaleString(),
      grossMargin: grossMargin.toFixed(2),
      netMargin: netMargin.toFixed(2),
      netProfit: netProfitTotal.toLocaleString()
    };
  }, [finance]);

  // --- Supabase 关联：保存测算结果 ---
  const saveProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .upsert({ 
        name: finance.projectName,
        config: finance, // 将整个财务模型存入 JSONB 字段
        updated_at: new Date()
      });
    if (!error) alert("测算模型已保存至云端！");
  };

  // --- 批量操作逻辑 ---
  const toggleSelectAll = () => {
    if (selectedIds.length === marketData.length) setSelectedIds([]);
    else setSelectedIds(marketData.map(d => d.id));
  };

  const handleBatchDelete = async () => {
    if (!confirm(`确定要删除选中的 ${selectedIds.length} 项吗？`)) return;
    const { error } = await supabase.from('market_data').delete().in('id', selectedIds);
    if (!error) {
      setMarketData(marketData.filter(d => !selectedIds.includes(d.id)));
      setSelectedIds([]);
    }
  };

  // --- 页面渲染 ---
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 顶部导航 */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black">HANSANG <span className="text-blue-600">INTEL</span></h1>
          <nav className="flex gap-6 ml-10 text-sm font-bold text-slate-400">
            <button onClick={() => setView('home')} className={view === 'home' ? 'text-blue-600' : ''}>项目大盘</button>
            <button onClick={() => setView('dataManage')} className={view === 'dataManage' ? 'text-blue-600' : ''}>数据管理</button>
          </nav>
        </div>
        {view === 'projectDetail' && (
          <div className="flex gap-3">
            <button onClick={saveProject} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition">
              <Save size={16}/> 保存测算
            </button>
          </div>
        )}
      </header>

      <main className="p-8 max-w-[1400px] mx-auto">
        
        {/* 财务测算视图 (项目详情) */}
        {view === 'projectDetail' && (
          <div className="flex gap-8 animate-in fade-in">
            {/* 左侧：输入参数区域 */}
            <div className="flex-1 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold flex items-center gap-2 text-slate-800 mb-6"><Target size={20} className="text-blue-600"/> 销售与占有率预估</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">预计市场份额 (%)</label>
                    <input type="number" value={finance.share} onChange={e => setFinance({...finance, share: Number(e.target.value)})} 
                      className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold outline-none focus:ring-2 ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">单台售价 (元)</label>
                    <input type="number" value={finance.price} onChange={e => setFinance({...finance, price: Number(e.target.value)})} 
                      className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold outline-none focus:ring-2 ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">BOM 成本 (元)</label>
                    <input type="number" value={finance.bom} onChange={e => setFinance({...finance, bom: Number(e.target.value)})} 
                      className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold outline-none focus:ring-2 ring-blue-500/20 text-red-600" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">运营费率 (%)</label>
                    <input type="number" value={finance.marketingRate} onChange={e => setFinance({...finance, marketingRate: Number(e.target.value)})} 
                      className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold outline-none focus:ring-2 ring-blue-500/20" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-slate-400 italic text-sm">
                * 提示：模具费及研发投入在系统设置的项目库中进行配置，此处自动带入计算。
              </div>
            </div>

            {/* 右侧：实时财务清单 */}
            <div className="w-[450px]">
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-24">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-bold flex items-center gap-2"><Calculator size={20} className="text-blue-400"/> 财务测算结果</h3>
                  <div className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded font-black tracking-widest uppercase">Live Calculate</div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-slate-400 text-xs font-bold">全渠道总容量 (预估)</span>
                    <span className="text-xl font-mono font-bold">{calc.totalMarket.toLocaleString()} <span className="text-[10px] opacity-50">台/月</span></span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-xs font-bold">单台毛利率</span>
                    <span className="text-2xl font-black text-green-400">{calc.grossMargin} %</span>
                  </div>
                  <div className="flex justify-between items-end bg-white/5 p-4 rounded-2xl">
                    <span className="text-slate-400 text-xs font-bold">预计年营收额</span>
                    <span className="text-xl font-black text-blue-400">¥ {calc.totalRevenue}</span>
                  </div>
                  <div className="pt-6">
                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">项目最终净利率预估</div>
                    <div className="text-6xl font-black italic tracking-tighter text-white">{calc.netMargin} <span className="text-2xl opacity-50">%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 批量操作管理页 (还原截图 11) */}
        {view === 'dataManage' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <input type="checkbox" checked={selectedIds.length === marketData.length && marketData.length > 0} onChange={toggleSelectAll} className="w-5 h-5 rounded" />
                <span className="text-sm font-bold text-slate-500">已选择 {selectedIds.length} 项</span>
                {selectedIds.length > 0 && (
                  <button onClick={handleBatchDelete} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition">
                    <Trash size={14}/> 批量删除选定项
                  </button>
                )}
              </div>
              <div className="relative w-80">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                <input placeholder="搜索产品..." className="w-full bg-white border-slate-200 rounded-xl pl-10 p-2 text-sm" />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {marketData.length === 0 ? (
                <div className="p-20 text-center text-slate-300 font-bold">暂无数据，请先在录入页面同步</div>
              ) : (
                marketData.map((item) => (
                  <div key={item.id} className={`p-6 flex items-center gap-6 hover:bg-slate-50 transition ${selectedIds.includes(item.id) ? 'bg-blue-50/30' : ''}`}>
                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => {
                      if (selectedIds.includes(item.id)) setSelectedIds(selectedIds.filter(id => id !== item.id));
                      else setSelectedIds([...selectedIds, item.id]);
                    }} className="w-5 h-5 rounded border-slate-300" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">月份: {item.month} | 品牌: {item.brand}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black italic">¥ {item.sales?.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-slate-400">预估月销额</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 首页入口 */}
        {view === 'home' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-20">
              <div onClick={() => setView('projectDetail')} className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 hover:border-blue-500 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                  <TrendingUp size={32}/>
                </div>
                <h3 className="text-2xl font-black mb-2">项目财务决策</h3>
                <p className="text-slate-400">基于市场容量和成本模型进行投资回报测算</p>
              </div>
              <div onClick={() => setView('dataManage')} className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 hover:border-blue-500 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-6 group-hover:bg-slate-900 group-hover:text-white transition">
                  <Database size={32}/>
                </div>
                <h3 className="text-2xl font-black mb-2">数据治理中心</h3>
                <p className="text-slate-400">清理、同步及批量管理生意参谋原始数据</p>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}