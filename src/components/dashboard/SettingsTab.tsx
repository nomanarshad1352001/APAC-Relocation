import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon, { type IconName } from '../ui/Icon';

export default function SettingsTab() {
  const [company, setCompany] = useState({
    name: 'APAC Relocation Pte Ltd',
    email: 'contact@apacrelocation.com',
    phone: '+65 6520 1914',
    address: '10 Anson Road, #21-08, International Plaza, Singapore 079903',
    website: 'www.apacrelocation.com',
    fmcLicense: '028XXX-NF',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    shipmentUpdates: true,
    leadNotifications: true,
    invoiceReminders: true,
    weeklyReport: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div><h2 className="text-xl font-bold text-gray-900">Settings</h2><p className="text-sm text-gray-500">Manage your account and preferences</p></div>

      {/* Company Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Company Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label><input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Email</label><input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Phone</label><input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Website</label><input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Address</label><input value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">FMC License</label><input value={company.fmcLicense} onChange={(e) => setCompany({ ...company, fmcLicense: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-xs text-gray-500">Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}</div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !val })}
                className={`w-11 h-6 rounded-full transition-colors relative ${val ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${val ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Integrations</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            { name: 'Stripe', desc: 'Payment processing', icon: 'card' as IconName, connected: true },
            { name: 'WhatsApp Business', desc: 'Client messaging', icon: 'chat' as IconName, connected: true },
            { name: 'Google Analytics', desc: 'Website analytics', icon: 'chart' as IconName, connected: true },
            { name: 'Slack', desc: 'Team notifications', icon: 'bell' as IconName, connected: false },
            { name: 'QuickBooks', desc: 'Accounting sync', icon: 'clipboard' as IconName, connected: false },
            { name: 'Zapier', desc: 'Workflow automation', icon: 'sparkle' as IconName, connected: false },
          ]).map((int) => (
            <div key={int.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center"><Icon name={int.icon} size={17} /></div>
              <div className="flex-1"><div className="text-sm font-semibold text-gray-900">{int.name}</div><div className="text-[10px] text-gray-500">{int.desc}</div></div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${int.connected ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {int.connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-red-200">
        <h3 className="text-sm font-bold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-xs text-gray-500 mb-4">Irreversible actions for your account</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-red-100 text-red-700 text-xs font-semibold rounded-xl hover:bg-red-200 transition-colors">Export All Data</button>
          <button className="px-4 py-2 bg-red-100 text-red-700 text-xs font-semibold rounded-xl hover:bg-red-200 transition-colors">Reset Dashboard</button>
        </div>
      </motion.div>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
