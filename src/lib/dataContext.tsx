import React, { createContext, useContext, useState } from 'react';
import * as mock from './mockData';
import { generateBlockchainHash } from './utils';
// optional supabase realtime integration (requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
const hasSupabaseEnv = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

type IoTReading = (typeof mock.mockIoTReadings)[number];
type Batch = (typeof mock.mockBatches)[number];
type SupplyEvent = (typeof mock.mockSupplyChainEvents)[number];
type TamperAlert = (typeof mock.mockTamperAlerts)[number];
type FDASubmission = (typeof mock.mockFDASubmissions)[number];
type QualityCheck = (typeof mock.mockQualityChecks)[number];

function id(prefix = '') {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

function nowISO() {
  return new Date().toISOString();
}

interface DataContextValue {
  batches: Batch[];
  iotReadings: IoTReading[];
  supplyChainEvents: SupplyEvent[];
  tamperAlerts: TamperAlert[];
  fdaSubmissions: FDASubmission[];
  qualityChecks: QualityCheck[];
  addIoTReading: (r: IoTReading) => void;
  addRandomIoTReading: (sensorId?: string) => IoTReading;
  addBatch: (b: Batch) => void;
  addRandomBatch: () => Batch;
  addTamperAlert: (a: TamperAlert) => void;
  addRandomTamperAlert: (batchId?: string) => TamperAlert;
  addFDASubmission: (f: FDASubmission) => void;
  addRandomFDASubmission: () => FDASubmission;
  addQualityCheck: (q: QualityCheck) => void;
  addRandomQualityCheck: (batchNumber?: string) => QualityCheck;
  addSupplyEvent: (e: SupplyEvent) => void;
  addRandomSupplyEvent: (batch?: Batch) => SupplyEvent;
  blockchainEnabled: boolean;
  setBlockchainEnabled: (v: boolean) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // clone initial mock data so we don't modify module-level arrays
  const [batches, setBatches] = useState<Batch[]>([...mock.mockBatches]);
  const [iotReadings, setIoTReadings] = useState<IoTReading[]>([...mock.mockIoTReadings]);
  const [supplyChainEvents, setSupplyChainEvents] = useState<SupplyEvent[]>([...mock.mockSupplyChainEvents]);
  const [tamperAlerts, setTamperAlerts] = useState<TamperAlert[]>([...mock.mockTamperAlerts]);
  const [fdaSubmissions, setFDASubmissions] = useState<FDASubmission[]>([...mock.mockFDASubmissions]);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([...mock.mockQualityChecks]);
  const [blockchainEnabled, setBlockchainEnabled] = useState<boolean>(false);

  function addIoTReading(r: IoTReading) {
    setIoTReadings((s) => [...s, r]);
  }

  // Keep last readings to generate realistic patterns
  const [lastReadings] = useState<Record<string, { value: number; timestamp: number }>>({});

  function addRandomIoTReading(sensorId?: string) {
    const sensors = ['s1', 's2', 's3', 's4'];
    const sensor = sensorId || sensors[Math.floor(Math.random() * sensors.length)];
    const sensorTypeMap: Record<string, { type: string; unit: string; min: number; max: number; changeRate: number }> = {
      s1: { type: 'temperature', unit: '°C', min: 2, max: 8, changeRate: 0.2 }, // Cold chain storage
      s2: { type: 'humidity', unit: '%', min: 35, max: 65, changeRate: 1 },
      s3: { type: 'shock', unit: 'g', min: 0, max: 2, changeRate: 0.5 },
      s4: { type: 'location', unit: '', min: 0, max: 0, changeRate: 0 },
    };
    
    const meta = sensorTypeMap[sensor];
    const now = Date.now();
    const last = lastReadings[sensor] || { value: (meta.max + meta.min) / 2, timestamp: now - 60000 };
    
    // Calculate new value based on previous + controlled random change
    let newValue = last.value;
    
    if (meta.type === 'temperature') {
      // Temperature follows a gradual pattern with small fluctuations
      const timeDiff = (now - last.timestamp) / 1000; // seconds
      const naturalChange = Math.sin(now / 3600000) * 0.2; // Daily cycle influence
      const randomChange = (Math.random() - 0.5) * meta.changeRate;
      newValue = Math.max(meta.min, Math.min(meta.max, 
        last.value + (naturalChange + randomChange) * Math.min(timeDiff, 60) / 60
      ));
    } else if (meta.type === 'humidity') {
      // Humidity changes based on time of day
      const hour = new Date().getHours();
      const targetHumidity = hour >= 6 && hour <= 18 ? 45 : 55; // Higher at night
      newValue = last.value + (targetHumidity - last.value) * 0.1 + (Math.random() - 0.5) * 2;
    } else if (meta.type === 'shock') {
      // Shock is usually near zero with occasional spikes
      newValue = Math.random() < 0.95 ? Math.random() * 0.5 : Math.random() * 4;
    }
    
    // Update last reading
    lastReadings[sensor] = { value: newValue, timestamp: now };
    
    const reading: IoTReading = {
      id: id('r'),
      sensor_id: sensor,
      sensor_type: meta.type,
      value: +newValue.toFixed(1),
      unit: meta.unit,
      timestamp: nowISO(),
      is_alert: meta.type === 'temperature' ? newValue > meta.max || newValue < meta.min 
              : meta.type === 'shock' ? newValue > 2 : false,
    } as IoTReading;
    addIoTReading(reading);
    return reading;
  }

  function addBatch(b: Batch) {
    setBatches((s) => [b, ...s]);
  }

  function addRandomBatch() {
    const drug = mock.mockDrugs[Math.floor(Math.random() * mock.mockDrugs.length)];
    const currentDate = new Date();
    const batchNumber = `BATCH-${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 900 + 100)}`;
    
    // Standard batch sizes based on drug type
    const batchSizes = {
      Tablet: 100000,
      Capsule: 50000,
      Injectable: 10000,
      Liquid: 20000
    };
    const baseQuantity = batchSizes[drug.dosage_form as keyof typeof batchSizes] || 10000;
    const quantity = baseQuantity + Math.floor(Math.random() * (baseQuantity * 0.1)); // ±10% variation
    
    const newBatch: Batch = {
      id: id('b'),
      batch_number: batchNumber,
      drug_id: drug.id,
      drug_name: drug.name,
      manufacturer_id: '1',
      manufacturer_name: 'PharmaCorp Manufacturing',
      manufacturing_date: currentDate.toISOString().split('T')[0],
      expiry_date: new Date(currentDate.setFullYear(currentDate.getFullYear() + 2)).toISOString().split('T')[0],
      quantity: quantity,
      current_quantity: quantity, // Starts at full quantity
      status: 'in_production',
      qr_code: `QR-${batchNumber}`,
    } as Batch;
    addBatch(newBatch);
    // also add a manufactured event
    addRandomSupplyEvent(newBatch);
    return newBatch;
  }

  function addTamperAlert(a: TamperAlert) {
    setTamperAlerts((s) => [a, ...s]);
  }

  function addRandomTamperAlert(batchId?: string) {
    const targetBatch = batchId ? batches.find((b) => b.id === batchId) : batches[Math.floor(Math.random() * batches.length)];
    const types = ['temperature_violation', 'shock_detected'];
    const severity = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
    const alert: TamperAlert = {
      id: id('a'),
      batch_id: targetBatch?.id || 'b0',
      batch_number: targetBatch?.batch_number || 'UNKNOWN',
      alert_type: types[Math.floor(Math.random() * types.length)],
      severity,
      description: 'Automatically generated alert for demo',
      location: 'Simulated Location',
      status: 'open',
      timestamp: nowISO(),
    } as TamperAlert;
    addTamperAlert(alert);
    return alert;
  }

  // If Supabase is configured, optionally sync tamper alerts in real-time
  React.useEffect(() => {
    if (!hasSupabaseEnv) return;
    let mounted = true;
    (async () => {
      try {
        const { supabase } = await import('./supabase');
        // fetch initial tamper alerts from Supabase table
        const { data, error } = await supabase
          .from('tamper_alerts')
          .select('*')
          .order('timestamp', { ascending: false });
        if (!mounted) return;
        if (!error && data) {
          // map timestamps to string if necessary
          setTamperAlerts((_) => (data as any[]).map((d) => ({ ...d } as TamperAlert)));
        }

        // subscribe to realtime changes using Realtime Postgres changes
        const channel = supabase
          .channel('public:tamper_alerts')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tamper_alerts' }, (payload: any) => {
            const newAlert = payload.new as TamperAlert;
            setTamperAlerts((s) => [newAlert, ...s]);
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tamper_alerts' }, (payload: any) => {
            const updated = payload.new as TamperAlert;
            setTamperAlerts((s) => s.map((a) => (a.id === updated.id ? updated : a)));
          })
          .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tamper_alerts' }, (payload: any) => {
            const removed = payload.old as TamperAlert;
            setTamperAlerts((s) => s.filter((a) => a.id !== removed.id));
          })
          .subscribe();

        return () => {
          mounted = false;
          try {
            if (channel) {
              // unsubscribe the channel
              // channel.unsubscribe() returns a Promise; ignore result here
              (channel as any).unsubscribe();
            }
          } catch (e) {
            // ignore
          }
        };
      } catch (err) {
        // if import or supabase fails, just keep using mock data
        return;
      }
    })();
  }, []);

  function addFDASubmission(f: FDASubmission) {
    setFDASubmissions((s) => [f, ...s]);
  }

  function addRandomFDASubmission() {
    const drug = mock.mockDrugs[Math.floor(Math.random() * mock.mockDrugs.length)];
    const subNum = `FDA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const submission: FDASubmission = {
      id: id('f'),
      drug_name: drug.name,
      submission_type: 'annual_report',
      submission_number: subNum,
      submitted_by: 'PharmaCorp Manufacturing',
      submission_date: new Date().toISOString().split('T')[0],
      status: 'submitted',
    } as FDASubmission;
    addFDASubmission(submission);
    return submission;
  }

  function addQualityCheck(q: QualityCheck) {
    setQualityChecks((s) => [q, ...s]);
  }

  function addRandomQualityCheck(batchNumber?: string) {
    const target = batchNumber || (batches[0] && batches[0].batch_number) || 'BATCH-000';
    const res = Math.random() > 0.1 ? 'passed' : 'failed';
    const check: QualityCheck = {
      id: id('q'),
      batch_number: target,
      check_type: ['production', 'incoming', 'outgoing', 'random'][Math.floor(Math.random() * 4)],
      result: res,
      inspector_name: 'Auto Inspector',
      stakeholder_name: 'PharmaCorp Manufacturing',
      timestamp: nowISO(),
    } as QualityCheck;
    addQualityCheck(check);
    return check;
  }

  function addSupplyEvent(e: SupplyEvent) {
    setSupplyChainEvents((s) => [e, ...s]);

    // If this event represents an FDA/regulatory approval, update the batch status to 'approved'
    try {
      if (e.event_type === 'approved') {
        setBatches((bs) => bs.map((b) => (b.id === e.batch_id ? { ...b, status: 'approved' } : b)));
      }

      // Some quality_check events may contain qc_result and approver fields.
      // If qc_result is 'passed' and approver indicates a regulatory authority (e.g., contains 'FDA'), mark approved.
      const approver = (e as any).approver as string | undefined;
      const qcResult = (e as any).qc_result as string | undefined;
      if (e.event_type === 'quality_check' && qcResult === 'passed' && approver && approver.toLowerCase().includes('fda')) {
        setBatches((bs) => bs.map((b) => (b.id === e.batch_id ? { ...b, status: 'approved' } : b)));
      }
    } catch (err) {
      // swallow: non-critical state update
    }
  }

  // Track supply chain state per batch
  const [batchStates] = useState<Record<string, { lastEvent: string; location: string }>>({});

  function addRandomSupplyEvent(batch?: Batch) {
    const target = batch || batches[Math.floor(Math.random() * batches.length)];
    if (!target) {
      // Create a fallback event if no batch is available
      const fallbackEvent: SupplyEvent = {
        id: id('e'),
        batch_id: 'b0',
        batch_number: 'UNKNOWN',
        event_type: 'manufactured',
        from_stakeholder: 'PharmaCorp Manufacturing',
        to_stakeholder: 'PharmaCorp Manufacturing',
        quantity: 0,
        location: 'Mumbai, India',
        timestamp: nowISO(),
        blockchain_hash: generateBlockchainHash(),
      } as SupplyEvent;
      return fallbackEvent;
    }
    
    const state = batchStates[target.id] || { lastEvent: 'none', location: 'Mumbai, India' };
    
    // Define valid supply chain sequence
    const eventSequence = {
      'none': ['manufactured'],
      'manufactured': ['quality_check'],
      'quality_check': ['approved', 'rejected'],
      'approved': ['transferred'],
      'transferred': ['received'],
      'received': ['quality_check', 'transferred'],
      'rejected': ['quality_check']
    };
    
    // Pick next valid event type
    const validTypes = eventSequence[state.lastEvent as keyof typeof eventSequence] || ['manufactured'];
    const eventType = validTypes[Math.floor(Math.random() * validTypes.length)];
    
    // Define supply chain locations and stakeholders
    const locations = {
      'Mumbai, India': ['Delhi, India', 'Bangalore, India'],
      'Delhi, India': ['Mumbai, India', 'Kolkata, India'],
      'Bangalore, India': ['Chennai, India', 'Mumbai, India'],
      'Chennai, India': ['Bangalore, India', 'Hyderabad, India'],
      'Kolkata, India': ['Delhi, India', 'Hyderabad, India'],
      'Hyderabad, India': ['Chennai, India', 'Bangalore, India']
    };
    
    // Calculate new location based on event type
    let newLocation = state.location;
    if (eventType === 'transferred') {
      const possibleLocations = locations[state.location as keyof typeof locations] || [];
      newLocation = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];
    }
    
    // Update batch state
    batchStates[target.id] = { lastEvent: eventType, location: newLocation };
    
    const event: SupplyEvent = {
      id: id('e'),
      batch_id: target.id,
      batch_number: target.batch_number,
      event_type: eventType,
      from_stakeholder: eventType === 'transferred' ? 'PharmaCorp Manufacturing' : 'Current Holder',
      to_stakeholder: eventType === 'transferred' ? 'MedSupply Distributors' : 'Current Holder',
      quantity: target.quantity,
      location: newLocation,
      timestamp: nowISO(),
      blockchain_hash: generateBlockchainHash(),
    } as SupplyEvent;
    addSupplyEvent(event);
    return event;
  }

  const value: DataContextValue = {
    batches,
    iotReadings,
    supplyChainEvents,
    tamperAlerts,
    fdaSubmissions,
    qualityChecks,
    addIoTReading,
    addRandomIoTReading,
    addBatch,
    addRandomBatch,
    addTamperAlert,
    addRandomTamperAlert,
    addFDASubmission,
    addRandomFDASubmission,
    addQualityCheck,
    addRandomQualityCheck,
    addSupplyEvent,
    addRandomSupplyEvent,
    blockchainEnabled,
    setBlockchainEnabled,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export default DataProvider;
