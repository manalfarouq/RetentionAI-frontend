
import React from 'react';

interface FileFolderProps {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  colorClass?: string;
}

const FileFolder: React.FC<FileFolderProps> = ({ label, count, active, onClick, colorClass = 'bg-sage' }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-300 transform ${active ? '-translate-y-4' : 'hover:-translate-y-2'}`}
    >
      {/* Folder Tab */}
      <div className={`absolute -top-4 left-0 h-6 w-32 ${active ? 'bg-sage' : colorClass} opacity-90 folder-tab flex items-end px-4`}>
        <span className="text-[10px] font-bold tracking-widest text-cream uppercase pb-1">{label}</span>
      </div>
      
      {/* Folder Body */}
      <div className={`w-full h-48 ${active ? 'bg-sage' : colorClass} rounded-br-lg rounded-tr-lg p-6 folder-shadow flex flex-col justify-between border-l-4 border-darkBrown/10`}>
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-3xl text-cream italic">{label}</h3>
          {count !== undefined && (
            <span className="bg-cream/20 text-cream px-2 py-1 rounded text-[10px] font-bold">{count} FICHIERS</span>
          )}
        </div>
        <div className="flex justify-end">
           <div className="w-8 h-8 rounded-full border border-cream/30 flex items-center justify-center">
             <div className="w-1 h-1 bg-cream rounded-full"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FileFolder;
