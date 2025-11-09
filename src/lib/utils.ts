export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function generateBlockchainHash(): string {
  const chars = 'abcdef0123456789';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-50',
    approved: 'text-green-600 bg-green-50',
    in_production: 'text-blue-600 bg-blue-50',
    quality_check: 'text-yellow-600 bg-yellow-50',
    in_transit: 'text-purple-600 bg-purple-50',
    delivered: 'text-green-600 bg-green-50',
    recalled: 'text-red-600 bg-red-50',
    suspended: 'text-orange-600 bg-orange-50',
    revoked: 'text-red-600 bg-red-50',
    pending: 'text-yellow-600 bg-yellow-50',
    open: 'text-red-600 bg-red-50',
    investigating: 'text-orange-600 bg-orange-50',
    resolved: 'text-green-600 bg-green-50',
    passed: 'text-green-600 bg-green-50',
    failed: 'text-red-600 bg-red-50',
    draft: 'text-gray-600 bg-gray-50',
    submitted: 'text-blue-600 bg-blue-50',
    under_review: 'text-yellow-600 bg-yellow-50',
    rejected: 'text-red-600 bg-red-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'text-blue-600 bg-blue-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-orange-600 bg-orange-50',
    critical: 'text-red-600 bg-red-50',
  };
  return colors[severity] || 'text-gray-600 bg-gray-50';
}
