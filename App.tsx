import React, { useState, useEffect } from 'react';
import { Wifi, Plus, Smartphone, Zap, Settings, CloudOff, Sparkles, Volume2, Moon, Sun, Bluetooth } from 'lucide-react';
import { PopButton } from './components/NucleoButton';
import { PopCard } from './components/NucleoCard';
import { PopToggle } from './components/NucleoToggle';
import { PopSlider } from './components/NucleoSlider';
import { Profile, ThemeMode, SoundMode, WifiNetwork } from './types';
import { getSmartProfileSuggestion } from './services/geminiService';

// Mock Data
const MOCK_NETWORKS: WifiNetwork[] = [
  { ssid: 'Home_Fiber_5G', signalStrength: 90, isConnected: true },
  { ssid: 'Starbucks_Free_WiFi', signalStrength: 65, isConnected: false },
  { ssid: 'Office_Secure', signalStrength: 80, isConnected: false },
  { ssid: 'Uni_Library', signalStrength: 40, isConnected: false },
];

const INITIAL_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Home Vibes',
    ssid: 'Home_Fiber_5G',
    theme: ThemeMode.LIGHT,
    sound: SoundMode.NORMAL,
    brightness: 60,
    bluetooth: true,
    color: '#A855F7' // Purple
  },
  {
    id: '2',
    name: 'Focus Mode',
    ssid: 'Office_Secure',
    theme: ThemeMode.DARK,
    sound: SoundMode.VIBRATE,
    brightness: 35,
    bluetooth: false,
    color: '#14F195' // Mint
  }
];

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentWifi, setCurrentWifi] = useState<WifiNetwork>(MOCK_NETWORKS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(INITIAL_PROFILES[0].id);

  const [newProfileSsid, setNewProfileSsid] = useState(MOCK_NETWORKS[1].ssid);
  const [newProfileData, setNewProfileData] = useState<Partial<Profile>>({
    theme: ThemeMode.LIGHT,
    sound: SoundMode.NORMAL,
    brightness: 50,
    bluetooth: true,
    name: '',
    color: '#FF5E82'
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  useEffect(() => {
    const match = profiles.find(p => p.ssid === currentWifi.ssid);
    setActiveProfileId(match ? match.id : null);
  }, [currentWifi, profiles]);

  const handleConnect = (network: WifiNetwork) => {
    setCurrentWifi({ ...network, isConnected: true });
    MOCK_NETWORKS.forEach(n => {
      n.isConnected = n.ssid === network.ssid;
    });
  };

  const handleSmartConfig = async () => {
    setIsAiLoading(true);
    setAiReasoning(null);
    try {
      const suggestion = await getSmartProfileSuggestion(newProfileSsid);
      setNewProfileData(prev => ({
        ...prev,
        theme: suggestion.theme,
        sound: suggestion.sound,
        brightness: suggestion.brightness,
        bluetooth: suggestion.bluetooth,
        name: suggestion.reasoning.split(' ')[0] + ' Mode'
      }));
      setAiReasoning(suggestion.reasoning);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveProfile = () => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      ssid: newProfileSsid,
      theme: newProfileData.theme as ThemeMode,
      sound: newProfileData.sound as SoundMode,
      brightness: newProfileData.brightness || 50,
      bluetooth: newProfileData.bluetooth || false,
      color: newProfileData.color || '#FACC15',
      name: newProfileData.name || 'Custom Mode'
    };
    setProfiles([...profiles, newProfile]);
    setIsCreating(false);
    setAiReasoning(null);
  };

  return (
    <div className="min-h-screen pb-20 font-sans selection:bg-pop-secondary selection:text-pop-text">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-pop-base/90 backdrop-blur-md border-b-2 border-pop-border px-4 py-4 mb-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-pop-primary rounded-xl border-2 border-pop-border shadow-hard-sm flex items-center justify-center text-white font-black text-xl rotate-3">
              A
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight text-pop-text">AutoModo</h1>
          </div>
          <div className="flex items-center">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-pop-border rounded-full shadow-hard-sm">
                <Wifi size={16} className={currentWifi.isConnected ? "text-pop-secondary" : "text-gray-400"} />
                <span className="text-xs font-bold uppercase truncate max-w-[80px]">{currentWifi.ssid}</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-8">

        {/* Hero Status */}
        <section>
          <div className="grid grid-cols-1 gap-4">
            <PopCard 
              className="bg-pop-surface" 
              active={!!activeProfileId}
              accentColor={activeProfileId ? profiles.find(p => p.id === activeProfileId)?.color : undefined}
            >
              <div className="flex flex-col items-center text-center py-2">
                <span className="text-xs font-bold uppercase text-gray-500 mb-1">Current Environment</span>
                <span className="text-3xl font-black mb-2">
                   {activeProfileId ? profiles.find(p => p.id === activeProfileId)?.name : 'Manual Mode'}
                </span>
                <span className="px-3 py-1 bg-pop-text text-white rounded-full text-xs font-bold font-mono">
                  {currentWifi.ssid}
                </span>
              </div>
            </PopCard>
          </div>
        </section>

        {/* Profiles List */}
        {!isCreating && (
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="font-black text-xl text-pop-text flex items-center gap-2">
                <Sparkles size={20} className="text-pop-warning fill-current" />
                My Contexts
              </h2>
              <PopButton 
                onClick={() => setIsCreating(true)}
                variant="primary"
                className="px-4 py-2 text-xs"
              >
                <Plus size={16} /> New
              </PopButton>
            </div>

            <div className="grid gap-5">
              {profiles.map(profile => (
                <PopCard 
                  key={profile.id} 
                  title={profile.ssid}
                  accentColor={profile.color}
                  active={activeProfileId === profile.id}
                  onClick={() => {}} // Just for visual feedback
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{profile.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl border-2 border-gray-100">
                      {profile.theme === ThemeMode.DARK ? <Moon size={16} /> : <Sun size={16} />}
                      <span className="text-[10px] font-bold mt-1 uppercase">{profile.theme}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl border-2 border-gray-100">
                      {profile.sound === SoundMode.SILENT ? <CloudOff size={16}/> : <Volume2 size={16} />} 
                      <span className="text-[10px] font-bold mt-1 uppercase">{profile.sound}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl border-2 border-gray-100">
                      <Zap size={16} />
                      <span className="text-[10px] font-bold mt-1">{profile.brightness}%</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl border-2 border-gray-100">
                      <Bluetooth size={16} className={profile.bluetooth ? "text-pop-primary" : "text-gray-400"} />
                      <span className="text-[10px] font-bold mt-1">{profile.bluetooth ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>
                </PopCard>
              ))}
            </div>
          </section>
        )}

        {/* Create Profile View */}
        {isCreating && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <PopCard className="bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-2xl">New Context</h2>
                <button 
                  onClick={() => setIsCreating(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-pop-border hover:bg-red-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* SSID Selector */}
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Target Network</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-white border-2 border-pop-border rounded-xl px-4 py-3 font-bold text-pop-text focus:shadow-hard focus:outline-none transition-shadow"
                      value={newProfileSsid}
                      onChange={(e) => setNewProfileSsid(e.target.value)}
                    >
                      {MOCK_NETWORKS.filter(n => !profiles.find(p => p.ssid === n.ssid)).map(n => (
                        <option key={n.ssid} value={n.ssid}>{n.ssid}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="bg-pop-primary/10 border-2 border-pop-primary border-dashed rounded-xl p-5 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-pop-primary" />
                      <span className="font-black text-sm text-pop-primary uppercase">Gemini Auto-Config</span>
                    </div>
                    <p className="text-sm text-pop-text/80 mb-4 font-medium leading-tight">
                      Let AI guess the best vibe based on the Wi-Fi name.
                    </p>
                    <PopButton 
                      onClick={handleSmartConfig} 
                      variant="primary" 
                      className="w-full text-sm"
                      isLoading={isAiLoading}
                    >
                      Generate Magic Settings
                    </PopButton>
                    {aiReasoning && (
                      <div className="mt-4 text-xs font-bold text-pop-text bg-white p-3 rounded-lg border-2 border-pop-primary/30 shadow-sm">
                        "{aiReasoning}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Profile Name</label>
                  <input 
                    type="text" 
                    value={newProfileData.name}
                    onChange={(e) => setNewProfileData({...newProfileData, name: e.target.value})}
                    placeholder="e.g. Study Grind"
                    className="w-full bg-gray-50 border-2 border-pop-border rounded-xl px-4 py-3 font-bold text-lg focus:bg-white focus:shadow-hard focus:outline-none transition-all placeholder-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Theme</label>
                    <div className="flex flex-col gap-2">
                      {[ThemeMode.LIGHT, ThemeMode.DARK].map(m => (
                        <button
                          key={m}
                          onClick={() => setNewProfileData({...newProfileData, theme: m})}
                          className={`
                            text-left px-4 py-3 border-2 rounded-xl text-xs font-bold uppercase transition-all
                            ${newProfileData.theme === m 
                              ? 'bg-pop-text text-white border-pop-text shadow-hard-sm' 
                              : 'bg-white text-gray-500 border-gray-200 hover:border-pop-border'}
                          `}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Sound</label>
                    <div className="flex flex-col gap-2">
                      {[SoundMode.NORMAL, SoundMode.VIBRATE, SoundMode.SILENT].map(m => (
                        <button
                          key={m}
                          onClick={() => setNewProfileData({...newProfileData, sound: m})}
                          className={`
                            text-left px-4 py-3 border-2 rounded-xl text-xs font-bold uppercase transition-all
                            ${newProfileData.sound === m 
                              ? 'bg-pop-text text-white border-pop-text shadow-hard-sm' 
                              : 'bg-white text-gray-500 border-gray-200 hover:border-pop-border'}
                          `}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <PopSlider 
                  label="Brightness" 
                  value={newProfileData.brightness || 50} 
                  onChange={(val) => setNewProfileData({...newProfileData, brightness: val})}
                />

                <PopToggle 
                  label="Enable Bluetooth" 
                  checked={newProfileData.bluetooth || false} 
                  onChange={(val) => setNewProfileData({...newProfileData, bluetooth: val})} 
                />

                <div className="pt-4">
                  <PopButton onClick={handleSaveProfile} variant="secondary" className="w-full">
                    Save Profile
                  </PopButton>
                </div>
              </div>
            </PopCard>
          </section>
        )}

        {/* Network Simulation */}
        <section className="py-8">
           <div className="bg-white border-2 border-pop-border rounded-2xl p-4 shadow-hard">
             <h3 className="font-black text-xs text-center uppercase mb-4 tracking-widest text-gray-400">Environment Simulator</h3>
             <div className="flex flex-wrap gap-2 justify-center">
               {MOCK_NETWORKS.map(net => (
                 <button
                   key={net.ssid}
                   onClick={() => handleConnect(net)}
                   className={`
                     px-4 py-2 text-xs border-2 rounded-full font-bold transition-all
                     ${currentWifi.ssid === net.ssid 
                        ? 'bg-pop-secondary border-pop-border shadow-hard-sm -translate-y-1' 
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-pop-border hover:text-pop-text'}
                   `}
                 >
                   {net.ssid}
                 </button>
               ))}
             </div>
           </div>
        </section>

      </main>
    </div>
  );
}

export default App;