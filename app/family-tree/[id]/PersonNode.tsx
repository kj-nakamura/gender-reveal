"use client";

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export interface PersonData {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string | null;
  father_id: string | null;
  mother_id: string | null;
}

export interface PersonNodeData extends PersonData {
  onClick?: (person: PersonData) => void;
}

function PersonNode({ data, selected }: { data: PersonNodeData; selected?: boolean }) {
  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 border-blue-300';
      case 'female': return 'bg-pink-100 border-pink-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      default: return '👤';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const handleClick = () => {
    if (data.onClick) {
      data.onClick(data);
    }
  };

  return (
    <div 
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px] cursor-pointer transition-all
        ${getGenderColor(data.gender)}
        ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm hover:shadow-md'}
      `}
      onClick={handleClick}
    >
      {/* 上部の接続点（親から） */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      
      <div className="text-center">
        <div className="text-lg mb-1">
          {getGenderIcon(data.gender)}
        </div>
        <div className="font-semibold text-sm text-gray-800 mb-1">
          {data.name}
        </div>
        
        {data.date_of_birth && (
          <div className="text-xs text-gray-600">
            {formatDate(data.date_of_birth)}
          </div>
        )}
      </div>
      
      {/* 下部の接続点（子へ） */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
}

export default memo(PersonNode);