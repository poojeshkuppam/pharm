import { useState } from 'react';
import { Thermometer, Droplets, Zap, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { useData } from '../lib/dataContext';

export default function IoTMonitoring() {
  const [selectedSensor, setSelectedSensor] = useState<string>('all');
  const { iotReadings, addRandomIoTReading } = useData();

  const sensors = [
    { id: 's1', name: 'Temperature Sensor #1', type: 'temperature', location: 'Storage Unit A', status: 'alert' },
    { id: 's2', name: 'Humidity Sensor #1', type: 'humidity', location: 'Storage Unit A', status: 'active' },
    { id: 's3', name: 'Shock Sensor #1', type: 'shock', location: 'Transport Vehicle TV-101', status: 'alert' },
    { id: 's4', name: 'GPS Tracker #1', type: 'location', location: 'Transport Vehicle TV-101', status: 'active' },
  ];

  const filteredReadings = selectedSensor === 'all'
    ? iotReadings
    : iotReadings.filter((r) => r.sensor_id === selectedSensor);

  const latestReadings = sensors.map((sensor) => {
    const readings = iotReadings.filter((r) => r.sensor_id === sensor.id);
    return {
      sensor,
      reading: readings[readings.length - 1],
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">IoT Environmental Monitoring</h2>
        <p className="text-gray-600 mt-1">Real-time monitoring of storage and transport conditions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestReadings.map(({ sensor, reading }) => (
          <SensorCard
            key={sensor.id}
            name={sensor.name}
            type={sensor.type}
            location={sensor.location}
            value={reading?.value}
            unit={reading?.unit}
            status={sensor.status}
            isAlert={reading?.is_alert}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sensor Readings History</h3>
          <div className="flex items-center gap-3">
            <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sensors</option>
            {sensors.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name}
              </option>
            ))}
          </select>
            <button
              onClick={() => addRandomIoTReading()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Generate Reading
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Sensor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Value</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings.map((reading) => (
                <tr key={reading.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{reading.sensor_id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 capitalize">{reading.sensor_type}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {reading.value} {reading.unit}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDateTime(reading.timestamp)}</td>
                  <td className="py-3 px-4">
                    {reading.is_alert ? (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Alert</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Normal</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ThresholdCard
          icon={<Thermometer className="w-6 h-6 text-red-600" />}
          title="Temperature"
          range="2°C - 25°C"
          current="23.1°C"
          status="normal"
        />
        <ThresholdCard
          icon={<Droplets className="w-6 h-6 text-blue-600" />}
          title="Humidity"
          range="30% - 60%"
          current="47.8%"
          status="normal"
        />
        <ThresholdCard
          icon={<Zap className="w-6 h-6 text-yellow-600" />}
          title="Shock"
          range="< 5g"
          current="2.1g"
          status="normal"
        />
      </div>
    </div>
  );
}

interface SensorCardProps {
  name: string;
  type: string;
  location: string;
  value?: number;
  unit?: string;
  status: string;
  isAlert?: boolean;
}

function SensorCard({ name, type, location, value, unit, status, isAlert }: SensorCardProps) {
  const icons: Record<string, React.ReactNode> = {
    temperature: <Thermometer className="w-6 h-6" />,
    humidity: <Droplets className="w-6 h-6" />,
    shock: <Zap className="w-6 h-6" />,
    location: <MapPin className="w-6 h-6" />,
  };

  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-600',
    alert: 'bg-red-100 text-red-600',
    inactive: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className={`rounded-lg shadow-sm border-2 p-4 ${isAlert ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colors[status]}`}>
          {icons[type]}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
          {status}
        </span>
      </div>
      <h4 className="font-semibold text-gray-900 text-sm mb-1">{name}</h4>
      <p className="text-xs text-gray-600 mb-3">{location}</p>
      {value !== undefined && (
        <p className="text-2xl font-bold text-gray-900">
          {value} <span className="text-lg text-gray-600">{unit}</span>
        </p>
      )}
    </div>
  );
}

interface ThresholdCardProps {
  icon: React.ReactNode;
  title: string;
  range: string;
  current: string;
  status: string;
}

function ThresholdCard({ icon, title, range, current, status }: ThresholdCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Safe Range</span>
          <span className="text-sm font-medium text-gray-900">{range}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Current</span>
          <span className="text-sm font-medium text-gray-900">{current}</span>
        </div>
        <div className="pt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'normal' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {status === 'normal' ? 'Within Range' : 'Out of Range'}
          </span>
        </div>
      </div>
    </div>
  );
}
