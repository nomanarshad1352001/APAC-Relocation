import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import Icon, { type IconName } from '../ui/Icon';
import { useCollection } from '../../store/SiteDataContext';
import { revenueData, leadFunnel, destinationBreakdown, seedShipments, seedClients, seedActivity, type Shipment, type Client } from '../../store/dashboardData';

const kpis: { label: string; value: string; change: string; up: boolean; icon: IconName; color: string }[] = [
  { label: 'Monthly Revenue', value: '$45,300', change: '+12.4%', up: true, icon: 'money', color: 'bg-blue-50 text-blue-600' },
  { label: 'Active Shipments', value: '4', change: '+2', up: true, icon: 'anchor', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'New Leads', value: '12', change: '+33%', up: true, icon: 'user', color: 'bg-purple-50 text-purple-600' },
  { label: 'Quote Conversion', value: '65%', change: '+5%', up: true, icon: 'chart', color: 'bg-amber-50 text-amber-600' },
  { label: 'Avg. Move Value', value: '$6,533', change: '-2.1%', up: false, icon: 'card', color: 'bg-rose-50 text-rose-600' },
  { label: 'NPS Score', value: '92', change: '+3', up: true, icon: 'star', color: 'bg-cyan-50 text-cyan-600' },
];

const activityIcon: Record<string, IconName> = {
  shipment: 'anchor', client: 'user', invoice: 'money', system: 'chart',
  anchor: 'anchor', user: 'user', money: 'money', package: 'package', camera: 'camera', chart: 'chart', check: 'check', home: 'home',
};

const modeIcons: Record<string, IconName> = { sea: 'anchor', air: 'plane', combo: 'layers' };

const statusColor: Record<string, string> = {
  survey: 'bg-blue-100 text-blue-700',
  packing: 'bg-amber-100 text-amber-700',
  'in-transit': 'bg-purple-100 text-purple-700',
  customs: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function OverviewTab() {
  const { items: shipments } = useCollection<Shipment>('dash_shipments', seedShipments);
  const { items: clients } = useCollection<Client>('dash_clients', seedClients);
  const activeShipments = shipments.filter((s) => s.status !== 'delivered');

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center mb-3`}><Icon name={kpi.icon} size={18} /></div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
            <div className={`text-xs font-semibold mt-1 ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
              {kpi.up ? '↑' : '↓'} {kpi.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Revenue & Moves</h3>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Moves</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Funnel */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Lead Funnel</h3>
          <p className="text-xs text-gray-500 mb-4">Conversion pipeline</p>
          <div className="space-y-3">
            {leadFunnel.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{stage.stage}</span>
                  <span className="font-bold text-gray-900">{stage.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.count / leadFunnel[0].count) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Shipments */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Active Shipments</h3>
          <p className="text-xs text-gray-500 mb-4">{activeShipments.length} in progress</p>
          <div className="space-y-3">
            {activeShipments.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Icon name={modeIcons[s.mode] || 'anchor'} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">{s.clientName}</div>
                  <div className="text-[10px] text-gray-500 truncate">{s.origin} → {s.destination}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[s.status]}`}>{s.status}</span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1.5">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Destinations</h3>
          <p className="text-xs text-gray-500 mb-4">Move distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={destinationBreakdown} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="city" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={90} />
              <Bar dataKey="pct" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Activity Feed</h3>
          <p className="text-xs text-gray-500 mb-4">Recent updates</p>
          <div className="space-y-3 max-h-[240px] overflow-y-auto">
            {seedActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600"><Icon name={activityIcon[a.icon] || activityIcon[a.type] || 'chart'} size={15} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-relaxed">{a.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Clients</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Route</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Move Date</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Value</th>
              </tr>
            </thead>
            <tbody>
              {clients.slice(0, 6).map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{c.avatar}</div>
                      <div><div className="font-semibold text-gray-900 text-xs">{c.name}</div><div className="text-[10px] text-gray-500">{c.email}</div></div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-600 hidden sm:table-cell">{c.origin} → {c.destination}</td>
                  <td className="py-3 px-3 text-xs text-gray-600 hidden md:table-cell">{c.moveDate}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.status === 'completed' ? 'bg-green-100 text-green-700' :
                      c.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      c.status === 'quoted' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{c.status}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-900 text-xs">{c.value ? `$${c.value.toLocaleString()}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
