'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const GainNode = ({ data }: { data: any }) => {
  return (
    <div className={`px-4 py-3 shadow-lg rounded-xl bg-white border-2 transition-colors ${data.muted ? 'border-red-400 opacity-80' : 'border-orange-400'}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center justify-between w-full border-b pb-1">
          <span className="text-[10px] font-black text-orange-500 uppercase">VCA / Gain</span>
          <button 
            onClick={(e) => { e.stopPropagation(); data.onChange({ muted: !data.muted }); }}
            className={`text-[8px] px-2 py-0.5 rounded text-white font-bold uppercase transition-colors ${data.muted ? 'bg-red-500' : 'bg-gray-400'}`}
          >
            {data.muted ? 'Muted' : 'Mute'}
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <input 
            type="range" min="0" max="1" step="0.01"
            value={data.gain !== undefined ? data.gain : 0.5}
            onChange={(evt) => data.onChange({ gain: parseFloat(evt.target.value) })}
            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 -rotate-90 my-8"
          />
        </div>

        {/* Trigger Button */}
        <button
          onClick={(e) => { e.stopPropagation(); data.onTrigger(); }}
          className="w-full py-2 bg-orange-100 text-orange-600 text-[10px] font-black uppercase rounded-lg hover:bg-orange-200 active:scale-95 transition-all border border-orange-200"
        >
          Trigger Note
        </button>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-orange-400 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-orange-400 border-2 border-white" />
    </div>
  );
};

export default memo(GainNode);