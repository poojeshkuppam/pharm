import { ClipboardCheck, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDateTime, getStatusColor } from '../lib/utils';
import { useData } from '../lib/dataContext';

export default function QualityControl() {
  const { qualityChecks } = useData();

  const totalChecks = qualityChecks.length;
  const passedChecks = qualityChecks.filter((c) => c.result === 'passed').length;
  const failedChecks = qualityChecks.filter((c) => c.result === 'failed').length;
  const passRate = totalChecks > 0 ? ((passedChecks / totalChecks) * 100).toFixed(1) : '0.0';

  // compute distribution of check types from real data
  const typeCounts = qualityChecks.reduce((acc: Record<string, number>, c) => {
    const t = (c.check_type || 'unknown').toLowerCase();
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const productionCount = typeCounts['production'] || 0;
  const incomingCount = typeCounts['incoming'] || 0;
  const outgoingCount = typeCounts['outgoing'] || 0;
  const randomCount = typeCounts['random'] || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quality Control</h2>
        <p className="text-gray-600 mt-1">Quality assurance checks and inspection results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QualityMetricCard
          title="Total Checks"
          value={totalChecks}
          icon={<ClipboardCheck className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <QualityMetricCard
          title="Passed"
          value={passedChecks}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <QualityMetricCard
          title="Failed"
          value={failedChecks}
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          color="text-red-600"
          bgColor="bg-red-100"
        />
        <QualityMetricCard
          title="Pass Rate"
          value={`${passRate}%`}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quality Check History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Batch Number</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Check Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Inspector</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Stakeholder</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Result</th>
              </tr>
            </thead>
            <tbody>
              {qualityChecks.map((check) => (
                <tr key={check.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{check.batch_number}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 capitalize">{check.check_type}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{check.inspector_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{check.stakeholder_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDateTime(check.timestamp)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(check.result)}`}>
                      {check.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Check Types Distribution</h3>
          <div className="space-y-3">
            <CheckTypeBar type="Production" count={productionCount} total={totalChecks} color="bg-blue-600" />
            <CheckTypeBar type="Incoming" count={incomingCount} total={totalChecks} color="bg-green-600" />
            <CheckTypeBar type="Outgoing" count={outgoingCount} total={totalChecks} color="bg-yellow-600" />
            <CheckTypeBar type="Random" count={randomCount} total={totalChecks} color="bg-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Standards</h3>
          <div className="space-y-4">
            <QualityStandard
              name="Physical Inspection"
              description="Visual inspection for defects, damage, or contamination"
            />
            <QualityStandard
              name="Chemical Analysis"
              description="Active ingredient content verification"
            />
            <QualityStandard
              name="Microbiological Testing"
              description="Sterility and contamination testing"
            />
            <QualityStandard
              name="Packaging Integrity"
              description="Seal integrity and label accuracy verification"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ClipboardCheck className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Incoming Inspection</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Raw material verification</li>
                  <li>Certificate of analysis review</li>
                  <li>Supplier audit trail check</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Production QC</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>In-process testing</li>
                  <li>Batch record verification</li>
                  <li>Equipment validation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Outgoing Inspection</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Final product testing</li>
                  <li>Packaging verification</li>
                  <li>Release documentation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Random Sampling</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Post-market surveillance</li>
                  <li>Stability testing</li>
                  <li>Complaint investigation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QualityMetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function QualityMetricCard({ title, value, icon, color, bgColor }: QualityMetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface CheckTypeBarProps {
  type: string;
  count: number;
  total: number;
  color: string;
}

function CheckTypeBar({ type, count, total, color }: CheckTypeBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900">{type}</span>
        <span className="text-sm text-gray-600">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

interface QualityStandardProps {
  name: string;
  description: string;
}

function QualityStandard({ name, description }: QualityStandardProps) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}
