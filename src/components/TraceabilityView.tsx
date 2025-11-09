import { useState } from 'react';
import { Search, Package, MapPin, Calendar, ArrowRight, Shield, Plus, X } from 'lucide-react';
import { formatDateTime, getStatusColor } from '../lib/utils';
import { useData } from '../lib/dataContext';
import BatchForm from './BatchForm';
import SupplyEventForm from './SupplyEventForm';

export default function TraceabilityView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const { batches, supplyChainEvents, addBatch, addSupplyEvent, addQualityCheck } = useData();

  const handleNewBatch = (formData: any) => {
    const newBatch = {
      id: `b${Date.now()}`,
      batch_number: formData.batchNumber,
      drug_id: 'd1',
      drug_name: formData.drugName,
      manufacturer_id: '1',
      manufacturer_name: 'PharmaCorp Manufacturing',
      manufacturing_date: formData.manufacturingDate,
      expiry_date: formData.expiryDate,
      quantity: formData.quantity,
      current_quantity: formData.quantity,
      status: 'in_production',
      qr_code: `QR-${formData.batchNumber}`,
    };
    addBatch(newBatch);
    setShowBatchForm(false);
  };

  const handleNewEvent = (formData: any) => {
    if (!selectedBatchData) return;

    const baseEvent: any = {
      id: `e${Date.now()}`,
      batch_id: selectedBatchData.id,
      batch_number: selectedBatchData.batch_number,
      event_type: formData.eventType,
      from_stakeholder: formData.fromStakeholder,
      to_stakeholder: formData.toStakeholder,
      quantity: formData.quantity,
      location: formData.location,
      timestamp: new Date().toISOString(),
      blockchain_hash: Math.random().toString(36).substring(2),
    };

    // If this is a quality check, include QC details and create a quality check record
    if (formData.eventType === 'quality_check') {
      // Attach qc-specific fields to the event (if provided)
      if (formData.qc_result) baseEvent.qc_result = formData.qc_result;
      if (formData.inspector_name) baseEvent.inspector_name = formData.inspector_name;
      if (formData.approver) baseEvent.approver = formData.approver;

      // Also add a structured quality check entry
      const qc = {
        id: `q${Date.now()}`,
        batch_number: selectedBatchData.batch_number,
        check_type: 'random',
        result: formData.qc_result || 'passed',
        inspector_name: formData.inspector_name || 'Unknown',
        stakeholder_name: formData.fromStakeholder || 'Unknown',
        timestamp: new Date().toISOString(),
      } as any;
      addQualityCheck(qc);

      // If approver is FDA (regulatory), create an explicit 'approved' event to update batch status
      if (formData.approver && formData.approver.toLowerCase().includes('fda')) {
        const approvedEvent = { ...baseEvent, id: `e${Date.now()}-app`, event_type: 'approved', timestamp: new Date().toISOString() };
        addSupplyEvent(approvedEvent);
      }
    }

    addSupplyEvent(baseEvent);
    setShowEventForm(false);
  };

  const filteredBatches = batches.filter(
    (batch) =>
      batch.batch_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.drug_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBatchData = batches.find((b) => b.id === selectedBatch);
  const batchEvents = supplyChainEvents.filter((e) => e.batch_id === selectedBatch);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Drug Traceability</h2>
        <p className="text-gray-600 mt-1">End-to-end tracking of pharmaceutical batches</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by batch number or drug name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Batches</h3>
            <button
              onClick={() => setShowBatchForm(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Batch
            </button>
          </div>
          <div className="space-y-3">
            {filteredBatches.map((batch) => (
              <button
                key={batch.id}
                onClick={() => setSelectedBatch(batch.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedBatch === batch.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">{batch.batch_number}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{batch.drug_name}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Qty: {batch.current_quantity}/{batch.quantity}</span>
                      <span>Exp: {batch.expiry_date}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {selectedBatchData ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Details</h3>
                <div className="space-y-3">
                  <DetailRow label="Batch Number" value={selectedBatchData.batch_number} />
                  <DetailRow label="Drug Name" value={selectedBatchData.drug_name} />
                  <DetailRow label="Manufacturer" value={selectedBatchData.manufacturer_name} />
                  <DetailRow label="Manufacturing Date" value={selectedBatchData.manufacturing_date} />
                  <DetailRow label="Expiry Date" value={selectedBatchData.expiry_date} />
                  <DetailRow label="Quantity" value={`${selectedBatchData.current_quantity}/${selectedBatchData.quantity}`} />
                  <DetailRow label="QR Code" value={selectedBatchData.qr_code} />
                  <div className="pt-3 border-t border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBatchData.status)}`}>
                      {selectedBatchData.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Supply Chain Timeline</h3>
                  <button
                    onClick={() => setShowEventForm(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Event
                  </button>
                </div>
                <div className="space-y-4">
                  {batchEvents.map((event, index) => (
                    <div key={event.id} className="relative">
                      {index < batchEvents.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900 capitalize">
                                {event.event_type.replace('_', ' ')}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                From: {event.from_stakeholder} → To: {event.to_stakeholder}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDateTime(event.timestamp)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Shield className="w-3 h-3" />
                                <span className="font-mono">{event.blockchain_hash}</span>
                              </div>

                              {/* Show QC details when present */}
                              {event.event_type === 'quality_check' && (
                                <div className="mt-2 text-sm text-gray-700">
                                  {(event as any).qc_result && (
                                    <div>QC Result: <strong className="capitalize">{(event as any).qc_result}</strong></div>
                                  )}
                                  {(event as any).inspector_name && (
                                    <div>Inspector: {(event as any).inspector_name}</div>
                                  )}
                                  {(event as any).approver && (
                                    <div>Approved/Reviewed by: {(event as any).approver}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a batch to view details and supply chain timeline</p>
            </div>
          )}
        </div>
      </div>

      {showBatchForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <BatchForm onSubmit={handleNewBatch} onClose={() => setShowBatchForm(false)} />
        </div>
      )}
      
      {showEventForm && selectedBatchData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <SupplyEventForm
            batchNumber={selectedBatchData.batch_number}
            onSubmit={handleNewEvent}
            onClose={() => setShowEventForm(false)}
          />
        </div>
      )}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
