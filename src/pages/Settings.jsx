import React from 'react'
import { Settings as SettingsIcon, Shield, Database, Network, User, Bell } from 'lucide-react'

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your LandChain system preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <User className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profile Information</span>
              <button className="btn-secondary text-sm">Edit</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Change Password</span>
              <button className="btn-secondary text-sm">Update</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Two-Factor Authentication</span>
              <button className="btn-secondary text-sm">Enable</button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Session Timeout</span>
              <select className="input-field text-sm w-32">
                <option>30 min</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>24 hours</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">IP Whitelist</span>
              <button className="btn-secondary text-sm">Configure</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Audit Logs</span>
              <button className="btn-secondary text-sm">View</button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email Notifications</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">SMS Notifications</span>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction Alerts</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <SettingsIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Language</span>
              <select className="input-field text-sm w-32">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time Zone</span>
              <select className="input-field text-sm w-32">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>IST</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Theme</span>
              <select className="input-field text-sm w-32">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blockchain Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Network className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Blockchain Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Network</span>
              <span className="text-sm font-medium text-green-600">Localhost (Hardhat)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gas Limit</span>
              <input type="number" className="input-field text-sm w-24" defaultValue="3000000" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Auto-confirm</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </div>
        </div>

        {/* Data Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Data Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Export</span>
              <button className="btn-secondary text-sm">Export</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Backup</span>
              <button className="btn-secondary text-sm">Backup</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clear Cache</span>
              <button className="btn-secondary text-sm">Clear</button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn-primary">
          Save All Settings
        </button>
      </div>
    </div>
  )
}

export default Settings
