import { useState } from 'react';
import { LayoutDashboard, Package, Activity, AlertTriangle, FileText, ClipboardCheck, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TraceabilityView from './components/TraceabilityView';
import IoTMonitoring from './components/IoTMonitoring';
import TamperAlerts from './components/TamperAlerts';
import FDACompliance from './components/FDACompliance';
import QualityControl from './components/QualityControl';

type View = 'dashboard' | 'traceability' | 'iot' | 'alerts' | 'fda' | 'quality';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  view: View;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, view, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'traceability':
        return <TraceabilityView />;
      case 'iot':
        return <IoTMonitoring />;
      case 'alerts':
        return <TamperAlerts />;
      case 'fda':
        return <FDACompliance />;
      case 'quality':
        return <QualityControl />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PharmChain</h1>
                  <p className="text-xs text-gray-600">Supply Chain Traceability System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                System Online
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 w-64 p-4 z-20 transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="space-y-2 mt-20 lg:mt-4">
            <NavItem
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
              view="dashboard"
              active={currentView === 'dashboard'}
              onClick={() => {
                setCurrentView('dashboard');
                setSidebarOpen(false);
              }}
            />
            <NavItem
              icon={<Package className="w-5 h-5" />}
              label="Traceability"
              view="traceability"
              active={currentView === 'traceability'}
              onClick={() => {
                setCurrentView('traceability');
                setSidebarOpen(false);
              }}
            />
            <NavItem
              icon={<Activity className="w-5 h-5" />}
              label="IoT Monitoring"
              view="iot"
              active={currentView === 'iot'}
              onClick={() => {
                setCurrentView('iot');
                setSidebarOpen(false);
              }}
            />
            <NavItem
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Tamper Alerts"
              view="alerts"
              active={currentView === 'alerts'}
              onClick={() => {
                setCurrentView('alerts');
                setSidebarOpen(false);
              }}
            />
            <NavItem
              icon={<FileText className="w-5 h-5" />}
              label="FDA Compliance"
              view="fda"
              active={currentView === 'fda'}
              onClick={() => {
                setCurrentView('fda');
                setSidebarOpen(false);
              }}
            />
            <NavItem
              icon={<ClipboardCheck className="w-5 h-5" />}
              label="Quality Control"
              view="quality"
              active={currentView === 'quality'}
              onClick={() => {
                setCurrentView('quality');
                setSidebarOpen(false);
              }}
            />
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Secure & Transparent</h4>
              <p className="text-xs text-gray-600">
                All transactions recorded on blockchain-based ledger
              </p>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <main className="flex-1 p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
