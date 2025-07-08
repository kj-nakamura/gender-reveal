"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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
  onUpdate?: (personId: string, updates: Partial<PersonData>) => void;
}

function PersonNode({ data, selected }: { data: PersonNodeData; selected?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<'name' | 'date_of_birth' | null>(null);
  const [tempName, setTempName] = useState(data.name);
  const [tempDateOfBirth, setTempDateOfBirth] = useState(data.date_of_birth || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();
  const router = useRouter();
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

  const calculateAge = (dateString: string | null) => {
    if (!dateString) return '';
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // 誕生日がまだ来ていない場合は年齢を-1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? `${age}歳` : '';
  };

  const handleClick = (e: React.MouseEvent) => {
    // ダブルクリック編集中は無視
    if (isEditing) {
      e.stopPropagation();
      return;
    }
    
    if (data.onClick) {
      data.onClick(data);
    }
  };

  const handleDoubleClick = useCallback((e: React.MouseEvent, field: 'name' | 'date_of_birth') => {
    e.stopPropagation(); // クリックイベントの伝播を停止
    setIsEditing(true);
    setEditingField(field);
  }, []);

  const handleUpdate = useCallback(async (field: 'name' | 'date_of_birth', value: string) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const updates: Partial<PersonData> = {};
      if (field === 'name') {
        updates.name = value;
      } else if (field === 'date_of_birth') {
        updates.date_of_birth = value || null;
      }
      
      const { error } = await supabase
        .from('persons')
        .update(updates)
        .eq('id', data.id);

      if (error) {
        console.error('Error updating person:', error);
        alert('更新に失敗しました');
        return;
      }

      // React Flowの表示を更新
      if (data.onUpdate) {
        data.onUpdate(data.id, updates);
      }
      
      // ページをリフレッシュして最新データを取得
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました');
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
      setEditingField(null);
    }
  }, [data, supabase, router, isUpdating]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, field: 'name' | 'date_of_birth') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = field === 'name' ? tempName : tempDateOfBirth;
      handleUpdate(field, value);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditingField(null);
      setTempName(data.name);
      setTempDateOfBirth(data.date_of_birth || '');
    }
  }, [tempName, tempDateOfBirth, handleUpdate, data]);


  return (
    <div 
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px] cursor-pointer transition-all relative
        ${getGenderColor(data.gender)}
        ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm hover:shadow-md'}
        ${isEditing ? 'ring-2 ring-yellow-400 shadow-lg' : ''}
        ${isUpdating ? 'opacity-50' : ''}
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
        
        {/* 名前の編集 */}
        {isEditing && editingField === 'name' ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={() => handleUpdate('name', tempName)}
            onKeyDown={(e) => handleKeyDown(e, 'name')}
            className="font-semibold text-sm text-gray-800 mb-1 bg-transparent border-b border-blue-500 text-center outline-none nodrag"
            autoFocus
            disabled={isUpdating}
          />
        ) : (
          <div 
            className="font-semibold text-sm text-gray-800 mb-1 cursor-pointer"
            onDoubleClick={(e) => handleDoubleClick(e, 'name')}
          >
            {data.name}
          </div>
        )}
        
        {/* 生年月日の編集 */}
        {isEditing && editingField === 'date_of_birth' ? (
          <input
            type="date"
            value={tempDateOfBirth}
            onChange={(e) => setTempDateOfBirth(e.target.value)}
            onBlur={() => handleUpdate('date_of_birth', tempDateOfBirth)}
            onKeyDown={(e) => handleKeyDown(e, 'date_of_birth')}
            className="text-xs text-gray-600 bg-transparent border-b border-blue-500 text-center outline-none nodrag"
            autoFocus
            disabled={isUpdating}
          />
        ) : (
          <div 
            className="text-xs text-gray-600 cursor-pointer"
            onDoubleClick={(e) => handleDoubleClick(e, 'date_of_birth')}
          >
            {data.date_of_birth ? calculateAge(data.date_of_birth) : '年齢情報なし'}
          </div>
        )}
        
        {/* 更新中インジケーター */}
        {isUpdating && (
          <div className="absolute top-1 right-1">
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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