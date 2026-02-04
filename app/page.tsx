"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, Database, Trash2, ChevronLeft, Settings, Search, Filter, 
  TrendingUp, Calculator, DollarSign, Target, ChevronRight, 
  BarChart3, LineChart, FileText, Layout, PieChart as PieIcon,
  Layers, ArrowUpRight, CheckCircle, Edit, Trash, Save, Play
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart as ReLine, Line, Cell,
  PieChart as RePie, Pie
} from 'recharts';

// --- Supabase 配置 ---
const supabaseUrl = 'https://cwjpyqyknllirbydahxl.supabase.co';
const supabaseKey = 'sb_secret_ifUnQwUmABOku2N9ShmgTQ_9ar2HBJ3'; // 替换为你的实际 Key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HansangUltimateSystem() {
  // --- 状态管理 ---
  const [activeView, setActiveView] = useState<'analytics' | 'project' | 'input' | 'manage'>('analytics');
  const [activeTab, setActiveTab] = useState('市场大盘');
  const [activeProject, setActiveProject] = useState('电竞类电脑多媒体音箱');
  const [summaryView, setSummaryView] = useState<'category' | 'price'>('category');
  
  // 核心数据状态
  const [categories, setCategories] = useState(['一体式', '分体式', '回音壁', '便携式']);
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<any[]>([]);

  // 财务决策模型状态 (精准复刻)
  const [fm, setFm] = useState({
    taoSales: 149655,
    taoShare: 30,
    projectShare: 5,
    price: 1000,
    lifecycle: 36,
    bom: 400,
    mfgType: 'ratio' as 'ratio' | 'fixed', 
    mfgVal: 10, // 比例或固定金额
    opexRate: 15,
    taxRate: 25,
    investment: 1500000
  });

  // --- 1. 自动解析逻辑 (核心算法) ---
  const processRawData = () => {
    const lines = rawText.split('\n');
    const newItems = lines.map((line, index) => {
      const parseValue = (val: string) => {
        if (val.includes('~')) {
          const parts = val.split('~').map(p => parseValue(p));
          return (parts[0] + parts[1]) / 2;
        }
        let num = parseFloat(val.replace(/,/g, '').replace(/[^\d.]/g, ''));
        if (val.includes('万')) num *= 10000;
        return num || 0;
      };

      // 简单模拟解析匹配，实际应用可根据生意参谋格式增强
      return {
        id: Date.now() + index,
        title: line.split('\t')[0] || '未知商品',
        price: parseValue(line.match(/\d+~\d+|\d+元/)?.[0] || '0'),
        buyers: parseValue(line.match(/[\d.]+万|[\d,]+/)?.[0] || '0'),
        category: categories[0]
      };
    });
    setParsedData([...parsedData, ...newItems]);
    setActiveView('analytics');
  };

  // --- 2. 财务核心计算 (JS表达式绑定) ---
  const finance = useMemo(() => {
    const totalMarketTao = fm.taoSales;
    const totalMarketEst = fm.taoSales / (fm.taoShare / 100);
    const totalQtyLC = totalMarketEst * (fm.projectShare / 100);
    const annualQty = totalQtyLC / (fm.lifecycle / 12);
    const totalRev = totalQtyLC * fm.price;
    
    const mfgCost = fm.mfgType === 'ratio' ? fm.bom * (fm.mfgVal / 100) : fm.mfgVal;
    const uvc = fm.bom + mfgCost;
    const unitInvest = fm.investment / totalQtyLC;
    const unitOpex = fm.price * (fm.opexRate / 100);
    
    const unitGross = fm.price - uvc;
    const grossRate = (unitGross / fm.price) * 100;
    
    const preTax = unitGross - unitInvest - unitOpex;
    const tax = preTax > 0 ? preTax * (fm.taxRate / 100) : 0;
    const unitNet = preTax - tax;
    const netRate = (unitNet / fm.price) * 100;

    return { totalMarketEst, totalQtyLC, annualQty, totalRev, unitGross, grossRate, unitNet, netRate, uvc, unitInvest, unitOpex, preTax };
  }, [fm]);

  // --- 3. Supabase 数据持久化 ---
  const saveToCloud = async () => {
    const { error } = await supabase.from('projects').upsert({
      project_name: activeProject,
      finance_config: fm,
      updated_at: new Date()
    });
    if (!error) alert("数据已同步至 Supabase 云端");
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased selection:bg-blue-100">
      
      {/* --- 左侧导航栏 --- */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8 pb-10">
          <h1 className="text-2xl font-black italic tracking-tighter">HANSANG <span className="text-blue-600 font-normal">AI</span></h1>
        </div>
        <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">我的品类项目</p>
          {['电竞类电脑多媒体音箱', 'AI耳机', '黑胶唱片机', '蓝牙音箱'].map(proj => (
            <button key={proj} onClick={() => setActiveProject(proj)}
              className={`w-full text-left px-5 py-4 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-between group ${activeProject === proj ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}>
              {proj} <ChevronRight size={14} className={activeProject === proj ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </nav>
        <div className="p-6">
          <button onClick={() => setActiveView('manage')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
            <Plus size={16} strokeWidth={3} /> 新建品类
          </button>
        </div>
      </aside>

      {/* --- 主内容区 --- */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-50 px-10 pt-10 sticky top-0 z-[100]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black italic">{activeProject}</h2>
              <div className="flex gap-4 mt-3"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Hansang Decision Intelligence</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActiveView('input')} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white transition"><Database size={20}/></button>
              <button onClick={saveToCloud} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"><Save size={14}/> 保存测算结果</button>
            </div>
          </div>
          
          <div className="flex gap-10">
            {['市场大盘', '竞争分析', '细分品类', '汇总统计', '管理'].map(tab => (
              <button key={tab} onClick={() => {setActiveTab(tab); setActiveView('analytics');}}
                className={`pb-5 text-sm font-black transition-all border-b-[3px] ${activeTab === tab && activeView === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-300 hover:text-slate-600'}`}>
                {tab}
              </button>
            ))}
            <button onClick={() => setActiveView('project')} className={`pb-5 text-sm font-black transition-all border-b-[3px] ${activeView === 'project' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-300'}`}>项目决策模型</button>
          </div>
        </header>

        <main className="p-10">
          
          {/* 1. 市场大盘 - 还原图表与同比增长卡片 */}
          {activeView === 'analytics' && activeTab === '市场大盘' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-end gap-6 overflow-x-auto">
                {['开始月份', '结束月份', '价格区间', '细分品类'].map(f => (
                  <div key={f} className="min-w-[150px]">
                    <label className="text-[10px] font-black text-slate-300 uppercase block mb-2">{f}</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] font-bold text-slate-600 flex justify-between items-center cursor-pointer">全部 <Filter size={12}/></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[
                  {t: '销售额', v: '¥ 4.2亿', g: '+29.1%'},
                  {t: '购买人数', v: '128.4万', g: '-2.4%'},
                  {t: '转化率', v: '3.42%', g: '+1.2%'},
                  {t: '平均客单价', v: '¥ 328', g: '+15.8%'},
                ].map(s => (
                  <div key={s.t} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{s.t}趋势</p>
                    <div className="flex justify-between items-end"><h4 className="text-3xl font-black italic tracking-tighter">{s.v}</h4><span className={`text-xs font-black ${s.g.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{s.g}</span></div>
                    <div className="h-12 mt-6 bg-slate-50 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. 汇总统计 - 进度条占比还原 */}
          {activeView === 'analytics' && activeTab === '汇总统计' && (
             <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
                <div className="p-8 border-b flex justify-between items-center">
                   <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                      <button onClick={()=>setSummaryView('category')} className={`px-4 py-2 rounded-lg text-xs font-black ${summaryView==='category'?'bg-white text-blue-600 shadow-sm':'text-slate-400'}`}>品类汇总</button>
                      <button onClick={()=>setSummaryView('price')} className={`px-4 py-2 rounded-lg text-xs font-black ${summaryView==='price'?'bg-white text-blue-600 shadow-sm':'text-slate-400'}`}>价格汇总</button>
                   </div>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr><th className="px-10 py-6">维度</th><th className="px-10 py-6">销售额</th><th className="px-10 py-6">占比</th><th className="px-10 py-6">转化率</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {categories.map((cat, i) => (
                      <tr key={cat} className="hover:bg-slate-50/50 transition font-black">
                        <td className="px-10 py-6 italic">{cat}</td>
                        <td className="px-10 py-6 text-slate-500">¥ 2,450,000</td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{width: `${80-i*20}%`}}></div></div>
                              <span className="text-[11px]">{80-i*20}%</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-blue-600">4.5%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

          {/* 3. 财务决策 - 黑色卡片+公式绑定像素复刻 */}
          {activeView === 'project' && (
            <div className="flex flex-col lg:flex-row gap-10 animate-in slide-in-from-right-4">
              <div className="flex-1 space-y-8">
                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                  <h3 className="text-lg font-black italic mb-10 flex items-center gap-3"><Target className="text-blue-600" size={24}/> 市场与销售预估</h3>
                  <div className="grid grid-cols-2 gap-10">
                    {['taoShare', 'projectShare', 'price', 'lifecycle'].map(key => (
                      <div key={key}>
                        <label className="text-[10px] font-black text-slate-400 uppercase block mb-3">{key === 'price' ? '建议售价 (元)' : key}</label>
                        <input type="number" value={(fm as any)[key]} onChange={e=>setFm({...fm, [key]: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black focus:ring-4 ring-blue-500/5 outline-none" />
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm">
                  <h3 className="text-lg font-black italic mb-10 flex items-center gap-3"><DollarSign className="text-blue-600" size={24}/> 投资与运营成本</h3>
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-3">BOM 核心成本 (元)</label>
                      <input type="number" value={fm.bom} onChange={e=>setFm({...fm, bom: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-red-500" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase block mb-3">制造成本模式</label>
                       <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
                          <button onClick={()=>setFm({...fm, mfgType:'ratio'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black ${fm.mfgType==='ratio'?'bg-white shadow-sm text-blue-600':'text-slate-400'}`}>比例估算</button>
                          <button onClick={()=>setFm({...fm, mfgType:'fixed'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black ${fm.mfgType==='fixed'?'bg-white shadow-sm text-blue-600':'text-slate-400'}`}>经验固定值</button>
                       </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* 右侧黑色清单 - 精准复刻颜色方案 */}
              <div className="w-full lg:w-[500px]">
                <div className="bg-[#0F172A] text-white p-12 rounded-[4rem] shadow-2xl sticky top-24">
                  <h3 className="text-xl font-black italic border-b border-white/5 pb-8 mb-10 uppercase flex justify-between items-center tracking-tighter">Financial ROI Analysis <Calculator className="text-blue-500" size={20}/></h3>
                  
                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest"><span>预估总销量</span><span className="text-white">{Math.round(finance.totalQtyLC).toLocaleString()} 台</span></div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest"><span>预估年营收额</span><span className="text-white">¥ {(finance.totalRev / (fm.lifecycle/12)).toLocaleString()}</span></div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex justify-between items-end border-b border-white/5 pb-8">
                      <span className="text-xs font-black text-slate-400 uppercase">单台毛利润 (UVP)</span>
                      <span className="text-4xl font-black italic text-green-400">¥ {finance.unitGross.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-8">
                      <span className="text-xs font-black text-slate-400 uppercase">毛利率</span>
                      <span className="text-4xl font-black italic text-green-400">{finance.grossRate.toFixed(1)}%</span>
                    </div>
                    <div className="pt-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">最终净利率预估 (NET PROFIT MARGIN)</p>
                      <div className="text-[85px] font-black italic tracking-tighter leading-none text-blue-500">
                        {finance.netRate.toFixed(1)}<span className="text-2xl font-black ml-1">%</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={saveToCloud} className="w-full mt-14 bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition transform active:scale-95">同步数据至 Supabase 云端库</button>
                </div>
              </div>
            </div>
          )}

          {/* 4. 数据录入 - 带自动解析功能 */}
          {activeView === 'input' && (
            <div className="max-w-5xl mx-auto py-10 animate-in fade-in">
              <div className="flex items-center gap-6 mb-12">
                <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100"><FileText size={40}/></div>
                <div><h2 className="text-4xl font-black italic uppercase">Parsing Engine</h2><p className="text-slate-400 font-bold mt-1">自动处理“万/区间/百分比”数据</p></div>
              </div>
              <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
                <textarea value={rawText} onChange={(e)=>setRawText(e.target.value)}
                  className="w-full h-96 bg-slate-50 border-none rounded-[2.5rem] p-10 text-sm font-mono outline-none ring-offset-4 focus:ring-4 ring-blue-500/5 mb-8"
                  placeholder="粘贴生意参谋原始文本数据..."
                />
                <button onClick={processRawData} className="w-full bg-slate-900 text-white py-7 rounded-[2.5rem] font-black text-2xl italic flex items-center justify-center gap-4 hover:bg-black transition shadow-2xl shadow-slate-200"><Play fill="white" size={24}/> 解析并同步数据</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}