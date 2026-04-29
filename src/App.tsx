import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssetTable from './components/AssetTable';
import AssetForm from './components/AssetForm';
import BulkUpload from './components/BulkUpload';
import Reports from './components/Reports';
import { Asset } from './types';
import { supabase } from './lib/supabase';
import { AlertCircle, RefreshCcw, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import LoginPage from './components/LoginPage';


const AUTH_STORAGE_KEY = 'asset_app_session';

const getConfiguredCredentials = () => ({
  username: (typeof __ASSET_APP_USERNAME__ === 'string' ? __ASSET_APP_USERNAME__ : '').trim(),
  password: typeof __ASSET_APP_PASSWORD__ === 'string' ? __ASSET_APP_PASSWORD__ : '',
});

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const hasSession = localStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated';
    setIsAuthenticated(hasSession);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssets();
    }
  }, [isAuthenticated]);

  const fetchAssets = async () => {
    if (!supabase) {
      setIsLoading(false);
      setError('Supabase client failed to initialize. Please check the URL and Key in src/lib/supabase.ts.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setAssets(data || []);
    } catch (err: any) {
      console.error('Full Supabase Error Context:', err);
      const message = err.message || err.details || 'An unknown error occurred while connecting to Supabase.';
      setError(`Supabase Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (assetData: Asset) => {
    if (!supabase) return;

    setIsSaving(true);

    try {
      if (assetData.id) {
        const { error } = await supabase
          .from('assets')
          .update(assetData)
          .eq('id', assetData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('assets')
          .insert([assetData]);

        if (error) throw error;
      }

      setActiveTab('assets');
      setEditingAsset(null);
      await fetchAssets();
    } catch (err: any) {
      console.error('Error saving asset:', err);
      alert('Error saving asset: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };
const handleDelete = async (asset: Asset) => {
  if (!supabase) return;

  const assetName = asset.asset_name || asset.asset_id || 'this asset';

  if (!window.confirm(`Are you sure you want to delete "${assetName}"? This action cannot be undone.`)) {
    return;
  }

  try {
    console.log('DELETE CLICKED:', asset);

    const { data, error } = await supabase
      .from('assets')
      .delete()
      .eq('id', asset.id)
      .select();

    console.log('DELETE RESPONSE:', { data, error });

    if (error) throw error;

    setAssets((prev) => prev.filter((item) => item.id !== asset.id));

    alert('Asset deleted successfully.');
    await fetchAssets();
  } catch (err: any) {
    console.error('Delete error:', err);
    alert(`Delete Failed: ${err.message || err.details || 'Unknown error occurred.'}`);
  }
};

  const handleBulkUpload = async (newAssets: Asset[]) => {
    if (!supabase) {
      return {
        success: 0,
        failed: newAssets.length,
        errors: ['Supabase not configured'],
      };
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];
    const CHUNK_SIZE = 50;

    for (let i = 0; i < newAssets.length; i += CHUNK_SIZE) {
      const chunk = newAssets.slice(i, i + CHUNK_SIZE);

      try {
        const { error } = await supabase
          .from('assets')
          .upsert(chunk, { onConflict: 'asset_id' });

        if (error) throw error;

        successCount += chunk.length;
      } catch (err: any) {
        failedCount += chunk.length;
        errors.push(`Chunk starting at row ${i + 1} failed: ${err.message}`);
      }
    }

    await fetchAssets();

    return {
      success: successCount,
      failed: failedCount,
      errors,
    };
  };

  const exportAllToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Assets');
    XLSX.writeFile(wb, 'Full_Asset_Inventory.xlsx');
  };

  const handleLogin = (username: string, password: string) => {
    const configured = getConfiguredCredentials();

    if (!configured.username || !configured.password) {
      alert('App credentials are not configured. Please set ASSET_APP_USERNAME and ASSET_APP_PASSWORD in environment variables.');
      return false;
    }

    const success = username === configured.username && password === configured.password;

    if (success) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
      setIsAuthenticated(true);
    }

    return success;
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setIsSidebarOpen(false);
    setEditingAsset(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
          <RefreshCcw className="w-8 h-8 animate-spin mb-4 text-blue-600" />
          <p className="font-medium">Syncing with cloud database...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-xl text-center flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
          <h3 className="text-lg font-bold text-rose-900 mb-2">Connection Error</h3>
          <p className="text-rose-800 mb-6 max-w-md">{error}</p>
          <button
            onClick={fetchAssets}
            className="flex items-center px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry Connection
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard assets={assets} />;

      case 'assets':
        return (
          <AssetTable
            assets={assets}
            onEdit={(asset) => {
              setEditingAsset(asset);
              setActiveTab('add');
            }}
            onDelete={handleDelete}
            onExport={exportAllToExcel}
          />
        );

      case 'add':
        return (
          <AssetForm
            asset={editingAsset || undefined}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => {
              setEditingAsset(null);
              setActiveTab('assets');
            }}
            isLoading={isSaving}
          />
        );

      case 'bulk':
        return <BulkUpload onUpload={handleBulkUpload} />;

      case 'reports':
        return <Reports assets={assets} />;

      default:
        return <Dashboard assets={assets} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 capitalize tracking-tight">
                  {activeTab === 'add'
                    ? editingAsset
                      ? 'Edit Asset'
                      : 'New Asset Entry'
                    : activeTab}
                </h1>

                <p className="text-slate-500 text-sm mt-1">
                  {activeTab === 'dashboard'
                    ? 'Overview of your organization assets'
                    : activeTab === 'assets'
                    ? 'Manage and monitor all hardware inventory'
                    : activeTab === 'bulk'
                    ? 'Upload assets from Excel documents'
                    : activeTab === 'reports'
                    ? 'Generate analytics and audit logs'
                    : 'Fill in the details below to register the asset'}
                </p>
              </div>

              {activeTab === 'assets' && (
                <button
                  onClick={() => {
                    setEditingAsset(null);
                    setActiveTab('add');
                  }}
                  className="hidden sm:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Add New Asset
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {activeTab === 'assets' && (
        <button
          onClick={() => {
            setEditingAsset(null);
            setActiveTab('add');
          }}
          className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl lg:hidden active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}