"use client";
import React, { useState, useEffect } from 'react';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, X,
  BarChart3, PieChart, Table, Play, Save, Package, Search, Edit3, Download, TrendingUp
} from 'lucide-react';

// --- 财务计算核心逻辑 ---
const calculateFinancials = (inputs: any) => {
  const { 
    bom, pricing, marketShare, taxRate, moldFee, rAndD, opExRate, manufacturingRate, marketVolume淘系 
  } = inputs;

  // 1. 市场容量预估
  const marketVolumeTotal = marketVolume淘系 / 0.3; // 假设淘系占30%
  const annualSalesVolume = marketVolumeTotal * (marketShare / 100);
  const totalLifecycleVolume = annualSalesVolume * 3; // 假设3年周期

  // 2. 收入与成本
  const annualRevenue = annualSalesVolume * pricing;
  const totalVariableCost = bom * (1 + manufacturingRate / 100);
  const annualOpEx = annualRevenue * (opExRate / 100);

  // 3. 分摊计算
  const perUnitInvestment = (moldFee + rAndD) / totalLifecycleVolume;
  
  // 4. 利润指标
  const unitGrossProfit = pricing - totalVariableCost - perUnitInvestment;
  const grossProfitMargin = (unitGrossProfit / pricing) * 100;
  
  const unitPreTaxProfit = unitGrossProfit - (annualOpEx / annualSalesVolume);
  const preTaxMargin = (unitPreTaxProfit / pricing) * 100;
  
  const unitNetProfit = unitPreTaxProfit * (1 - taxRate / 100);
  const netProfitMargin = (unitNetProfit / pricing) * 100;

  return {
    marketVolumeTotal,
    annualSalesVolume,
    totalLifecycleVolume,
    annualRevenue,
    unitGrossProfit,
    grossProfitMargin,
    preTaxMargin,
    unitNetProfit,
    netProfitMargin,
    annualOpEx
  };
};

export default function MarketApp() {
  // 视图控制
  const [view, setView] = useState<'home' | 'detail' | 'projectList' | 'projectDetail'>('home');
  const [activeTab, setActiveTab] = useState('市场大盘');
  
  // 数据状态
  const [categories, setCategories] = useState([
    { name: '黑胶唱片机', data: true }, { name: 'AI耳机', data: true }, { name: '电竞类电脑多媒体音箱', data: true }
  ]);
  const [subCategories, setSubCategories] = useState([
    { id: 1, name: '一体式', desc: '条形或矩形的单个电竞音箱' },
    { id: 2, name: '分体式', desc: '两个或多个音箱' }
  ]);

  // 财务测算输入状态 (对应图片：项目管理-查看项目)
  const [finInputs, setFinInputs] = useState({
    pricing: 1000,
    bom: 300,
    marketShare: 5,
    taxRate: 25,
    moldFee: 500000,
    rAndD: 1000000,
    opExRate: 15,
    manufacturingRate: 10,
    marketVolume淘系: 149655
  });

  const [results, setResults] = useState(calculateFinancials(finInputs));

  // 实时更新计算结果
  useEffect(() => {
    setResults(calculateFinancials(finInputs));
  }, [finInputs]);

  // --- UI 组件：通用弹窗 ---
  const [isModalOpen, setIsModalOpen] = useState<'none' | 'addCat' | 'manageSub'>('none');

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-900">
      
      {/* 1. 首页视图 */}
      {view === 'home' && (
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl font-bold">汉桑市场数据分析平台</h1>
              <p className="text-slate-500 text-sm">管理和分析市场数据</p>
            </div>
            <button onClick={() => setIsModalOpen('addCat')} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={18}/> 新建品类
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-white border p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between mb-8"><h3 className="font-bold">{cat.name}</h3><span className="text-[10px] bg-slate-100 p-1 rounded">有数据</span></div>
                <div className="flex gap-2">
                  <button onClick={() => setView('detail')} className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-bold">查看详情</button>
                  <button className="flex-1 border py-2 rounded-lg text-sm font-medium">录入数据</button>
                  <button className="p-2 border rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 项目财务测算详情 (核心功能) */}
      {view === 'projectDetail' && (
        <div className="min-h-screen">
          <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('projectList')} className="p-2 border rounded-full"><ChevronLeft/></button>
              <h2 className="text-xl font-bold">电竞音箱 <span className="text-sm font-normal text-slate-400 ml-2">项目财务测算</span></h2>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg text-sm font-bold bg-white flex items-center gap-2"><Save size={16}/> 保存</button>
              <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold flex items-center gap-2"><Download size={16}/> 导出</button>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto">
            {/* 左侧：输入区域 */}
            <div className="lg:col-span-5 space-y-6">
              <section className="bg-white p-6 rounded-2xl border">
                <h4 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18}/> 市场与销售预估</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-slate-400 block mb-1">产品售价 (元)</label>
                    <input type="number" value={finInputs.pricing} onChange={(e)=>setFinInputs({...finInputs, pricing: Number(e.target.value)})} className="w-full border rounded-lg p-2 text-sm bg-slate-50"/>
                  </div>
                  <div><label className="text-xs text-slate-400 block mb-1">预估市场占有率 (%)</label>
                    <input type="number" value={finInputs.marketShare} onChange={(e)=>setFinInputs({...finInputs, marketShare: Number(e.target.value)})} className="w-full border rounded-lg p-2 text-sm bg-slate-50"/>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl border">
                <h4 className="font-bold mb-4">成本与投资</h4>
                <div className="space-y-4">
                  <div><label className="text-xs text-slate-400 block mb-1">BOM 成本 (元)</label>
                    <input type="number" value={finInputs.bom} onChange={(e)=>setFinInputs({...finInputs, bom: Number(e.target.value)})} className="w-full border rounded-lg p-2 text-sm bg-slate-50"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs text-slate-400 block mb-1">模具费 (元)</label>
                      <input type="number" value={finInputs.moldFee} onChange={(e)=>setFinInputs({...finInputs, moldFee: Number(e.target.value)})} className="w-full border rounded-lg p-2 text-sm bg-slate-50"/>
                    </div>
                    <div><label className="text-xs text-slate-400 block mb-1">研发人员成本 (元)</label>
                      <input type="number" value={finInputs.rAndD} onChange={(e)=>setFinInputs({...finInputs, rAndD: Number(e.target.value)})} className="w-full border rounded-lg p-2 text-sm bg-slate-50"/>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* 右侧：计算结果区域 (对应图片右侧) */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Settings size={20}/> 核心财务指标 (实时计算)</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-slate-500">市场总容量 (预估)</span>
                  <span className="font-bold font-mono">{Math.floor(results.marketVolumeTotal).toLocaleString()} 台</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-slate-500">预估年销售收入</span>
                  <span className="font-bold font-mono">¥ {results.annualRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-green-600">
                  <span className="text-sm font-bold">单台毛利润</span>
                  <span className="font-black font-mono">¥ {results.unitGrossProfit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-green-600">
                  <span className="text-sm font-bold">毛利率 (%)</span>
                  <span className="font-black font-mono">{results.grossProfitMargin.toFixed(2)} %</span>
                </div>
                <div className="flex justify-between py-2 border-b text-blue-600">
                  <span className="text-sm font-bold">净利率 (%)</span>
                  <span className="font-black font-mono">{results.netProfitMargin.toFixed(2)} %</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-slate-50 rounded-xl text-xs text-slate-400 italic">
                * 计算逻辑：基于3年生命周期分摊模具与研发成本，净利率已扣除 {finInputs.taxRate}% 企业所得税。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 弹窗逻辑实现 --- */}
      {isModalOpen === 'addCat' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">创建新品类</h3>
              <button onClick={()=>setIsModalOpen('none')}><X/></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold mb-1">品类名称</label><input placeholder="例如：蓝牙音箱" className="w-full border rounded-xl p-3 outline-none focus:border-black"/></div>
              <div><label className="block text-sm font-bold mb-1">描述 (可选)</label><textarea placeholder="品类详细描述..." className="w-full border rounded-xl p-3 h-24 outline-none focus:border-black"/></div>
              <div className="flex gap-4 pt-4">
                <button onClick={()=>setIsModalOpen('none')} className="flex-1 py-3 border rounded-xl font-bold">取消</button>
                <button onClick={()=>setIsModalOpen('none')} className="flex-1 py-3 bg-black text-white rounded-xl font-bold">创建</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 辅助视图：详情页、管理页等（保持之前的路由逻辑） */}
      {view === 'detail' && (
        <div>
           <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4"><button onClick={() => setView('home')} className="p-2 border rounded-full"><ChevronLeft/></button>
              <h2 className="text-xl font-bold text-slate-800">电竞类电脑多媒体音箱</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('projectList')} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">项目管理</button>
            </div>
          </div>
          <div className="bg-white border-b px-8 flex gap-8">
            {['市场大盘', '细分品类', '管理'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 text-sm font-bold border-b-2 ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-slate-400'}`}>{tab}</button>
            ))}
          </div>
          <div className="p-8">
            {activeTab === '管理' && (
              <div className="bg-white p-8 rounded-3xl border max-w-4xl mx-auto shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold">细分品类管理</h3>
                  <button onClick={()=>setIsModalOpen('manageSub')} className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus size={16}/> 管理细分品类</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {subCategories.map(s => <div key={s.id} className="p-4 border rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold">序号 {s.id}</div>
                    <div className="font-bold">{s.name}</div>
                  </div>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'projectList' && (
        <div className="p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4"><button onClick={() => setView('detail')} className="p-2 border rounded-full"><ChevronLeft/></button><h2 className="text-2xl font-bold">项目管理</h2></div>
            <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> 创建新项目</button>
          </div>
          <div className="bg-white p-6 rounded-2xl border w-72">
            <h3 className="font-bold text-lg mb-4">电竞音箱</h3>
            <div className="text-sm text-slate-500 mb-6">市场总销量：148,480</div>
            <button onClick={() => setView('projectDetail')} className="w-full bg-black text-white py-2 rounded-lg font-bold">查看项目</button>
          </div>
        </div>
      )}

    </div>
  );
}