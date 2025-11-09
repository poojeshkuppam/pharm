import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Stakeholder {
  id: string;
  name: string;
  type: 'supplier' | 'manufacturer' | 'repackager' | 'distributor' | 'pharmacy' | 'regulatory';
  license_number: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  status: 'active' | 'suspended' | 'revoked';
  created_at: string;
  updated_at: string;
}

export interface Drug {
  id: string;
  name: string;
  ndc_code: string;
  manufacturer_id: string;
  dosage_form: string;
  strength: string;
  description?: string;
  fda_approval_number?: string;
  fda_approval_date?: string;
  status: 'approved' | 'pending' | 'recalled';
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  batch_number: string;
  drug_id: string;
  manufacturer_id: string;
  manufacturing_date: string;
  expiry_date: string;
  quantity: number;
  current_quantity: number;
  status: 'in_production' | 'quality_check' | 'approved' | 'in_transit' | 'delivered' | 'recalled';
  qr_code: string;
  created_at: string;
  updated_at: string;
}

export interface SupplyChainEvent {
  id: string;
  batch_id: string;
  event_type: 'manufactured' | 'transferred' | 'received' | 'quality_check' | 'approved' | 'rejected' | 'recalled';
  from_stakeholder_id?: string;
  to_stakeholder_id?: string;
  quantity: number;
  location?: string;
  notes?: string;
  blockchain_hash: string;
  timestamp: string;
  created_by?: string;
}

export interface IoTSensor {
  id: string;
  sensor_id: string;
  sensor_type: 'temperature' | 'humidity' | 'light' | 'shock' | 'location';
  batch_id?: string;
  stakeholder_id: string;
  location?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'alert';
  last_reading_at?: string;
  created_at: string;
}

export interface IoTReading {
  id: string;
  sensor_id: string;
  batch_id: string;
  reading_type: string;
  value: number;
  unit: string;
  latitude?: number;
  longitude?: number;
  is_alert: boolean;
  alert_message?: string;
  timestamp: string;
}

export interface TamperAlert {
  id: string;
  batch_id: string;
  sensor_id?: string;
  alert_type: 'temperature_violation' | 'humidity_violation' | 'shock_detected' | 'seal_broken' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  current_stakeholder_id?: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_alarm';
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  timestamp: string;
}

export interface FDASubmission {
  id: string;
  drug_id: string;
  submission_type: 'new_drug' | 'amendment' | 'annual_report' | 'adverse_event';
  submission_number: string;
  submitted_by: string;
  submission_date: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'additional_info_required';
  reviewer_notes?: string;
  approval_date?: string;
  documents: any[];
  created_at: string;
  updated_at: string;
}

export interface QualityCheck {
  id: string;
  batch_id: string;
  stakeholder_id: string;
  check_type: 'incoming' | 'production' | 'outgoing' | 'random';
  test_parameters: any;
  result: 'passed' | 'failed' | 'conditional';
  inspector_name: string;
  notes?: string;
  timestamp: string;
}
