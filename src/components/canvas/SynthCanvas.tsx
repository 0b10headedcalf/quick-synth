'use client';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Audio Engine and Node Components
import { audioEngine } from '@/lib/audio';
import OscillatorNode from './OscillatorNode';
import OutputNode from './OutputNode';
import GainNode from './GainNode';
import DelayNode from './DelayNode';
import SequencerNode from './SequencerNode';

// Map components to types for React Flow
const nodeTypes = {
  oscillator: OscillatorNode,
  gain: GainNode,
  output: OutputNode,
  delay: DelayNode,
  sequencer: SequencerNode,
};

/**
 * The workspace now starts with only the Output node.
 * Users must build the rest of the synth themselves.
 */
const initialNodes = [
  { 
    id: 'output', 
    type: 'output', 
    position: { x: 800, y: 300 }, 
    data: {} 
  },
];

export default function SynthCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  
  // Ref used to access current edges inside the sequencer tick without triggering re-renders
  const edgesRef = useRef<Edge[]>([]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  /**
   * onNodeDataChange
   * Updates both the React state (for the UI) and the Audio Engine (for the sound).
   */
  const onNodeDataChange = useCallback((id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const updatedData = { ...node.data, ...newData };
          
          // Sync with the actual Tone.js objects in our AudioEngine singleton
          if (node.type === 'oscillator') audioEngine.updateOscillator(id, updatedData.frequency, updatedData.type);
          if (node.type === 'gain') audioEngine.updateGain(id, updatedData.gain, updatedData.muted);
          if (node.type === 'delay') audioEngine.updateDelay(id, updatedData.delayTime, updatedData.feedback);
          if (node.type === 'sequencer' && newData.bpm) audioEngine.setBPM(newData.bpm);

          return { ...node, data: updatedData };
        }
        return node;
      })
    );
  }, [setNodes]);

  /**
   * addNode
   * Creates a new node of a specific type and adds it to the workspace.
   */
  const addNode = (type: string) => {
    const id = `${type}-${Date.now()}`; // Unique ID based on type and timestamp
    const newNode = {
      id,
      type,
      position: { x: 100, y: 100 },
      data: {
        // Default values for new nodes
        frequency: 440,
        type: 'sine',
        gain: 0.5,
        muted: false,
        delayTime: 0.3,
        feedback: 0.4,
        steps: Array(16).fill(false),
        isPlaying: false,
        bpm: 120,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    
    // Immediately initialize the audio node in Tone.js
    if (type === 'oscillator') audioEngine.updateOscillator(id, 440, 'sine');
    if (type === 'gain') audioEngine.updateGain(id, 0.5, false);
    if (type === 'delay') audioEngine.updateDelay(id, 0.3, 0.4);
  };

  /**
   * startAudio
   * Initializes the AudioEngine and sets up the Sequencer "ticker".
   */
  const startAudio = async () => {
    await audioEngine.start();
    
    audioEngine.scheduleStep((stepIndex) => {
        setNodes((nds) => nds.map(node => {
            if (node.type === 'sequencer') {
                if (node.data.steps[stepIndex]) {
                    const connectedEdges = edgesRef.current.filter(e => e.source === node.id);
                    connectedEdges.forEach(edge => {
                        audioEngine.triggerNote(edge.target, 0.5);
                    });
                }
                return { ...node, data: { ...node.data, currentStep: stepIndex } };
            }
            return node;
        }));
    });

    setIsAudioStarted(true);
  };

  /**
   * useEffect: Handlers Injection
   * We must inject the interactive handlers into the data object of every node
   * so the custom components (OscillatorNode, etc.) can communicate back to the canvas.
   */
  useEffect(() => {
    setNodes((nds) => nds.map(node => ({
        ...node,
        data: {
            ...node.data,
            onFrequencyChange: (freq: number) => onNodeDataChange(node.id, { frequency: freq }),
            onTypeChange: (type: string) => onNodeDataChange(node.id, { type }),
            onTrigger: () => { if (node.type === 'gain') audioEngine.triggerNote(node.id, node.data.gain); },
            onTogglePlay: () => {
                const newState = !node.data.isPlaying;
                audioEngine.toggleTransport(newState);
                onNodeDataChange(node.id, { isPlaying: newState });
            },
            onChange: (val: any) => onNodeDataChange(node.id, val)
        }
    })));
  }, [onNodeDataChange, setNodes, isAudioStarted]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
    if (params.source && params.target) audioEngine.connect(params.source, params.target);
  }, [setEdges]);

  const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
    edgesToDelete.forEach(edge => audioEngine.disconnect(edge.source, edge.target));
  }, []);

  return (
    <div className="h-[80vh] w-full border-2 border-gray-200 rounded-3xl overflow-hidden bg-white shadow-2xl relative">
      {!isAudioStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Ready to create?</h2>
            <p className="text-gray-500">The audio engine needs your permission to start.</p>
          </div>
          <button onClick={startAudio} className="px-12 py-6 bg-blue-600 text-white font-black text-2xl rounded-3xl shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center space-x-4">
             <span>🚀 START WORKSPACE</span>
          </button>
        </div>
      )}

      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect} 
        onEdgesDelete={onEdgesDelete} 
        nodeTypes={nodeTypes} 
        fitView
      >
        <Background color="#e2e8f0" variant="dots" gap={20} size={1} />
        <Controls />
        
        {/* Node Selection Menu */}
        <Panel position="top-left" className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl flex flex-col space-y-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Add Modules</h3>
            <button onClick={() => addNode('oscillator')} className="px-4 py-2 bg-blue-500 text-white text-[10px] font-bold rounded-lg hover:bg-blue-600 transition-all uppercase">+ Oscillator</button>
            <button onClick={() => addNode('gain')} className="px-4 py-2 bg-orange-500 text-white text-[10px] font-bold rounded-lg hover:bg-orange-600 transition-all uppercase">+ Volume / VCA</button>
            <button onClick={() => addNode('delay')} className="px-4 py-2 bg-purple-500 text-white text-[10px] font-bold rounded-lg hover:bg-purple-600 transition-all uppercase">+ Delay FX</button>
            <button onClick={() => addNode('sequencer')} className="px-4 py-2 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600 transition-all uppercase">+ Timeline</button>
        </Panel>
      </ReactFlow>
    </div>
  );
}