"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Database, Settings, Plus, Upload, Trash2, Edit, ChevronLeft, Calendar, Filter, FileText, PieChart as PieIcon, TrendingUp, Users, DollarSign, X, Save, Calculator, Briefcase
} from 'lucide-react';

// --- Supabase 配置 (保持不变) ---
const supabaseUrl = 'https://cwjpyqyknllirbydahxl.supabase.co';
const supabaseKey = 'sb_secret_ifUnQwUmABOku2N9ShmgTQ_9ar2HBJ3';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- UI 组件：模态框 (Modal) - 严格按照源码实现 ---
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500"><X size={20}/></button>
        </div>
        <div className="p-6 flex-1">
          {children}
        </div>
        {footer && (
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 工具函数：解析逻辑 - 严格按照源码实现 ---
const parseRangeValue = (str) => {
  if (!str) return 0;
  let cleanStr = str.replace(/,/g, '').replace(/元/g, '').trim();
  let multiplier = 1;
  if (cleanStr.includes('万')) {
    multiplier = 10000;
    cleanStr = cleanStr.replace('万', '');
  }
  const separators = ['-', '~'];
  let parts = [];
  for (let sep of separators) {
    if (cleanStr.includes(sep)) {
      parts = cleanStr.split(sep);
      break;
    }
  }
  if (parts.length === 2) {
    const min = parseFloat(parts[0]);
    const max = parseFloat(parts[1]);
    return ((min + max) / 2) * multiplier;
  } else {
    return parseFloat(cleanStr) * multiplier || 0;
  }
};

export default function MarketAnalysisPlatform() {
  // --- 状态管理 ---
  const [view, setView] = useState('home'); // home, detail, entry, data_mgr, project_mgr, project_calc
  const [activeTab, setActiveTab] = useState('market'); 
  const [currentProject, setCurrentProject] = useState(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isCategoryManageModalOpen, setIsCategoryManageModalOpen] = useState(false);

  // 模拟数据
  const [projects, setProjects] = useState([
    { id: 1, name: '电竞类电脑多媒体音箱', date: '2024-06', status: '有数据', marketVolume: 148480 },
    { id: 2, name: 'AI耳机', date: '2024-06', status: '有数据', marketVolume: 500000 },
  ]);

  const [subCategories, setSubCategories] = useState([
    { id: 1, name: '一体式', desc: '条形或矩形的单个电竞音箱' },
    { id: 2, name: '分体式', desc: '两个或多个音箱' }
  ]);

  // 财务输入 - 严格对应源码字段
  const [financeInputs, setFinanceInputs] = useState({
    targetShare: 5, price: 1000, cycle: 36, bomCost: 300,
    mfgCostRatio: 10, moldFee: 500000, fixtureFee: 200000,
    rdLabor: 1000000, rdMaterial: 200000, opexRatio: 15, taxRate: 25,
  });

  // --- 财务计算逻辑 - 严格按照源码公式实现 ---
  const financeMetrics = useMemo(() => {
    const totalMarket = currentProject?.marketVolume || 100000; 
    const annualVolume = Math.round(totalMarket * (financeInputs.targetShare / 100)); 
    const lifecycleVolume = Math.round(annualVolume * (financeInputs.cycle / 12));
    const annualRevenue = annualVolume * financeInputs.price;
    const totalRevenue = lifecycleVolume * financeInputs.price;
    
    const unitMfgCost = financeInputs.bomCost * (financeInputs.mfgCostRatio / 100);
    const unitVariableCost = financeInputs.bomCost + unitMfgCost; 
    
    const totalFixedCost = parseFloat(financeInputs.moldFee) + parseFloat(financeInputs.fixtureFee) + parseFloat(financeInputs.rdLabor) + parseFloat(financeInputs.rdMaterial);
    const unitAmortizedFixed = lifecycleVolume > 0 ? totalFixedCost / lifecycleVolume : 0;
    const unitOpex = financeInputs.price * (financeInputs.opexRatio / 100);
    const unitCostTotal = unitVariableCost + unitAmortizedFixed + unitOpex;
    
    const unitGrossProfit = financeInputs.price - unitVariableCost; 
    const grossMargin = (unitGrossProfit / financeInputs.price) * 100;
    
    const unitNetProfitPreTax = financeInputs.price - unitCostTotal;
    const unitTax = unitNetProfitPreTax > 0 ? unitNetProfitPreTax * (financeInputs.taxRate / 100) : 0;
    const unitNetProfit = unitNetProfitPreTax - unitTax;
    const netMargin = (unitNetProfit / financeInputs.price) * 100;

    return { totalMarket, annualVolume, lifecycleVolume, annualRevenue, totalRevenue, unitVariableCost, unitGrossProfit, grossMargin, unitNetProfit, netMargin, totalFixedCost, unitOpex };
  }, [financeInputs, currentProject]);

  // --- 视图组件 ---

  // 1. HomeView: 项目列表 (源码风格)
  const HomeView = () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">汉桑市场数据分析平台</h1>
          <p className="text-gray-500">管理和分析市场数据</p>
        </div>
        <button onClick={() => setIsNewProjectModalOpen(true)} className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition shadow">
          <Plus size={18} /> 新建品类
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="font-bold text-lg mb-4">{p.name}</h3>
            <div className="flex gap-2">
              <button onClick={() => { setCurrentProject(p); setView('detail'); }} className="flex-1 bg-gray-900 text-white py-2 rounded text-sm font-medium">查看详情</button>
              <button onClick={() => { setCurrentProject(p); setView('entry'); }} className="px-4 border rounded text-sm font-medium hover:bg-gray-50">数据录入</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. ProjectCalcView: 财务测算页 (源码风格布局)
  const ProjectCalcView = () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('project_mgr')} className="p-2 bg-white border rounded hover:bg-gray-50"><ChevronLeft size={20}/></button>
        <h1 className="text-xl font-bold">{currentProject?.name} - 财务测算</h1>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧输入区域 */}
        <div className="col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18}/> 销售预估</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">预计市占率 (%)</label>
                <input type="number" value={financeInputs.targetShare} onChange={(e)=>setFinanceInputs({...financeInputs, targetShare: parseFloat(e.target.value)})} className="w-full border rounded p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">产品售价 (元)</label>
                <input type="number" value={financeInputs.price} onChange={(e)=>setFinanceInputs({...financeInputs, price: parseFloat(e.target.value)})} className="w-full border rounded p-2 text-sm" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Briefcase size={18}/> 成本投入</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">BOM 成本 (元)</label>
                <input type="number" value={financeInputs.bomCost} onChange={(e)=>setFinanceInputs({...financeInputs, bomCost: parseFloat(e.target.value)})} className="w-full border rounded p-2 text-sm" />
              </div>
              {['moldFee', 'fixtureFee', 'rdLabor', 'rdMaterial'].map(key => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{key} (元)</label>
                  <input type="number" value={(financeInputs as any)[key]} onChange={(e)=>setFinanceInputs({...financeInputs, [key]: parseFloat(e.target.value)})} className="w-full border rounded p-2 text-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 右侧指标区域 */}
        <div className="col-span-5">
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-900 sticky top-8">
            <h3 className="font-bold text-lg mb-6 border-b pb-4">核心指标分析</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-dashed"><span className="text-gray-500">预估年销量</span><span className="font-bold">{financeMetrics.annualVolume.toLocaleString()} 台</span></div>
              <div className="flex justify-between py-2 border-b border-dashed"><span className="text-gray-500">单台售价</span><span>¥{financeInputs.price.toFixed(2)}</span></div>
              <div className="flex justify-between py-2 border-b border-dashed text-green-600 font-bold"><span className="text-gray-500">单台毛利</span><span>¥{financeMetrics.unitGrossProfit.toFixed(2)}</span></div>
              <div className="flex justify-between py-2 border-b border-dashed text-green-600 font-bold"><span className="text-gray-500">毛利率 (%)</span><span>{financeMetrics.grossMargin.toFixed(2)}%</span></div>
              <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg">
                <div className="flex justify-between items-center mb-2"><span className="text-gray-400 text-sm">税后净利率</span><span className="text-2xl font-bold">{financeMetrics.netMargin.toFixed(2)}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">单台净利</span><span className="text-lg font-bold text-blue-400">¥{financeMetrics.unitNetProfit.toFixed(2)}</span></div>
              </div>
            </div>
            <button onClick={() => alert('已保存')} className="w-full mt-6 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"><Save size={18}/> 保存测算数据</button>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. ProjectDetailView: 项目详情与标签切换 (源码风格)
  const ProjectDetailView = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-2 border rounded hover:bg-gray-50"><ChevronLeft size={16}/></button>
          <h2 className="font-bold text-lg">{currentProject?.name}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('entry')} className="bg-black text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-gray-800 transition"><Plus size={14}/> 录入数据</button>
          <button onClick={() => setView('project_mgr')} className="border px-4 py-2 rounded text-sm flex items-center gap-2 bg-white hover:bg-gray-50"><Briefcase size={14}/> 项目管理</button>
        </div>
      </div>
      <div className="bg-white border-b px-8 shadow-sm z-20 sticky top-[65px]">
        <div className="flex gap-8">
          {[
            {id: 'market', label: '市场大盘', icon: TrendingUp},
            {id: 'compete', label: '竞争分析', icon: Users},
            {id: 'category', label: '细分品类', icon: PieIcon},
            {id: 'summary', label: '汇总统计', icon: FileText},
            {id: 'manage', label: '管理', icon: Settings}
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}><tab.icon size={16}/> {tab.label}</button>
          ))}
        </div>
      </div>
      <div className="p-8 max-w-[1600px] mx-auto">
        {activeTab === 'manage' ? (
          <div className="bg-white p-8 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-6 pb-6 border-b">
              <h3 className="font-bold text-lg">细分品类管理</h3>
              <button onClick={() => setIsCategoryManageModalOpen(true)} className="bg-black text-white px-4 py-2 rounded text-sm">管理品类</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {subCategories.map(cat => (
                <div key={cat.id} className="border p-4 rounded bg-gray-50">
                  <span className="font-bold block mb-1">{cat.name}</span>
                  <p className="text-gray-500 text-sm">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded border border-dashed flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
            <TrendingUp size={48} className="mb-4 opacity-20"/>
            <p>此处展示 {activeTab} 视图内容</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-900 antialiased selection:bg-black selection:text-white">
      {view === 'home' && <HomeView />}
      {view === 'detail' && <ProjectDetailView />}
      {view === 'project_mgr' && (
        <div className="p-8 bg-gray-50 min-h-screen">
          <button onClick={() => setView('detail')} className="bg-white p-2 rounded border mb-6 flex items-center gap-2 hover:bg-gray-50"><ChevronLeft size={20}/> 返回项目</button>
          <div className="bg-white rounded-lg shadow-sm p-8 border max-w-md">
            <h3 className="text-xl font-bold mb-6">{currentProject?.name}</h3>
            <button onClick={() => setView('project_calc')} className="w-full bg-gray-900 text-white py-3 rounded font-bold hover:bg-black transition flex items-center justify-center gap-2"><Calculator size={20}/> 进入财务测算模型</button>
          </div>
        </div>
      )}
      {view === 'project_calc' && <ProjectCalcView />}
      
      {/* 数据录入与管理页面简单返回逻辑 */}
      {['entry', 'data_mgr'].includes(view) && (
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold mb-4">当前视图: {view}</h2>
          <button className="bg-black text-white px-4 py-2 rounded" onClick={() => setView('detail')}>返回项目</button>
        </div>
      )}

      {/* 新建项目 Modal */}
      <Modal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} title="新建品类项目">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">项目名称</label><input className="w-full border rounded p-2" placeholder="输入名称..." /></div>
          <div><label className="block text-sm font-medium mb-1">预计市场容量</label><input className="w-full border rounded p-2" placeholder="数字..." /></div>
        </div>
      </Modal>
    </div>
  );
}