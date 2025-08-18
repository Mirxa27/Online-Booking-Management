'use client'

import { useState } from 'react'
import { Bot, Brain, Zap, MessageSquare, Save, RefreshCw } from 'lucide-react'

export default function AISettingsPage() {
  const [settings, setSettings] = useState({
    aiModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: `You are Sara, a friendly and helpful AI assistant for Habibistay. 
Your role is to help guests find and book perfect accommodations, 
provide information about properties, assist with bookings, 
and offer support throughout their stay.`,
    greetingMessage: "Hello! I'm Sara, your personal travel assistant at Habibistay. 🏡",
    enableVoice: true,
    enableButtons: true,
    autoSuggest: true,
    responseDelay: 1500,
  })

  const handleSave = () => {
    // Save settings to backend
    console.log('Saving AI settings:', settings)
    alert('AI settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Configuration</h1>
        <p className="text-gray-600 mt-1">Configure Sara AI assistant settings and behavior</p>
      </div>

      {/* Model Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Brain className="w-6 h-6 text-habibistay-blue mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">AI Model Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Model
            </label>
            <select
              value={settings.aiModel}
              onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
            >
              <option value="gpt-4">GPT-4 (Most Capable)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
              <option value="claude-3">Claude 3 (Alternative)</option>
              <option value="custom">Custom Model</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (Creativity Level)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12">{settings.temperature}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lower values make responses more focused and deterministic, higher values more creative
            </p>
          </div>
        </div>
      </div>

      {/* Conversation Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <MessageSquare className="w-6 h-6 text-habibistay-blue mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Conversation Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt
            </label>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              This defines Sara's personality and behavior
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Greeting Message
            </label>
            <input
              type="text"
              value={settings.greetingMessage}
              onChange={(e) => setSettings({ ...settings, greetingMessage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Delay (ms)
            </label>
            <input
              type="number"
              value={settings.responseDelay}
              onChange={(e) => setSettings({ ...settings, responseDelay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Simulated typing delay for more natural conversation
            </p>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Zap className="w-6 h-6 text-habibistay-blue mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Feature Settings</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">Enable Voice Input</span>
              <p className="text-sm text-gray-500">Allow users to speak to Sara</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableVoice}
              onChange={(e) => setSettings({ ...settings, enableVoice: e.target.checked })}
              className="w-5 h-5 text-habibistay-blue rounded focus:ring-habibistay-blue"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">Enable Button Interface</span>
              <p className="text-sm text-gray-500">Show quick action buttons in chat</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableButtons}
              onChange={(e) => setSettings({ ...settings, enableButtons: e.target.checked })}
              className="w-5 h-5 text-habibistay-blue rounded focus:ring-habibistay-blue"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">Auto-Suggest Properties</span>
              <p className="text-sm text-gray-500">Automatically show featured properties</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSuggest}
              onChange={(e) => setSettings({ ...settings, autoSuggest: e.target.checked })}
              className="w-5 h-5 text-habibistay-blue rounded focus:ring-habibistay-blue"
            />
          </label>
        </div>
      </div>

      {/* Test Chat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Bot className="w-6 h-6 text-habibistay-blue mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Test Sara AI</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-habibistay-blue rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">S</span>
            </div>
            <div className="bg-white rounded-lg p-3 max-w-md">
              <p className="text-sm text-gray-800">{settings.greetingMessage}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a test message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-habibistay-blue focus:border-transparent"
          />
          <button className="px-4 py-2 bg-habibistay-blue text-white rounded-lg hover:bg-habibistay-600 transition-colors">
            Send Test
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-habibistay-blue text-white rounded-lg hover:bg-habibistay-600 transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  )
}