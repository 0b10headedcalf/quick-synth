'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const OscillatorNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-xl bg-white border-2 border-blue-500 min-w-[150px]">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between border-b pb-1">
          <span className="text-[10px] font-black text-blue-500 uppercase">Oscillator</span>
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
        
        {/* Waveform Selection */}
        <div>
          <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Waveform</label>
          <select 
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded p-1 outline-none"
            value={data.type || 'sine'}
            onChange={(evt) => data.onTypeChange(evt.target.value)}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>

        {/* Frequency Slider */}
        <div>
          <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Frequency</label>
          <input 
            type="range" 
            min="20" 
            max="2000" 
            value={data.frequency || 440}
            onChange={(evt) => data.onFrequencyChange(parseFloat(evt.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="text-[10px] text-right text-gray-400 mt-1">{Math.round(data.frequency)} Hz</div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    </div>
  );
};

export default memo(OscillatorNode);