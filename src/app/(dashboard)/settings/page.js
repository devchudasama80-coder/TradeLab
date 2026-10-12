'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Sliders,
  Key,
  Bell,
  Save,
  Check,
  Lock,
  Cpu,
  DollarSign,
  Percent,
  AlertCircle,
  Database,
  Webhook,
  Activity
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Quant Trader',
    email: 'trader@tradelab.io',
    role: 'Quantitative Strategy Developer',
    experience: 'Intermediate (2-5 yrs)',
    timezone: 'UTC (GMT+00:00)'
  });

  const [riskDefaults, setRiskDefaults] = useState({
    initialCapital: 10000,
    riskPerTrade: 1.0,
    stopLossPct: 1.5,
    takeProfitPct: 3.0,
    feeRate: 0.1,
    slippagePct: 0.05,
    defaultPair: 'BTC/USD',
    defaultTimeframe: '1h'
  });

  const [apiKeys, setApiKeys] = useState({
    binanceApiKey: 'vmPUAZ6m89vXyZ5k7a8N3b9c0d1e2f3g4h5i6j7k8l9m0',
    binanceSecretKey: '••••••••••••••••••••••••••••••••••••••••',
    webhookUrl: 'https://tradelab.io/api/v1/webhooks/signals/live-alert',
    enableWebhooks: true
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  });

  const [system, setSystem] = useState({
    chartType: 'candlestick',
    soundAlerts: true,
    autoSaveBacktests: true,
    compactLogView: false
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setProfile((prev) => ({
              ...prev,
              name: data.user.name || prev.name,
              email: data.user.email || prev.email
            }));
          }
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name
        })
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'risk', label: 'Engine & Risk Defaults', icon: Sliders },
    { id: 'api', label: 'API Keys & Webhooks', icon: Key },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'system', label: 'System Preferences', icon: Cpu }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FC]">
            Platform Settings
          </h1>
          <p className="text-xs text-[#8B949E] mt-1">
            Configure algorithmic engine defaults, API connections, and account risk parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#07090E] px-5 py-2 rounded-lg font-bold text-xs shadow-md hover:brightness-110 disabled:opacity-50 transition-all"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-[#07090E] border-t-transparent rounded-full animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-[#07090E]" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : savedSuccess ? 'Settings Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1E2638] text-[#F59E0B] border-l-2 border-[#F59E0B]'
                    : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#0D111A]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-[#8B949E]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-6 space-y-6"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-[#F0F6FC] flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#F59E0B]" />
                    <span>Profile Details</span>
                  </h2>
                  <p className="text-xs text-[#8B949E] mt-0.5">
                    Personal specifications attached to backtest logs and performance reports.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs text-[#8B949E] opacity-70 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Trading Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Experience Level</label>
                    <select
                      value={profile.experience}
                      onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3 py-2 text-xs text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    >
                      <option value="Beginner (< 1 yr)">Beginner (&lt; 1 yr)</option>
                      <option value="Intermediate (2-5 yrs)">Intermediate (2-5 yrs)</option>
                      <option value="Professional / Quant (5+ yrs)">Professional / Quant (5+ yrs)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-[#F0F6FC] flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-[#F59E0B]" />
                    <span>Engine Default Risk Parameters</span>
                  </h2>
                  <p className="text-xs text-[#8B949E] mt-0.5">
                    These rules auto-populate whenever you open the Backtester page.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5 flex items-center space-x-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Default Initial Capital ($)</span>
                    </label>
                    <input
                      type="number"
                      value={riskDefaults.initialCapital}
                      onChange={(e) => setRiskDefaults({ ...riskDefaults, initialCapital: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs font-mono text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5 flex items-center space-x-1">
                      <Percent className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Default Risk Per Trade (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={riskDefaults.riskPerTrade}
                      onChange={(e) => setRiskDefaults({ ...riskDefaults, riskPerTrade: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs font-mono text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Default Stop-Loss (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={riskDefaults.stopLossPct}
                      onChange={(e) => setRiskDefaults({ ...riskDefaults, stopLossPct: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs font-mono text-[#EF4444] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Default Take-Profit (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={riskDefaults.takeProfitPct}
                      onChange={(e) => setRiskDefaults({ ...riskDefaults, takeProfitPct: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs font-mono text-[#10B981] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Fee Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={riskDefaults.feeRate}
                      onChange={(e) => setRiskDefaults({ ...riskDefaults, feeRate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs font-mono text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Slippage (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={riskDefaults.slippagePct}
                      onChange={(e) => setRiskDefaults({ ...riskDefaults, slippagePct: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs font-mono text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-[#F0F6FC] flex items-center space-x-2">
                    <Key className="w-4 h-4 text-[#F59E0B]" />
                    <span>Exchange API Keys & Signal Webhooks</span>
                  </h2>
                  <p className="text-xs text-[#8B949E] mt-0.5">
                    Connect real-time market data providers or send execution webhooks to live brokers.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-[#07090E] border border-[#1E2638] rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F0F6FC]">Binance Market Data Pipeline</div>
                        <div className="text-[10px] text-[#10B981] font-mono flex items-center space-x-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                          <span>Connected & Streaming OHLCV Data</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-mono px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Binance API Key (Read-Only Public Access)</label>
                    <input
                      type="text"
                      value={apiKeys.binanceApiKey}
                      onChange={(e) => setApiKeys({ ...apiKeys, binanceApiKey: e.target.value })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs font-mono text-[#8B949E] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Webhook Dispatch URL</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={apiKeys.webhookUrl}
                        onChange={(e) => setApiKeys({ ...apiKeys, webhookUrl: e.target.value })}
                        className="flex-1 bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs font-mono text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                      />
                      <button
                        onClick={handleSave}
                        className="bg-[#1E2638] border border-[#1E2638] hover:border-[#F59E0B]/40 text-[#F0F6FC] px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                      >
                        Ping Webhook
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-[#F0F6FC] flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#F59E0B]" />
                    <span>Security & Access Control</span>
                  </h2>
                  <p className="text-xs text-[#8B949E] mt-0.5">
                    Manage authentication secrets and JWT session security.
                  </p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={security.currentPassword}
                      onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={security.newPassword}
                      onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                      className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg px-3.5 py-2 text-xs text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between p-3 bg-[#07090E] border border-[#1E2638] rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-[#F0F6FC]">Two-Factor Authentication (2FA)</div>
                      <div className="text-[10px] text-[#8B949E]">Enforce TOTP authenticator app on login</div>
                    </div>
                    <button
                      onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                      className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                        security.twoFactorEnabled ? 'bg-[#10B981]' : 'bg-[#1E2638]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-[#F0F6FC] flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-[#F59E0B]" />
                    <span>System Preferences & Display</span>
                  </h2>
                  <p className="text-xs text-[#8B949E] mt-0.5">
                    Customize your trading terminal environment and audio alerts.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#07090E] border border-[#1E2638] rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-[#F0F6FC]">Audio Execution Alerts</div>
                      <div className="text-[10px] text-[#8B949E]">Play subtle chime when backtest finishes</div>
                    </div>
                    <button
                      onClick={() => setSystem({ ...system, soundAlerts: !system.soundAlerts })}
                      className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                        system.soundAlerts ? 'bg-[#F59E0B]' : 'bg-[#1E2638]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          system.soundAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#07090E] border border-[#1E2638] rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-[#F0F6FC]">Auto-Save Backtest Engine Runs</div>
                      <div className="text-[10px] text-[#8B949E]">Log every backtest execution to local session history</div>
                    </div>
                    <button
                      onClick={() => setSystem({ ...system, autoSaveBacktests: !system.autoSaveBacktests })}
                      className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                        system.autoSaveBacktests ? 'bg-[#F59E0B]' : 'bg-[#1E2638]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          system.autoSaveBacktests ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#1E2638] flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#07090E] px-4 py-2 rounded-lg font-bold text-xs shadow-md hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#07090E] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{saving ? 'Saving...' : 'Save Category Settings'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}