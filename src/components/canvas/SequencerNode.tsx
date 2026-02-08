'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

/**
 * SequencerNode Component
 * A 16-step grid that allows users to schedule triggers over time.
 */
const SequencerNode = ({ data }: { data: any }) => {
  // steps is an array of 16 booleans
  const steps = data.steps || Array(16).fill(false);
  const currentStep = data.currentStep || 0;

  return (
    <div className="px-4 py-4 shadow-xl rounded-2xl bg-white border-2 border-green-500 min-w-[280px]">
      <div className="flex flex-col space-y-4">
        {/* Header with Transport Controls */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Timeline / Sequencer</span>
          <button 
            onClick={(e) => { e.stopPropagation(); data.onTogglePlay(); }}
            className={`px-3 py-1 rounded text-[10px] font-bold text-white uppercase transition-all ${data.isPlaying ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {data.isPlaying ? 'Stop' : 'Start'}
          </button>
        </div>
        
        {/* 16-Step Grid */}
        <div className="grid grid-cols-8 gap-1.5">
          {steps.map((active: boolean, i: number) => (
            <button
              key={i}
              onClick={(e) => { 
                e.stopPropagation(); 
                const newSteps = [...steps];
                newSteps[i] = !newSteps[i];
                data.onChange({ steps: newSteps });
              }}
              className={`
                h-8 w-full rounded-md transition-all border-b-4
                ${active ? 'bg-green-500 border-green-700' : 'bg-gray-100 border-gray-300'}
                ${currentStep === i ? 'ring-2 ring-yellow-400 scale-110 z-10' : ''}
                hover:scale-105
              `}
            />
          ))}
        </div>

        {/* BPM Control */}
        <div className="flex items-center space-x-3 mt-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">BPM</span>
            <input 
                type="range" min="60" max="200" step="1"
                value={data.bpm || 120}
                onChange={(e) => data.onChange({ bpm: parseInt(e.target.value) })}
                className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <span className="text-[10px] font-mono text-gray-500 w-8">{data.bpm || 120}</span>
        </div>
      </div>

      {/* The Sequencer has a Source handle to "fire" triggers into other nodes */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
    </div>
  );
};

export default memo(SequencerNode);
