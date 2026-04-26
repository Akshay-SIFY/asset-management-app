import React from 'react';
import { 
  FilePieChart, 
  MapPin, 
  UserCheck, 
  AlertTriangle,
  ChevronRight,
  Download
} from 'lucide-react';
import { Asset, ASSET_TYPES, CATEGORIES, LOCATIONS, SUBMISSION_STATUSES, VERIFICATION_STATUSES } from '@/src/types';
import { cn } from '@/src/lib/utils';
import * as XLSX from 'xlsx';

interface ReportsProps {
  assets: Asset[];
}

const Reports: React.FC<ReportsProps> = ({ assets }) => {
  
  const generateTypeReport = () => {
    const data = ASSET_TYPES.map(type => ({
      Type: type,
      Count: assets.filter(a => a.type === type).length,
      Verified: assets.filter(a => a.type === type && a.verification_status === 'Verified').length,
      'Pending Verification': assets.filter(a => a.type === type && a.verification_status === 'Pending Verification').length,
    }));
    exportToExcel(data, "TypeWise_Report");
  };

  const generateLocationReport = () => {
    const data = LOCATIONS.map(loc => ({
      Location: loc,
      'Total Assets': assets.filter(a => a.location === loc).length,
      Mapped: assets.filter(a => a.location === loc && a.asset_mapped).length,
      Unmapped: assets.filter(a => a.location === loc && !a.asset_mapped).length,
    }));
    exportToExcel(data, "LocationWise_Report");
  };

  const generateMismatchReport = () => {
    const data = assets.filter(a => a.verification_status === 'Mismatch Found').map(a => ({
      'Asset ID': a.asset_id,
      'Asset Name': a.asset_name,
      'Serial Number': a.serial_number,
      'Mapped To': a.asset_mapped,
      Location: a.location,
      Remarks: a.remarks
    }));
    exportToExcel(data, "Mismatch_Data_Report");
  };

  const generateMissingDataReport = () => {
    const data = assets.filter(a => !a.serial_number || !a.model || !a.host_name).map(a => ({
      'Asset ID': a.asset_id,
      'Asset Name': a.asset_name,
      'Missing Fields': [
        !a.serial_number && 'Serial',
        !a.model && 'Model',
        !a.host_name && 'Host Name'
      ].filter(Boolean).join(', ')
    }));
    exportToExcel(data, "Missing_Data_Hold_Report");
  };

  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const reportCards = [
    { 
      id: 'type', 
      title: 'Type-wise Inventory', 
      desc: 'Summary of assets grouped by hardware type (Laptop, Desktop, etc).',
      icon: FilePieChart,
      color: 'blue',
      action: generateTypeReport
    },
    { 
      id: 'location', 
      title: 'Location Distribution', 
      desc: 'Asset count by project rooms, client sites, or employee custody.',
      icon: MapPin,
      color: 'emerald',
      action: generateLocationReport
    },
    { 
      id: 'mismatch', 
      title: 'Mismatch Alerts', 
      desc: 'Detailed list of all assets currently flagged with verification mismatches.',
      icon: AlertTriangle,
      color: 'rose',
      action: generateMismatchReport
    },
    { 
      id: 'missing', 
      title: 'Missing Data Audit', 
      desc: 'Identify records missing critical fields (SN, Model, Host Name).',
      icon: UserCheck,
      color: 'amber',
      action: generateMissingDataReport
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Inventory Analytics & Reports</h2>
          <p className="text-slate-500 max-w-2xl">
            Generate and export specialized reports for audits, tracking, and reconciliation. 
            All reports are exported in .xlsx format for easy processing in Excel.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-[0.03]">
          <Download className="w-48 h-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((report) => (
          <div 
            key={report.id} 
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            onClick={report.action}
          >
            <div className="flex items-start justify-between">
              <div className={cn(
                "p-3 rounded-lg mb-4 transition-colors",
                report.color === 'blue' ? "bg-blue-50 text-blue-600" :
                report.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                report.color === 'rose' ? "bg-rose-50 text-rose-600" :
                "bg-amber-50 text-amber-600"
              )}>
                <report.icon className="w-6 h-6" />
              </div>
              <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-5 h-5" />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              {report.title}
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {report.desc}
            </p>
            
            <div className="mt-6 flex items-center text-sm font-bold text-blue-600">
              Download Report 
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
