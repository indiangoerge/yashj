import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, User, Shield, Bell } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { currentRole, user } = useAuth();
  const [exportDutyRate, setExportDutyRate] = useState(5);
  const [defaultMargin, setDefaultMargin] = useState(15);
  const [companyName, setCompanyName] = useState('GrainExport Solutions');
  const [notifications, setNotifications] = useState(true);

  if (currentRole !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">Settings are only available to Admin users.</p>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would save to a backend or localStorage
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application preferences and defaults</p>
        </div>
        <Button onClick={handleSave} icon={Save}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile */}
        <Card title="User Profile" className="lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2 capitalize">
                {currentRole}
              </span>
            </div>
          </div>
        </Card>

        {/* Application Settings */}
        <Card title="Application Settings" className="lg:col-span-2">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
              <Input
                label="Default Export Duty Rate (%)"
                type="number"
                value={exportDutyRate}
                onChange={(e) => setExportDutyRate(Number(e.target.value))}
                min={0}
                max={100}
                step={0.1}
                suffix="%"
              />
              <Input
                label="Default Margin (%)"
                type="number"
                value={defaultMargin}
                onChange={(e) => setDefaultMargin(Number(e.target.value))}
                min={0}
                max={100}
                step={0.1}
                suffix="%"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable email notifications for new estimates
                  </span>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Data Management</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Export All Data
                </Button>
                <Button variant="outline" className="w-full">
                  Import Data
                </Button>
                <Button variant="danger" className="w-full">
                  Clear All Estimates
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Information */}
      <Card title="System Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Version</label>
            <p className="mt-1 text-sm text-gray-900">1.0.0</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
            <p className="mt-1 text-sm text-gray-900">December 2024</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Environment</label>
            <p className="mt-1 text-sm text-gray-900">Production</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;