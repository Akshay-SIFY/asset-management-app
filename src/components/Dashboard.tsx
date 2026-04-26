import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin,
  TrendingUp
} from 'lucide-react';
import { Asset } from '@/src/types';

interface DashboardProps {
  assets: Asset[];
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1d4ed8'];

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  // Stats calculations
  const totalAssets = assets.length;
  const verifiedAssets = assets.filter(a => a.verification_status === 'Verified').length;
  const pendingVerification = assets.filter(a => a.verification_status === 'Pending Verification').length;
  const mismatchFound = assets.filter(a => a.verification_status === 'Mismatch Found').length;

  // Type Chart Data
  const typeData = Object.entries(
    assets.reduce((acc, obj) => {
      acc[obj.type] = (acc[obj.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Status Chart Data
  const statusData = Object.entries(
    assets.reduce((acc, obj) => {
      acc[obj.verification_status] = (acc[obj.verification_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number }));

  // Location Data
  const locationData = Object.entries(
    assets.reduce((acc, obj) => {
      acc[obj.location] = (acc[obj.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const stats = [
    { label: 'Total Assets', value: totalAssets, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified', value: verifiedAssets, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: pendingVerification, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Mismatch', value: mismatchFound, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <div className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", stat.bg, stat.color)}>
                  {stat.value > 0 ? '+ Live' : 'Idle'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-800">Assets by Type</h4>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Hardware Audit</span>
          </div>
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[2, 2, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-800">Compliance Overview</h4>
            <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
          </div>
          <div className="p-6 flex flex-col sm:flex-row items-center gap-8 h-full">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-slate-900">{verifiedAssets}</span>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Verified</p>
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
               {statusData.slice(0, 3).map((item, idx) => (
                 <div key={item.name} className="space-y-1">
                   <div className="flex justify-between text-[11px]">
                     <span className="font-semibold text-slate-700">{item.name}</span>
                     <span className="text-slate-400 font-mono">{item.value} Units</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${totalAssets > 0 ? (item.value / totalAssets) * 100 : 0}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Locations Summary */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Location Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {locationData.map((loc, i) => (
            <div key={loc.name} className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <MapPin className="w-5 h-5 text-slate-400 mb-2" />
              <span className="text-xs text-slate-500 text-center font-medium truncate w-full">{loc.name}</span>
              <span className="text-lg font-bold text-blue-700">{loc.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { cn } from '@/src/lib/utils';
