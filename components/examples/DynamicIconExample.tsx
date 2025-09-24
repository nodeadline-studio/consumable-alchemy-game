'use client';

import { useState } from 'react';
import DynamicIcon, { IconSearch } from '@/components/DynamicIcon';
import { IconMetadata } from '@/lib/icons/dynamic-icon-loader';
import UserComponentStorage from '@/lib/storage/user-component-storage';

export default function DynamicIconExample() {
  const [selectedIcon, setSelectedIcon] = useState<IconMetadata | null>(null);
  const [context, setContext] = useState('coffee drink');
  const [userComponentName, setUserComponentName] = useState('');
  const [userComponentData, setUserComponentData] = useState('');

  const userStorage = UserComponentStorage.getInstance();

  const handleIconSelect = (icon: IconMetadata) => {
    setSelectedIcon(icon);
  };

  const handleCreateUserComponent = async () => {
    if (!userComponentName || !userComponentData) {
      alert('Please provide both name and data');
      return;
    }

    const result = await userStorage.storeComponent({
      name: userComponentName,
      type: 'icon',
      category: 'user',
      data: userComponentData,
      permissions: {
        canEdit: true,
        canShare: false,
        canDelete: true,
        allowedUsers: ['user']
      }
    });

    if (result.success) {
      alert('User component created successfully!');
      setUserComponentName('');
      setUserComponentData('');
    } else {
      alert(`Error: ${result.errors?.join(', ')}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Dynamic Icon System Demo</h1>
        <p className="text-white/70">
          Icons are loaded dynamically based on relevance without requiring the full library
        </p>
      </div>

      {/* Context-based Icon Loading */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Context-Based Icon Loading</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Context (what are you looking for?)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., coffee drink, medical pill, safety warning"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white/80">Most relevant icon:</span>
            <DynamicIcon 
              name="search" 
              context={context} 
              size="large"
              showRelevance={true}
              onLoad={(metadata) => console.log('Icon loaded:', metadata)}
            />
            {selectedIcon && (
              <span className="text-white/60 text-sm">
                {selectedIcon.name} ({selectedIcon.category})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Icon Search */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Icon Search & Selection</h2>
        <IconSearch onSelect={handleIconSelect} context={context} />
        
        {selectedIcon && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">Selected Icon</h3>
            <div className="flex items-center space-x-4">
              <DynamicIcon name={selectedIcon.id} size="large" />
              <div>
                <p className="text-white font-medium">{selectedIcon.name}</p>
                <p className="text-white/60 text-sm">Category: {selectedIcon.category}</p>
                <p className="text-white/60 text-sm">Keywords: {selectedIcon.keywords.join(', ')}</p>
                {selectedIcon.relevanceScore && (
                  <p className="text-white/60 text-sm">Relevance: {selectedIcon.relevanceScore}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Component Creation */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Create User Component</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Component Name
            </label>
            <input
              type="text"
              value={userComponentName}
              onChange={(e) => setUserComponentName(e.target.value)}
              placeholder="e.g., my-custom-icon"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              SVG Data (Base64 or SVG string)
            </label>
            <textarea
              value={userComponentData}
              onChange={(e) => setUserComponentData(e.target.value)}
              placeholder="<svg>...</svg> or base64 data"
              rows={4}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleCreateUserComponent}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Component
          </button>
        </div>
      </div>

      {/* Different Icon Sizes */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Icon Sizes</h2>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <DynamicIcon name="star" size="small" />
            <p className="text-white/60 text-sm mt-2">Small</p>
          </div>
          <div className="text-center">
            <DynamicIcon name="star" size="medium" />
            <p className="text-white/60 text-sm mt-2">Medium</p>
          </div>
          <div className="text-center">
            <DynamicIcon name="star" size="large" />
            <p className="text-white/60 text-sm mt-2">Large</p>
          </div>
          <div className="text-center">
            <DynamicIcon name="star" size="hero" />
            <p className="text-white/60 text-sm mt-2">Hero</p>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Security Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/20 rounded-lg">
            <h3 className="text-green-400 font-medium mb-2">✅ Data Validation</h3>
            <p className="text-white/70 text-sm">
              All user components are validated for malicious content and proper format
            </p>
          </div>
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">🔒 Encryption</h3>
            <p className="text-white/70 text-sm">
              User components are encrypted before storage for security
            </p>
          </div>
          <div className="p-4 bg-purple-500/20 rounded-lg">
            <h3 className="text-purple-400 font-medium mb-2">🛡️ Sanitization</h3>
            <p className="text-white/70 text-sm">
              Input sanitization prevents XSS and injection attacks
            </p>
          </div>
          <div className="p-4 bg-yellow-500/20 rounded-lg">
            <h3 className="text-yellow-400 font-medium mb-2">🔍 Integrity Check</h3>
            <p className="text-white/70 text-sm">
              Checksums verify data integrity and detect tampering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
