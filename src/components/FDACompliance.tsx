import { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Upload } from 'lucide-react';
import { formatDate, getStatusColor } from '../lib/utils';
import { useData } from '../lib/dataContext';

export default function FDACompliance() {
  const { fdaSubmissions, addRandomFDASubmission } = useData();
  type Submission = typeof fdaSubmissions[number] | null;
  const [selectedSubmission, setSelectedSubmission] = useState<Submission>(null);

  const submissionsByStatus = {
    draft: fdaSubmissions.filter((s) => s.status === 'draft').length,
    submitted: fdaSubmissions.filter((s) => s.status === 'submitted').length,
    under_review: fdaSubmissions.filter((s) => s.status === 'under_review').length,
    approved: fdaSubmissions.filter((s) => s.status === 'approved').length,
    rejected: fdaSubmissions.filter((s) => s.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">FDA Compliance Dashboard</h2>
        <p className="text-gray-600 mt-1">Track submissions, approvals, and regulatory compliance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Under Review"
          count={submissionsByStatus.under_review}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatusCard
          title="Approved"
          count={submissionsByStatus.approved}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatusCard
          title="Drafts"
          count={submissionsByStatus.draft}
          icon={<FileText className="w-6 h-6 text-gray-600" />}
          color="text-gray-600"
          bgColor="bg-gray-100"
        />
        <StatusCard
          title="Action Required"
          count={submissionsByStatus.rejected}
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
          <button onClick={() => addRandomFDASubmission()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            New Submission
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Submission #</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Drug</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Submitted By</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fdaSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{submission.submission_number}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                    {submission.submission_type.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{submission.drug_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{submission.submitted_by}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDate(submission.submission_date)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}> 
                      {submission.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => setSelectedSubmission(submission)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Types</h3>
          <div className="space-y-3">
            <SubmissionTypeRow type="New Drug Application" count={1} color="bg-blue-600" />
            <SubmissionTypeRow type="Annual Reports" count={1} color="bg-green-600" />
            <SubmissionTypeRow type="Amendments" count={0} color="bg-yellow-600" />
            <SubmissionTypeRow type="Adverse Events" count={0} color="bg-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Checklist</h3>
          <div className="space-y-3">
            <ChecklistItem text="Annual drug reports submitted" completed />
            <ChecklistItem text="Manufacturing facility inspections up to date" completed />
            <ChecklistItem text="Adverse event reporting system active" completed />
            <ChecklistItem text="Quality management system certified" completed />
            <ChecklistItem text="Pharmacovigilance plan documented" completed />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Workflow Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automated submission tracking with real-time status updates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Secure document management with version control and audit trails</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Direct integration with FDA systems for faster approvals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Compliance alerts and deadline reminders</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    {/* Modal for submission details */}
    {selectedSubmission && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">FDA Submission Details</h3>
            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-gray-100 rounded-full">
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Submission #:</strong> {selectedSubmission.submission_number}</div>
            <div><strong>Type:</strong> {selectedSubmission.submission_type.replace('_', ' ')}</div>
            <div><strong>Drug:</strong> {selectedSubmission.drug_name}</div>
            <div><strong>Submitted By:</strong> {selectedSubmission.submitted_by}</div>
            <div><strong>Date:</strong> {formatDate(selectedSubmission.submission_date)}</div>
            <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status)}`}>{selectedSubmission.status.replace('_', ' ')}</span></div>
            {selectedSubmission.approval_date && (
              <div><strong>Approval Date:</strong> {formatDate(selectedSubmission.approval_date)}</div>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatusCard({ title, count, icon, color, bgColor }: StatusCardProps) {
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

interface SubmissionTypeRowProps {
  type: string;
  count: number;
  color: string;
}

function SubmissionTypeRow({ type, count, color }: SubmissionTypeRowProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900">{type}</span>
        <span className="text-sm text-gray-600">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: count > 0 ? '100%' : '0%' }}
        ></div>
      </div>
    </div>
  );
}

interface ChecklistItemProps {
  text: string;
  completed: boolean;
}

function ChecklistItem({ text, completed }: ChecklistItemProps) {
  return (
    <div className="flex items-center gap-3">
      {completed ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
      <span className={`text-sm ${completed ? 'text-gray-900' : 'text-gray-500'}`}>{text}</span>
    </div>
  );
}
