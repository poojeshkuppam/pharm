import { X } from 'lucide-react';

interface SupplyEventFormData {
  eventType: 'manufactured' | 'quality_check' | 'transferred' | 'received';
  fromStakeholder: string;
  toStakeholder: string;
  location: string;
  quantity: number;
  // optional QC-specific fields
  qc_result?: 'passed' | 'failed';
  inspector_name?: string;
  approver?: string; // e.g. 'FDA Regulatory Authority' or other stakeholder
}

interface SupplyEventFormProps {
  batchNumber: string;
  onSubmit: (data: SupplyEventFormData) => void;
  onClose: () => void;
}

export default function SupplyEventForm({ batchNumber, onSubmit, onClose }: SupplyEventFormProps) {
  const stakeholders = [
    'PharmaCorp Manufacturing',
    'MedSupply Distributors',
    'HealthPlus Pharmacy',
    'CentralMed Warehouse',
    'Regional Distribution Center'
  ];

  const locations = [
    'Mumbai, India',
    'Delhi, India',
    'Bangalore, India',
    'Chennai, India',
    'Hyderabad, India',
    'Kolkata, India'
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: SupplyEventFormData = {
      eventType: formData.get('eventType') as SupplyEventFormData['eventType'],
      fromStakeholder: formData.get('fromStakeholder') as string,
      toStakeholder: formData.get('toStakeholder') as string,
      location: formData.get('location') as string,
      quantity: parseInt(formData.get('quantity') as string, 10),
    };

    // include QC specific fields when present
    if (data.eventType === 'quality_check') {
      const qcResult = formData.get('qc_result') as string | null;
      const inspector = formData.get('inspector_name') as string | null;
      const approver = formData.get('approver') as string | null;
      if (qcResult) data.qc_result = qcResult as 'passed' | 'failed';
      if (inspector) data.inspector_name = inspector;
      if (approver) data.approver = approver;
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Supply Chain Event</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Batch Number: {batchNumber}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              required
              name="eventType"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="manufactured">Manufactured</option>
              <option value="quality_check">Quality Check</option>
              <option value="transferred">Transferred</option>
              <option value="received">Received</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Stakeholder
            </label>
            <select
              required
              name="fromStakeholder"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {stakeholders.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Stakeholder
            </label>
            <select
              required
              name="toStakeholder"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {stakeholders.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              required
              name="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              required
              type="number"
              name="quantity"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter quantity"
            />
          </div>

          {/* QC-specific fields (optional) */}
          <div id="qcFields" className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QC Result (if Quality Check)</label>
              <select name="qc_result" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">-- select --</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspector Name</label>
              <input name="inspector_name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Inspector name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approver (optional, e.g. FDA)</label>
              <select name="approver" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">-- none --</option>
                <option>PharmaCorp Manufacturing</option>
                <option>MedSupply Distributors</option>
                <option>HealthPlus Pharmacy</option>
                <option>FDA Regulatory Authority</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}