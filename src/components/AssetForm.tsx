import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { 
  Asset, 
  ASSET_TYPES, 
  CATEGORIES, 
  LOCATIONS, 
  SUBMISSION_STATUSES, 
  VERIFICATION_STATUSES 
} from '@/src/types';
import { cn } from '@/src/lib/utils';

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (asset: Asset) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const initialFormState: Asset = {
  asset_id: '',
  asset_name: '',
  type: 'Laptop',
  category: 'Permanent',
  ref_no: '',
  model: '',
  serial_number: '',
  host_name: '',
  assigned_to: '',
  use_by: '',
  location: 'iTest Content Room',
  submission_status: 'Pending',
  verification_status: 'Pending Verification',
  asset_mapped: '',
  remarks: '',
};

const AssetForm: React.FC<AssetFormProps> = ({ asset, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<Asset>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (asset) {
      setFormData(asset);
    }
  }, [asset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.asset_id.trim()) newErrors.asset_id = 'Asset ID is required';
    if (!formData.asset_name.trim()) newErrors.asset_name = 'Asset Name is required';
    if (!formData.serial_number.trim()) newErrors.serial_number = 'Serial Number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          {asset ? 'Edit Asset' : 'Add New Asset'}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Asset ID *</label>
            <input 
              name="asset_id"
              value={formData.asset_id}
              onChange={handleChange}
              placeholder="e.g. SIFY-L-101"
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                errors.asset_id ? "border-rose-500 bg-rose-50" : "border-slate-200 focus:border-blue-500"
              )}
            />
            {errors.asset_id && <p className="text-xs text-rose-500 font-medium">{errors.asset_id}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Asset Name *</label>
            <input 
              name="asset_name"
              value={formData.asset_name}
              onChange={handleChange}
              placeholder="e.g. Dell Latitude 5420"
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                errors.asset_name ? "border-rose-500 bg-rose-50" : "border-slate-200 focus:border-blue-500"
              )}
            />
            {errors.asset_name && <p className="text-xs text-rose-500 font-medium">{errors.asset_name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Serial Number *</label>
            <input 
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="e.g. SN123456789"
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                errors.serial_number ? "border-rose-500 bg-rose-50" : "border-slate-200 focus:border-blue-500"
              )}
            />
            {errors.serial_number && <p className="text-xs text-rose-500 font-medium">{errors.serial_number}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Location</label>
            <select name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Model</label>
            <input name="model" value={formData.model} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Host Name</label>
            <input name="host_name" value={formData.host_name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Assigned To</label>
            <input name="assigned_to" value={formData.assigned_to} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Submission Status</label>
            <select name="submission_status" value={formData.submission_status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              {SUBMISSION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Verification Status</label>
            <select name="verification_status" value={formData.verification_status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              {VERIFICATION_STATUSES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          
           <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Asset Mapped with Employee</label>
            <input name="asset_mapped" value={formData.asset_mapped} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1.5 lg:col-span-3">
            <label className="text-sm font-semibold text-slate-700">Remarks</label>
            <textarea 
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end space-x-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : (asset ? 'Update Asset' : 'Save Asset')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetForm;
