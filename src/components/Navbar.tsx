import React from 'react';
import { 
  Droplet, 
  PhoneCall, 
  UserCheck, 
  AlertCircle, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  HelpCircle,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenPostRequest: () => void;
  activeRequestsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenPostRequest,
  activeRequestsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'find', label: 'Find Donors', icon: Search },
    { 
      id: 'requests', 
      label: 'Emergency Requests', 
      icon: AlertCircle, 
      badge: activeRequestsCount > 0 ? activeRequestsCount : undefined 
    },
    { id: 'register', label: 'Become a Donor', icon: PlusCircle },
    { id: 'verification', label: 'Donor Verification', icon: ShieldCheck },
    { id: 'compatibility', label: 'Compatibility Guide', icon: HelpCircle },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Emergency Ticker Bar */}
      <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase text-[10px] sm:text-xs">
              24/7 Rapid Emergency Response:
            </span>
            <span className="hidden sm:inline text-rose-100">
              Direct connection to verified local voluntary donors in your town.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 font-bold text-rose-100 bg-white/15 px-3 py-0.5 rounded-full text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>24×7 Available • Save a Life Today</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('find')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-white text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  Life<span className="text-red-600">Drop</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider bg-rose-50 text-red-700 px-2 py-0.5 rounded-md border border-rose-200">
                  Community Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Voluntary Blood Donors & Rapid Emergency Help
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-red-700 bg-red-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-red-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Urgent Request CTA */}
            <button
              onClick={onOpenPostRequest}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-600/20"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Need Blood Urgently</span>
            </button>

            {/* Login / Profile Button */}
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              {currentUser ? (
                <div className="text-left leading-tight">
                  <div className="text-xs font-semibold text-slate-900">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role} {currentUser.bloodGroup ? `• ${currentUser.bloodGroup}` : ''}
                  </div>
                </div>
              ) : (
                <span>Login / Account</span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenPostRequest}
              className="p-2 rounded-lg bg-red-600 text-white shadow-xs"
              title="Need Blood Urgently"
            >
              <Heart className="w-5 h-5 fill-white" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={onOpenPostRequest}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-red-600 text-center"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Need Blood Urgently</span>
            </button>
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 text-center"
            >
              <UserCheck className="w-4 h-4" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Donor / User Login'}</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-red-700 bg-red-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-red-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>24×7 Available • A Community Lifeline for Every Town</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
