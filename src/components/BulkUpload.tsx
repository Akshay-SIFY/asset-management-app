import React, { useState } from 'react';
import { Upload, FileText, Download, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Asset, ASSET_TYPES, CATEGORIES, LOCATIONS, SUBMISSION_STATUSES, VERIFICATION_STATUSES } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface BulkUploadProps {
  onUpload: (assets: Asset[]) => Promise<{ success: number; failed: number; errors: string[] }>;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setPreviewData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadSample = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const sample = [
      {
        'Asset ID': 'SIFY-L-001',
        'Asset Name': 'Dell Latitude Laptop',
        'Type': 'Laptop',
        'Category': 'Permanent',
        'Ref No': 'REF-123',
        'Model': 'Latitude 5410',
        'Serial Number': 'SN2024001',
        'Host Name': 'SIFY-LAP-001',
        'Assigned To': 'Rahul Sharma',
        'Use By': 'Engineering',
        'Location': 'iTest Content Room',
        'Submission Status': 'Already Done',
        'Verification Status': 'Verified',
        'Asset Mapped': 'Yes',
        'Remarks': 'Standard issue'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "Asset_Import_Sample.xlsx");
  };

  const mapToAsset = (row: any): Asset => {
    return {
      asset_id: String(row['Asset ID'] || row['asset_id'] || ''),
      asset_name: String(row['Asset Name'] || row['asset_name'] || ''),
      type: (row['Type'] || row['type'] || 'Other') as any,
      category: (row['Category'] || row['category'] || 'Other') as any,
      ref_no: String(row['Ref No'] || row['ref_no'] || ''),
      model: String(row['Model'] || row['model'] || ''),
      serial_number: String(row['Serial Number'] || row['serial_number'] || ''),
      host_name: String(row['Host Name'] || row['host_name'] || ''),
      assigned_to: String(row['Assigned To'] || row['assigned_to'] || ''),
      use_by: String(row['Use By'] || row['use_by'] || ''),
      location: (row['Location'] || row['location'] || 'Other') as any,
      submission_status: (row['Submission Status'] || row['submission_status'] || 'Other') as any,
      verification_status: (row['Verification Status'] || row['verification_status'] || 'Other') as any,
      asset_mapped: String(row['Asset Mapped'] || row['asset_mapped'] || ''),
      remarks: String(row['Remarks'] || row['remarks'] || ''),
    };
  };

  const handleImport = async () => {
    if (!previewData.length) return;
    setIsProcessing(true);
    const assets = previewData.map(mapToAsset);
    const summary = await onUpload(assets);
    setResult(summary);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Import Assets</h3>
            
            <div 
              className={cn(
                "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors mb-6",
                file ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {file ? file.name : "Choose Excel or CSV file"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag and drop or click to browse
              </p>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
            </div>

            <div className="space-y-3">
              <button 
                onClick={(e) => downloadSample(e)}
                className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors relative z-20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample Format
              </button>
              
              <button 
                disabled={!file || isProcessing}
                onClick={handleImport}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Run Import'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="flex items-center text-sm font-bold text-blue-900 mb-3">
              <Info className="w-4 h-4 mr-2" />
              Import Instructions
            </h4>
            <ul className="text-xs text-blue-800 space-y-2 opacity-80">
              <li>• Asset ID must be unique.</li>
              <li>• If Asset ID exists, the record will be updated.</li>
              <li>• Use exact column names from the sample.</li>
              <li>• Supported formats: .xlsx, .xls, .csv</li>
            </ul>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2">
          {result ? (
             <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Import Completed</h3>
                <div className="flex items-center justify-center space-x-6 my-6">
                   <div className="text-center">
                     <p className="text-2xl font-bold text-emerald-600">{result.success}</p>
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Success</p>
                   </div>
                   <div className="h-8 w-[1px] bg-slate-200" />
                   <div className="text-center">
                     <p className="text-2xl font-bold text-rose-600">{result.failed}</p>
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Failed</p>
                   </div>
                </div>
                {result.errors.length > 0 && (
                  <div className="mt-6 text-left p-4 bg-rose-50 border border-rose-100 rounded-lg">
                    <h4 className="text-sm font-bold text-rose-900 mb-2">Errors identified:</h4>
                    <ul className="text-xs text-rose-800 space-y-1">
                      {result.errors.map((err, i) => <li key={i}>• {err}</li>)}
                    </ul>
                  </div>
                )}
                <button 
                  onClick={() => { setFile(null); setPreviewData([]); setResult(null); }}
                  className="mt-8 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Start New Import
                </button>
             </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Data Preview</h3>
              </div>
              <div className="flex-1 overflow-auto max-h-[500px]">
                {previewData.length > 0 ? (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 sticky top-0">
                        <th className="p-3 font-bold text-slate-500">Asset ID</th>
                        <th className="p-3 font-bold text-slate-500">Name</th>
                        <th className="p-3 font-bold text-slate-500">Type</th>
                        <th className="p-3 font-bold text-slate-500">SN</th>
                        <th className="p-3 font-bold text-slate-500">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewData.slice(0, 50).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono text-blue-700">{row['Asset ID'] || row['asset_id']}</td>
                          <td className="p-3 font-medium text-slate-900">{row['Asset Name'] || row['asset_name']}</td>
                          <td className="p-3 text-slate-600">{row['Type'] || row['type']}</td>
                          <td className="p-3 text-slate-600 font-mono">{row['Serial Number'] || row['serial_number']}</td>
                          <td className="p-3 text-slate-600">{row['Location'] || row['location']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400">
                    <FileText className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">No data preview available</p>
                    <p className="text-xs">Upload a file to see content here</p>
                  </div>
                )}
              </div>
              {previewData.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 text-[10px] text-slate-500 italic">
                  * Showing first {Math.min(50, previewData.length)} rows of {previewData.length} records detected.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
