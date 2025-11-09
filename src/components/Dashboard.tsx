import { Package, AlertTriangle, Activity, CheckCircle, TrendingUp, Shield } from 'lucide-react';
import { useData } from '../lib/dataContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { batches, tamperAlerts, iotReadings, qualityChecks, addRandomBatch, addRandomIoTReading, blockchainEnabled } = useData();

  const activeBatches = batches.length;
  const activeAlerts = tamperAlerts.filter((a) => a.status === 'open' || a.status === 'investigating').length;
  const sensors = Array.from(new Set(iotReadings.map((r) => r.sensor_id)));
  const totalQualityChecks = qualityChecks.length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Supply Chain Overview</h2>
            <p className="text-gray-600 mt-1">Real-time monitoring of pharmaceutical supply chain</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addRandomIoTReading()}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
            >
              Generate IoT Reading
            </button>
            <button
              onClick={() => addRandomBatch()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Add Random Batch
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Batches"
          value={activeBatches}
          icon={<Package className="w-6 h-6 text-blue-600" />}
          trend="+12% from last month"
          color="text-blue-600"
        />
        <StatsCard
          title="Active Alerts"
          value={activeAlerts}
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          color="text-red-600"
        />
        <StatsCard
          title="IoT Sensors"
          value={sensors.length}
          icon={<Activity className="w-6 h-6 text-green-600" />}
          trend="98.5% uptime"
          color="text-green-600"
        />
        <StatsCard
          title="Quality Checks"
          value={totalQualityChecks}
          icon={<CheckCircle className="w-6 h-6 text-purple-600" />}
          trend="100% passed"
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Supply Chain Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              event="Batch Transfer"
              description="BATCH-2024-001 transferred to HealthPlus Pharmacy"
              time="2 hours ago"
              icon={<Package className="w-5 h-5 text-blue-600" />}
            />
            <ActivityItem
              event="Quality Check"
              description="BATCH-2024-002 passed outgoing inspection"
              time="4 hours ago"
              icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            />
            <ActivityItem
              event="Alert Triggered"
              description="Temperature violation detected in BATCH-2024-001"
              time="6 hours ago"
              icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FDA Compliance Status</h3>
          <div className="space-y-4">
            <ComplianceItem
              title="Annual Reports"
              status="Up to date"
              percentage={100}
              color="bg-green-600"
            />
            <ComplianceItem
              title="New Drug Applications"
              status="1 under review"
              percentage={75}
              color="bg-yellow-600"
            />
            <ComplianceItem
              title="Quality Standards"
              status="Compliant"
              percentage={100}
              color="bg-green-600"
            />
          </div>
        </div>
      </div>

      {blockchainEnabled && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h3 className="text-xl font-bold">Blockchain Security Enabled</h3>
          </div>
          <p className="text-blue-100">
            All supply chain events are cryptographically secured and immutable.
            Complete transparency and traceability across the entire pharmaceutical ecosystem.
          </p>
        </div>
      )}
    </div>
  );
}

interface ActivityItemProps {
  event: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

function ActivityItem({ event, description, time, icon }: ActivityItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{event}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

interface ComplianceItemProps {
  title: string;
  status: string;
  percentage: number;
  color: string;
}

function ComplianceItem({ title, status, percentage, color }: ComplianceItemProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <span className="text-sm text-gray-600">{status}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
