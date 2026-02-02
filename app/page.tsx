"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, X, Edit3, 
  BarChart3, PieChart, Table, Play, Save, Package, Search, Download, TrendingUp, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend 
} from 'recharts';

// --- 1. 核心计算引擎 (财务测算公式) ---
const calculateProjectFinancials = (data: any) => {
  const {
    pricing = 0, bom = 0, share = 0, volume淘系 = 0,
    mold = 0, rd = 0, marketingRate = 0, taxRate = 0, manufacturingRate = 0
  } = data;

  // 1. 市场容量计算 (参考图片：淘系占比预估)
  const totalMarketVolume = volume淘系 / 0.3; // 假设淘系占30%
  const annualSalesVolume = totalMarketVolume * (share / 100);
  const totalLifecycleVolume = annualSalesVolume * 3; // 假设3年生命周期

  // 2. 收入与可变成本
  const annualRevenue = annualSalesVolume * pricing;
  const unitVariableCost = bom * (1 + manufacturingRate / 100);

  // 3. 费用与分摊 (固定成本)
  const annualMarketingOpEx = annualRevenue * (marketingRate / 100);
  const unitInvestmentAmortization = totalLifecycleVolume > 0 ? (mold + rd) / totalLifecycleVolume : 0;

  // 4. 利润指标计算
  const unitGrossProfit = pricing - unitVariableCost - unitInvestmentAmortization;
  const grossProfitMargin = pricing > 0 ? (unitGrossProfit / pricing) * 100 : 0;
  
  const annualPreTaxProfit = (unitGrossProfit * annualSalesVolume) - annualMarketingOpEx;
  const netProfit = annualPreTaxProfit * (1 - taxRate / 100);
  const netProfitMargin = annualRevenue > 0 ? (netProfit / annualRevenue) * 100 : 0;

  return {
    totalMarketVolume,
    annualSalesVolume,
    annualRevenue,
    unitGrossProfit,
    grossProfitMargin,
    netProfit,
    netProfitMargin,
    annualMarketingOpEx
  };
};

export default function IntegratedMarketApp() {
  // --- A. 全局状态控制 ---
  const [view, setView] = useState<'home' | 'detail' | 'projectList' | 'projectDetail'>('home');
  const [activeTab, setActiveTab] = useState('市场大盘');
  const [modalType, setModalType] = useState<'none' | 'addCategory' | 'manageSub' | 'createProject'>('none');

  // --- B. 业务数据状态 ---
  const [categories, setCategories] = useState([
    { id: 1, name: '黑胶唱片机', hasData: true },
    { id: 2, name: 'AI耳机', hasData: true },
    { id: 3, name: '电竞类电脑多媒体音箱', hasData: true }
  ]);
  const [subCategories, setSubCategories] = useState([
    { id: 1, name: '一体式', desc: '条形或矩形的单个电竞音箱' },
    { id: 2, name: '分体式', desc: '两个或多个音箱' }
  ]);
  const [projects, setProjects] = useState([
    { id: 1, name: '电竞音箱项目A', volume: 148480 }
  ]);

  // --- C. 财务测算输入状态 ---
  const [finInputs, setFinInputs] = useState({
    pricing: 1000,
    bom: 300,
    share: 5,
    volume淘系: 149655,
    mold: 500000,
    rd: 1000000,
    marketingRate: 15,
    taxRate: 25,
    manufacturingRate: 10
  });

  // 自动计算结果
  const finResults = useMemo(() => calculateProjectFinancials(finInputs), [finInputs]);

  // --- D. 交互处理函数 ---
  const handleAddCategory = (e: any) => {
    e.preventDefault();
    const name = e.target.catName.value;
    if (name) {
      setCategories([...categories, { id: Date.now(), name, hasData: false }]);
      setModalType('none');
    }
  };

  const handleAddSubCategory = () => {
    const name = prompt("输入细分品类名称:");
    if (name) {
      setSubCategories([...subCategories, { id: Date.now(), name, desc: '新添加的细分品类' }]);
    }
  };

  // --- E. UI 组件模块 ---

  // 1. 弹窗组件 (Modal)
  const Modal = ({ title, type, children }: any) => {
    if (modalType !== type) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="px-6 py-5 border-b flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-lg">{title}</h3>
            <button onClick={() => setModalType('none')} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20}/></button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  // --- F. 视图页面 ---

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      
      {/* 视图1：首页 (品类看板) */}
      {view === 'home' && (
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">汉桑市场数据分析平台</h1>
              <p className="text-slate-500 mt-2 font-medium">管理和分析您的全球市场品类数据</p>
            </div>
            <button onClick={() => setModalType('addCategory')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-slate-200 hover:-translate-y-0.5">
              <Plus size={20} strokeWidth={3} /> 新建品类
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-12">
                  <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cat.hasData ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {cat.hasData ? 'DATA READY' : 'EMPTY'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setView('detail')} className="flex-[3] bg-slate-900 text-white py-3.5 rounded-2xl text-sm font-bold hover:bg-blue-600 transition-colors">查看分析</button>
                  <button className="flex-[2] bg-slate-50 text-slate-600 py-3.5 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-colors">录入</button>
                  <button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} className="p-3.5 border border-slate-100 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 视图2：详情分析页 (核心分析功能) */}
      {view === 'detail' && (
        <div className="animate-in slide-in-from-right duration-300">
          <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('home')} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"><ChevronLeft /></button>
              <h2 className="text-xl font-bold">电竞类电脑多媒体音箱</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setView('projectList')} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all">
                <Package size={18}/> 项目管理
              </button>
            </div>
          </header>

          <nav className="bg-white border-b px-12 flex gap-10">
            {['市场大盘', '竞争分析', '细分品类', '管理'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-5 text-sm font-bold transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                {tab}
              </button>
            ))}
          </nav>

          <main className="p-10 max-w-[1440px] mx-auto">
            {activeTab === '管理' ? (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">细分品类管理</h3>
                    <p className="text-slate-400 mt-1">定义和编辑该品类下的所有细分市场维度</p>
                  </div>
                  <button onClick={() => setModalType('manageSub')} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                    <Edit3 size={18}/> 管理细分
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subCategories.map(sub => (
                    <div key={sub.id} className="bg-white p-8 rounded-3xl border border-slate-50 shadow-sm group hover:border-blue-100 transition-colors">
                      <div className="text-[10px] font-black text-blue-500 bg-blue-50 w-fit px-2 py-0.5 rounded-md mb-4 uppercase tracking-wider">Sub-Category {sub.id}</div>
                      <h4 className="text-xl font-bold text-slate-800">{sub.name}</h4>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">{sub.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 模拟图表展示 */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2"><BarChart3 size={20} className="text-blue-500"/> 销售额趋势分析</h3>
                   <div className="h-72 w-full bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold italic">
                      [ 图表数据已加载 - 实时渲染中 ]
                   </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2"><PieChart size={20} className="text-orange-500"/> 细分市场占比</h3>
                   <div className="h-72 w-full bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold italic">
                      [ 占比数据已加载 - 实时渲染中 ]
                   </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* 视图3：项目管理列表 */}
      {view === 'projectList' && (
        <div className="p-12 max-w-5xl mx-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
              <button onClick={() => setView('detail')} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"><ChevronLeft size={24}/></button>
              <h2 className="text-3xl font-black">项目管理</h2>
            </div>
            <button onClick={() => setModalType('createProject')} className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <Plus size={20} strokeWidth={3}/> 创建新项目
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map(proj => (
              <div key={proj.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <h3 className="text-2xl font-black mb-6">{proj.name}</h3>
                <div className="space-y-3 mb-10">
                  <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">细分市场</span><span className="font-bold text-slate-700">200-300元 / 一体式</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">基准市场容量</span><span className="font-bold text-slate-700">{proj.volume.toLocaleString()}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setView('projectDetail')} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors">查看详情 & 财务测算</button>
                  <button onClick={() => setProjects(projects.filter(p => p.id !== proj.id))} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 视图4：财务测算详情页 (对应图片14 - 核心计算逻辑) */}
      {view === 'projectDetail' && (
        <div className="animate-in fade-in duration-500">
          <header className="bg-white border-b px-10 py-5 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-5">
              <button onClick={() => setView('projectList')} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"><ChevronLeft size={20}/></button>
              <div>
                <h2 className="text-xl font-black">电竞音箱 - 财务测算模型</h2>
                <p className="text-xs font-bold text-blue-500 tracking-widest mt-0.5">FINANCIAL SIMULATION ENGINE v1.0</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"><Save size={18}/> 保存数据</button>
              <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2"><Download size={18}/> 导出报告</button>
            </div>
          </header>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-[1600px] mx-auto">
            {/* 左侧输入板 */}
            <div className="lg:col-span-5 space-y-8">
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-blue-500"/> 市场与定价输入</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">产品建议零售价 (元)</label>
                    <input type="number" value={finInputs.pricing} 
                      onChange={(e) => setFinInputs({...finInputs, pricing: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 ring-blue-500/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">预估市场份额 (%)</label>
                    <input type="number" value={finInputs.share} 
                      onChange={(e) => setFinInputs({...finInputs, share: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 ring-blue-500/20 outline-none transition-all" />
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2"><Database size={20} className="text-orange-500"/> 成本与投资设定</h4>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">BOM 核心物料成本 (元)</label>
                    <input type="number" value={finInputs.bom} 
                      onChange={(e) => setFinInputs({...finInputs, bom: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 ring-blue-500/20 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase ml-1">固定资产/模具投入 (元)</label>
                      <input type="number" value={finInputs.mold} 
                        onChange={(e) => setFinInputs({...finInputs, mold: Number(e.target.value)})}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold focus:ring-2 ring-blue-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase ml-1">研发人员总投入 (元)</label>
                      <input type="number" value={finInputs.rd} 
                        onChange={(e) => setFinInputs({...finInputs, rd: Number(e.target.value)})}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold focus:ring-2 ring-blue-500/20 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* 右侧结果板 (财务计算核心展现) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10"><TrendingUp size={200}/></div>
                <h3 className="text-xl font-bold mb-10 flex items-center gap-2 text-blue-400"><Settings size={24}/> 实时测算结果看板</h3>
                
                <div className="grid grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">预估年收入</p>
                    <p className="text-4xl font-black font-mono">¥ {Math.floor(finResults.annualRevenue).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">预估年销量</p>
                    <p className="text-4xl font-black font-mono">{Math.floor(finResults.annualSalesVolume).toLocaleString()} <span className="text-sm font-normal">PCS</span></p>
                  </div>
                </div>

                <div className="mt-16 grid grid-cols-3 gap-6 relative z-10">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold mb-2">毛利率 (GPM)</p>
                    <p className={`text-2xl font-black ${finResults.grossProfitMargin > 40 ? 'text-green-400' : 'text-orange-400'}`}>{finResults.grossProfitMargin.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold mb-2">净利率 (NPM)</p>
                    <p className={`text-2xl font-black ${finResults.netProfitMargin > 15 ? 'text-blue-400' : 'text-red-400'}`}>{finResults.netProfitMargin.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <p className="text-[10px] text-slate-500 font-bold mb-2">单台毛利</p>
                    <p className="text-2xl font-black text-white">¥ {finResults.unitGrossProfit.toFixed(0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-start gap-4 shadow-sm">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Info size={24}/></div>
                <div>
                  <h4 className="font-bold text-slate-800">模型说明</h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    当前测算基于<b>3年产品生命周期</b>。研发费用与模具费已按生命周期总产量进行分摊。
                    年度营销费用率设定为 <b>{finInputs.marketingRate}%</b>，企业所得税率为 <b>{finInputs.taxRate}%</b>。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- G. 弹窗组件实例化 --- */}

      {/* 弹窗：新建品类 */}
      <Modal title="创建新品类" type="addCategory">
        <form onSubmit={handleAddCategory} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">品类名称</label>
            <input name="catName" autoFocus placeholder="输入如：蓝牙音箱" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-blue-500/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">市场描述 (可选)</label>
            <textarea placeholder="关于此品类的简要说明..." className="w-full bg-slate-50 border-none rounded-2xl p-4 h-24 font-medium outline-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalType('none')} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold hover:bg-slate-200 transition-colors">取消</button>
            <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">立即创建</button>
          </div>
        </form>
      </Modal>

      {/* 弹窗：管理细分品类 (对应图片：管理细分品类) */}
      <Modal title="管理细分品类" type="manageSub">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          {subCategories.map(sub => (
            <div key={sub.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-all">
              <div className="flex-1">
                <div className="text-[10px] font-black text-slate-300 uppercase">Index {sub.id}</div>
                <div className="font-bold text-slate-800">{sub.name}</div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={16}/></button>
                <button onClick={() => setSubCategories(subCategories.filter(s => s.id !== sub.id))} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
          <button onClick={handleAddSubCategory} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all">
            <Plus size={20}/> 添加新细分维度
          </button>
        </div>
        <div className="mt-8 pt-6 border-t">
          <button onClick={() => setModalType('none')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">保存并返回</button>
        </div>
      </Modal>

      {/* 弹窗：创建新项目 (在项目管理中调用) */}
      <Modal title="创建新项目" type="createProject">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">项目名称</label>
            <input id="projName" placeholder="2024款高端电竞音箱测算" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setModalType('none')} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">取消</button>
            <button onClick={() => {
              const name = (document.getElementById('projName') as HTMLInputElement).value;
              if(name) setProjects([...projects, { id: Date.now(), name, volume: 148480 }]);
              setModalType('none');
            }} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold">确定创建</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}