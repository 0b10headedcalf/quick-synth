'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const OutputNode = () => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-xl bg-gray-900 border-2 border-gray-700 min-w-[120px]">
      <div className="flex flex-col items-center justify-center">
        <div className="text-[10px] font-black text-green-400 uppercase mb-2 tracking-widest">Master Out</div>
        <div className="flex space-x-1 mb-2">
            {[1,2,3,4].map(i => (
                <div key={i} className="w-1 h-4 bg-green-500/20 rounded-full overflow-hidden relative">
                    <div className="absolute bottom-0 left-0 right-0 bg-green-400 animate-pulse" style={{height: `${Math.random() * 100}%`}}></div>
                </div>
            ))}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-400 border-2 border-gray-900" />
    </div>
  );
};

export default memo(OutputNode);
