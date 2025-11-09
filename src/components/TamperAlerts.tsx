import { AlertTriangle, XCircle, CheckCircle, Clock, MapPin, Thermometer, Zap } from 'lucide-react';
import { formatDateTime, getSeverityColor, getStatusColor } from '../lib/utils';
import { useData } from '../lib/dataContext';

export default function TamperAlerts() {
  const { tamperAlerts, addRandomTamperAlert } = useData();
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  const activeAlerts = tamperAlerts.filter((a) => a.status === 'open' || a.status === 'investigating');
  const resolvedAlerts = tamperAlerts.filter((a) => a.status === 'resolved' || a.status === 'false_alarm');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tamper Detection & Alerts</h2>
        <p className="text-gray-600 mt-1">Security incidents and environmental violations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertSummaryCard
          title="Active Alerts"
          count={activeAlerts.length}
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          color="text-red-600"
          bgColor="bg-red-100"
        />
        <AlertSummaryCard
          title="Under Investigation"
          count={tamperAlerts.filter((a) => a.status === 'investigating').length}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <AlertSummaryCard
          title="Resolved (24h)"
          count={resolvedAlerts.length}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
      </div>

      <div className="space-y-4">
        {!hasSupabase && (
          <div className="flex justify-end">
            <button
              onClick={() => addRandomTamperAlert()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Create Random Alert
            </button>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent History</h3>
          <div className="space-y-3">
            {resolvedAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Alert Response Protocol</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">1.</span>
                <span>All stakeholders in the supply chain are notified immediately upon alert detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">2.</span>
                <span>Batch movement is automatically suspended pending investigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">3.</span>
                <span>Quality control team initiates inspection within 2 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">4.</span>
                <span>FDA is notified for critical severity alerts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AlertSummaryCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function AlertSummaryCard({ title, count, icon, color, bgColor }: AlertSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{count}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface AlertCardProps {
  alert: {
    id: string;
    batch_number: string;
    alert_type: string;
    severity: string;
    description: string;
    location?: string;
    status: string;
    timestamp: string;
  };
}

function AlertCard({ alert }: AlertCardProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'temperature_violation':
        return <Thermometer className="w-5 h-5" />;
      case 'shock_detected':
        return <Zap className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-red-500 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
            {getAlertIcon(alert.alert_type)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{getAlertTypeLabel(alert.alert_type)}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                {alert.severity}
              </span>
            </div>
            <p className="text-sm text-gray-600">{alert.description}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
          {alert.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 mb-1">Batch Number</p>
          <p className="text-sm font-medium text-gray-900">{alert.batch_number}</p>
        </div>
        {alert.location && (
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location
            </p>
            <p className="text-sm font-medium text-gray-900">{alert.location}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 mb-1">Detected At</p>
          <p className="text-sm font-medium text-gray-900">{formatDateTime(alert.timestamp)}</p>
        </div>
      </div>

      {alert.status === 'open' && (
        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Investigate
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
            Mark as False Alarm
          </button>
        </div>
      )}
    </div>
  );
}
