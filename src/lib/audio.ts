import * as Tone from 'tone';

/**
 * AudioEngine
 * Manages the lifecycle of audio nodes and the high-precision timing (Transport).
 */
class AudioEngine {
  private nodes: Map<string, any> = new Map();
  private sequences: Map<string, number> = new Map(); // Tracks scheduled events

  constructor() {}

  /**
   * start
   * Initializes the audio context. This MUST be called after a user gesture.
   */
  async start() {
    await Tone.start();
    if (!this.nodes.has('output')) {
      this.nodes.set('output', Tone.getDestination());
    }
    // Set default tempo to 120 Beats Per Minute
    Tone.Transport.bpm.value = 120;
    console.log("Audio Engine & Transport Ready");
  }

  /**
   * toggleTransport
   * Starts or stops the global timeline.
   */
  toggleTransport(playing: boolean) {
    if (playing) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      Tone.Transport.position = 0; // Reset timeline to the beginning
    }
  }

  setBPM(bpm: number) {
    Tone.Transport.bpm.rampTo(bpm, 0.1);
  }

  /**
   * scheduleStep
   * Schedules a callback to happen every 16th note. 
   * This is how we drive the Sequencer UI and logic.
   */
  scheduleStep(callback: (step: number) => void) {
    return Tone.Transport.scheduleRepeat((time) => {
        // Calculate the current 16th note step (0-15)
        const step = Math.floor((Tone.Transport.ticks / 120) % 16);
        Tone.Draw.schedule(() => {
            callback(step);
        }, time);
    }, "16n");
  }

  // --- NODE MANAGEMENT ---

  updateOscillator(id: string, frequency: number, type: string) {
    let osc = this.nodes.get(id);
    if (!osc) {
      osc = new Tone.Oscillator(frequency, type as any).start();
      this.nodes.set(id, osc);
    } else {
      osc.frequency.rampTo(frequency, 0.05);
      osc.type = type;
    }
  }

  updateGain(id: string, volume: number, muted: boolean = false) {
    let gain = this.nodes.get(id);
    if (!gain) {
      gain = new Tone.Gain(muted ? 0 : volume);
      this.nodes.set(id, gain);
    } else {
      gain.gain.rampTo(muted ? 0 : volume, 0.05);
    }
  }

  updateDelay(id: string, delayTime: number, feedback: number) {
    let delay = this.nodes.get(id);
    if (!delay) {
      delay = new Tone.FeedbackDelay(delayTime, feedback);
      this.nodes.set(id, delay);
    } else {
      delay.delayTime.rampTo(delayTime, 0.05);
      delay.feedback.rampTo(feedback, 0.05);
    }
  }

  /**
   * triggerNote
   * Briefly pulses a gain node's volume. This is called by the Sequencer.
   */
  triggerNote(gainId: string, volume: number) {
    const gain = this.nodes.get(gainId);
    if (gain instanceof Tone.Gain) {
      const now = Tone.now();
      // We schedule a quick "Attack-Decay" envelope
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02); // Fast attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4); // Smooth release
    }
  }

  // --- CONNECTIVITY ---

  connect(sourceId: string, targetId: string) {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    if (source && target) {
      source.connect(target);
    }
  }

  disconnect(sourceId: string, targetId: string) {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    if (source && target) {
      source.disconnect(target);
    }
  }

  removeNode(id: string) {
    const node = this.nodes.get(id);
    if (node && id !== 'output') {
      node.dispose();
      this.nodes.delete(id);
    }
  }
}

export const audioEngine = new AudioEngine();