import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Package
} from 'lucide-react';
import { Asset, ASSET_TYPES, CATEGORIES, LOCATIONS, VERIFICATION_STATUSES } from '@/src/types';
import { cn, formatDate } from '@/src/lib/utils';

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  onExport: () => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ assets, onEdit, onDelete, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [sortField, setSortField] = useState<keyof Asset>('asset_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtering Logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || asset.type === filterType;
    const matchesLocation = filterLocation === 'All' || asset.location === filterLocation;

    return matchesSearch && matchesType && matchesLocation;
  });

  // Sorting Logic
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const aVal = String(a[sortField] || '');
    const bVal = String(b[sortField] || '');
    return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedAssets.length / itemsPerPage);
  const paginatedAssets = sortedAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Verified': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Pending Verification': 'bg-amber-50 text-amber-700 border-amber-100',
      'Mismatch Found': 'bg-rose-50 text-rose-700 border-rose-100',
      'Rejected': 'bg-slate-100 text-slate-700 border-slate-200',
      'In Process': 'bg-blue-50 text-blue-700 border-blue-100',
    };
    return cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border", variants[status] || 'bg-slate-50 text-slate-600 border-slate-100');
  };

  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center max-w-md bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Asset ID, Name or Serial..."
            className="flex-1 ml-2 text-sm border-none focus:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0">
          <select 
            className="text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          
          <select 
            className="text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="All">All Locations</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          
          <button 
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto relative scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('asset_id')}>
                <div className="flex items-center">
                  Asset ID <ArrowUpDown className="ml-1 w-3 h-3 text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('asset_name')}>
                <div className="flex items-center">
                  Name <ArrowUpDown className="ml-1 w-3 h-3 text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Submission</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Verification</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned To</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Mapped</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedAssets.length > 0 ? (
              paginatedAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-blue-50/20 transition-colors group/row">
                  <td className="px-4 py-3.5 text-[11px] font-mono font-bold text-slate-700 whitespace-nowrap">{asset.asset_id}</td>
                  <td className="px-4 py-3.5">
                    <div className="text-xs font-semibold text-slate-900 leading-tight max-w-[180px] truncate" title={asset.asset_name}>{asset.asset_name}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 font-mono uppercase truncate opacity-70 group-hover/row:opacity-100" title={asset.model || 'Unknown Model'}>{asset.model || 'Unknown Model'}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-500 uppercase tracking-tight">{asset.type}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-slate-600 truncate max-w-[120px]" title={asset.location}>{asset.location}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded border leading-none inline-block",
                      asset.submission_status === 'Already Done' ? "bg-green-50 text-green-700 border-green-100" :
                      asset.submission_status === 'In Process' ? "bg-blue-50 text-blue-700 border-blue-100" :
                      "bg-slate-50 text-slate-500 border-slate-100"
                    )}>
                      {asset.submission_status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={getStatusBadge(asset.verification_status)}>
                      {asset.verification_status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-[11px] text-slate-800 font-medium truncate max-w-[120px]" title={asset.assigned_to || 'Unassigned'}>{asset.assigned_to || 'Unassigned'}</div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                     <span className={cn(
                       "text-[10px] font-bold",
                       asset.asset_mapped?.toLowerCase() === 'yes' ? "text-emerald-500" : "text-slate-300"
                     )}>
                       {asset.asset_mapped || 'No'}
                     </span>
                  </td>
                  <td className="px-4 py-3.5 text-right pr-6 whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                         onClick={() => onEdit(asset)}
                         className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-md transition-all shadow-sm border border-blue-100"
                         title="Edit Asset"
                      >
                        <Edit className="w-3 h-3" />
                        <span>EDIT</span>
                      </button>
                      <button 
                        onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  onDelete(asset);
}}
                        className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-md transition-all shadow-sm border border-rose-100"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>DEL</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                    <Package className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="font-medium">No assets found</p>
                    <p className="text-sm">Try adjusting your filters or search term</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
        <div className="text-xs font-medium text-slate-500">
          Showing <span className="text-slate-900">{Math.min(paginatedAssets.length, itemsPerPage)}</span> of <span className="text-slate-900">{filteredAssets.length}</span> assets
        </div>
        <div className="flex items-center space-x-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 border border-slate-200 rounded-md disabled:opacity-30 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-ubuntu text-slate-500 px-2">Page {currentPage} of {totalPages || 1}</span>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 border border-slate-200 rounded-md disabled:opacity-30 hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;
