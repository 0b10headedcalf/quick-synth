'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const DelayNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-xl bg-white border-2 border-purple-400 min-w-[150px]">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between border-b pb-1">
          <span className="text-[10px] font-black text-purple-500 uppercase">Delay Effect</span>
        </div>
        
        <div>
          <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Time</label>
          <input 
            type="range" min="0" max="1" step="0.01"
            value={data.delayTime || 0.3}
            onChange={(evt) => data.onChange({ delayTime: parseFloat(evt.target.value) })}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Feedback</label>
          <input 
            type="range" min="0" max="0.9" step="0.01"
            value={data.feedback || 0.4}
            onChange={(evt) => data.onChange({ feedback: parseFloat(evt.target.value) })}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-400 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-400 border-2 border-white" />
    </div>
  );
};

export default memo(DelayNode);
