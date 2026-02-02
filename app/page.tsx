"use client";
import React, { useState } from 'react';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, X,
  BarChart3, PieChart, Table, Play, Save, Package, Search, Edit3, Download
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend 
} from 'recharts';

export default function MarketApp() {
  // 视图状态：home(首页), detail(分析页), input(录入), projectList(项目列表), projectCreate(创建项目), projectDetail(项目测算)
  const [view, setView] = useState<'home' | 'detail' | 'input' | 'projectList' | 'projectCreate' | 'projectDetail'>('home');
  const [activeTab, setActiveTab] = useState('市场大盘');
  
  // 弹窗状态
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showManageSubCategory, setShowManageSubCategory] = useState(false);

  // 模拟数据状态
  const [subCategories, setSubCategories] = useState([
    { id: 1, name: '一体式', desc: '条形或矩形的单个电竞音箱' },
    { id: 2, name: '分体式', desc: '两个或多个音箱' }
  ]);

  // --- 1. 通用组件：弹窗基础 ---
  const Modal = ({ title, isOpen, onClose, children }: any) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  // --- 2. 首页逻辑 (含新建品类弹窗) ---
  const HomeView = () => (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">市场数据分析平台</h1>
          <p className="text-slate-500 mt-2">管理和分析市场数据</p>
        </div>
        <button 
          onClick={() => setShowAddCategory(true)}
          className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition"
        >
          <Plus size={20} /> 新建品类
        </button>
      </div>
      
      {/* 品类卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['黑胶唱片机', 'AI耳机', '蓝牙耳机', '电竞类电脑多媒体音箱'].map((item) => (
          <div key={item} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between mb-8"><h3 className="font-bold text-lg">{item}</h3><span className="text-[10px] bg-slate-100 px-2 py-1 rounded">有数据</span></div>
            <div className="flex gap-2">
              <button onClick={() => setView('detail')} className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-bold">查看详情</button>
              <button onClick={() => setView('input')} className="flex-1 border py-2 rounded-lg text-sm font-medium">录入数据</button>
              <button className="p-2 border rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* 新建品类弹窗 */}
      <Modal title="创建新品类" isOpen={showAddCategory} onClose={() => setShowAddCategory(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">品类名称</label>
            <input type="text" placeholder="例如：蓝牙音箱" className="w-full border rounded-lg p-3 outline-none focus:ring-2 ring-black/5" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">描述 (可选)</label>
            <textarea placeholder="品类的详细描述..." className="w-full border rounded-lg p-3 h-24 outline-none focus:ring-2 ring-black/5" />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowAddCategory(false)} className="flex-1 py-3 border rounded-xl font-bold">取消</button>
            <button className="flex-1 py-3 bg-black text-white rounded-xl font-bold">创建</button>
          </div>
        </div>
      </Modal>
    </div>
  );

  // --- 3. 详情页 -> 管理标签页逻辑 ---
  const ManagementTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">细分品类管理</h3>
          <p className="text-sm text-slate-400">管理当前品类的细分市场定义</p>
        </div>
        <button onClick={() => setShowManageSubCategory(true)} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <Plus size={16}/> 管理细分品类
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subCategories.map(sub => (
          <div key={sub.id} className="bg-white p-6 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">序号 {sub.id}</span>
            <h4 className="font-bold mt-2">{sub.name}</h4>
            <p className="text-sm text-slate-500 mt-1">{sub.desc}</p>
          </div>
        ))}
      </div>

      {/* 管理细分品类弹窗 (复刻图片内容) */}
      <Modal title="管理细分品类" isOpen={showManageSubCategory} onClose={() => setShowManageSubCategory(false)}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {subCategories.map(sub => (
            <div key={sub.id} className="flex items-center gap-3 p-4 border rounded-xl group">
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400">序号 {sub.id}</div>
                <div className="font-bold">{sub.name}</div>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit3 size={16}/></button>
              <button className="p-2 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={16}/></button>
            </div>
          ))}
          <button className="w-full py-4 border-2 border-dashed rounded-xl text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-50 transition">
            <Plus size={18}/> 添加新细分品类
          </button>
        </div>
        <div className="mt-6">
          <button onClick={() => setShowManageSubCategory(false)} className="w-full py-3 bg-black text-white rounded-xl font-bold">关闭</button>
        </div>
      </Modal>
    </div>
  );

  // --- 4. 项目管理模块 ---
  const ProjectListView = () => (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('detail')} className="p-2 border rounded-full"><ChevronLeft/></button>
        <h2 className="text-2xl font-bold">项目管理</h2>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setView('projectCreate')} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> 创建新项目</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 w-full max-w-sm">
        <h3 className="text-xl font-bold mb-4">电竞音箱</h3>
        <div className="space-y-1 text-sm text-slate-500 mb-6">
          <div>细分市场：200-300元 / 13</div>
          <div>市场总销量：<span className="bg-slate-100 px-2 py-0.5 rounded text-black font-mono">148,480</span></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('projectDetail')} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-bold">查看项目</button>
          <button className="p-2.5 bg-red-500 text-white rounded-lg"><Trash2 size={18}/></button>
        </div>
      </div>
    </div>
  );

  // --- 5. 财务测算详情页 (复刻图片14) ---
  const ProjectFinancialView = () => (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('projectList')} className="p-2 border rounded-full hover:bg-slate-50"><ChevronLeft/></button>
          <div>
            <h2 className="text-xl font-bold">电竞音箱</h2>
            <p className="text-xs text-slate-400 font-medium tracking-wide">项目财务测算</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold bg-white"><Save size={14}/> 保存</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold"><Download size={14}/> 导出</button>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto">
        {/* 左侧输入列 */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-bold mb-4">细分市场选择</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-slate-400 block mb-1">价格区间</label>
                <select className="w-full border rounded-lg p-2 text-sm"><option>200-300元</option></select>
              </div>
              <div><label className="text-xs text-slate-400 block mb-1">细分品类</label>
                <select className="w-full border rounded-lg p-2 text-sm"><option>一体式</option></select>
              </div>
            </div>
          </div>
          {/* 这里可以继续添加成本与投资、运营与税务等输入卡片... */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h4 className="font-bold mb-4">成本与投资</h4>
             <div className="space-y-4">
               <div><label className="text-xs text-slate-400 block mb-1">BOM 成本 (元)</label><input type="number" defaultValue="300" className="w-full border rounded-lg p-2 text-sm"/></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-xs text-slate-400 block mb-1">模具费 (元)</label><input type="number" defaultValue="500000" className="w-full border rounded-lg p-2 text-sm"/></div>
                 <div><label className="text-xs text-slate-400 block mb-1">研发人员成本 (元)</label><input type="number" defaultValue="1000000" className="w-full border rounded-lg p-2 text-sm"/></div>
               </div>
             </div>
          </div>
        </div>

        {/* 右侧结果列 (图片右侧核心指标) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2"><Settings size={20}/> 核心财务指标 (实时计算)</h3>
          <div className="space-y-3">
            {[
              { label: '市场总容量 (淘系)', val: '149,655 台', dim: true },
              { label: '市场总容量 (预估)', val: '498,850 台', bold: true },
              { label: '预估年销售收入', val: '¥24,942,500.00' },
              { label: '单台毛利润', val: '¥644.61', color: 'text-green-600 font-black' },
              { label: '毛利率 (%)', val: '64.46 %', color: 'text-green-600 font-black' },
              { label: '净利率 (%)', val: '37.10 %', color: 'text-blue-600 font-black' }
            ].map((item, idx) => (
              <div key={idx} className={`flex justify-between py-2 border-b border-slate-50 ${item.dim ? 'opacity-50' : ''}`}>
                <span className="text-sm font-medium text-slate-600">{item.label}</span>
                <span className={`text-sm ${item.color || 'text-slate-900 font-mono'}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- 主渲染 ---
  return (
    <div className="min-h-screen text-slate-900 font-sans">
      {view === 'home' && <HomeView />}
      {view === 'input' && <div className="p-20 text-center"><button onClick={()=>setView('home')}>返回</button></div>}
      
      {(view === 'detail') && (
        <div className="min-h-screen">
          {/* 分析页头部 */}
          <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-4"><button onClick={() => setView('home')} className="p-2 border rounded-full"><ChevronLeft/></button>
              <h2 className="text-xl font-bold">电竞类电脑多媒体音箱</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('projectList')} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold hover:bg-slate-50"><Package size={14}/> 项目管理</button>
            </div>
          </div>

          <div className="bg-white border-b px-8 flex gap-8">
            {['市场大盘', '竞争分析', '细分品类', '汇总统计', '管理'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-slate-400'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 max-w-[1400px] mx-auto">
            {activeTab === '管理' ? <ManagementTab /> : <div className="p-20 border-2 border-dashed rounded-3xl text-center text-slate-300 font-bold text-xl">请切换到“管理”或“市场大盘”</div>}
          </div>
        </div>
      )}

      {view === 'projectList' && <ProjectListView />}
      {view === 'projectDetail' && <ProjectFinancialView />}
      
      {/* 创建新项目视图 */}
      {view === 'projectCreate' && (
        <div className="p-8 max-w-3xl mx-auto">
           <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView('projectList')} className="p-2 border rounded-full"><ChevronLeft/></button>
            <h2 className="text-2xl font-bold text-slate-900">创建新项目</h2>
          </div>
          <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h4 className="font-bold text-slate-800 border-b pb-4">项目基本信息</h4>
            <div><label className="text-sm font-bold block mb-1">项目名称</label><input placeholder="例如：2025年高端蓝牙音箱市场进入计划" className="w-full border rounded-xl p-3"/></div>
            <div><label className="text-sm font-bold block mb-1">项目描述 (可选)</label><textarea placeholder="关于这个项目的简要说明" className="w-full border rounded-xl p-3 h-32"/></div>
            <div className="flex gap-4">
               <button onClick={()=>setView('projectList')} className="flex-1 py-3 border rounded-xl font-bold">取消</button>
               <button onClick={()=>setView('projectDetail')} className="flex-1 py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2"><Save size={18}/> 创建并进入项目</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}