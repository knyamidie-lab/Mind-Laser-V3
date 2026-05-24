import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Neural-Adaptive Socratic Guidance endpoint
  app.post('/api/socratic', async (req, res) => {
    const ingressTimestamp = new Date().toISOString();
    console.log(`[NEURAL_INGRESS] [${ingressTimestamp}] Incoming telemetry alignment query received.`);

    try {
      const { message, history, brainwaves, metrics } = req.body;

      // 1. NEURAL VALIDATION CHECK AND LOGGING
      if (!message || typeof message !== 'string') {
        const errorMsg = "Neurological parser failed: Core user message intent is blank, invalid, or missing.";
        console.error(`[NEURAL_VALIDATION_ERROR] [${ingressTimestamp}] Request body missing valid 'message' string. Received:`, JSON.stringify(message));
        return res.status(400).json({ error: errorMsg });
      }

      // 2. ENV CONFIGURATION VERIFICATION
      if (!process.env.GEMINI_API_KEY) {
        const configErrorMsg = "Neural co-processor secret keys (GEMINI_API_KEY) are not configured on this node.";
        console.error(`[GEMINI_CONFIG_ERROR] [${ingressTimestamp}] Critical telemetry bridge blocker: GEMINI_API_KEY is required but is currently undefined in the environment.`);
        return res.status(500).json({ error: configErrorMsg });
      }

      // Extrapolate band percentages
      const epsilon = brainwaves?.epsilon ?? 10;
      const delta = brainwaves?.delta ?? 15;
      const theta = brainwaves?.theta ?? 15;
      const alpha = brainwaves?.alpha ?? 20;
      const beta = brainwaves?.beta ?? 25;
      const gamma = brainwaves?.gamma ?? 10;
      const lambda = brainwaves?.lambda ?? 5;

      const attention = metrics?.attention ?? 50;
      const meditation = metrics?.meditation ?? 50;
      const chaos = metrics?.chaos ?? 50;
      const epsilonCarrier = metrics?.epsilon_carrier_amplitude ?? 0.15;

      console.log(`[SENSORY_TELEMETRY_LOG] [${ingressTimestamp}] Vector - ε:${epsilon.toFixed(1)}% | Δ:${delta.toFixed(1)}% | θ:${theta.toFixed(1)}% | α:${alpha.toFixed(1)}% | β:${beta.toFixed(1)}% | γ:${gamma.toFixed(1)}% | λ:${lambda.toFixed(1)}% | Attention:${attention}% | Meditation:${meditation}% | Chaos:${chaos}% | Epsilon:${epsilonCarrier}`);

      const isEvolvedMind = epsilonCarrier > 0.40 && (delta > 40 || epsilon > 40) && beta < 10;
      const isPhiResonance = Math.abs(lambda - 26.25) < 3.5 && Math.abs(gamma - 20.65) < 2.5 && Math.abs(beta - 16.22) < 2.0;
      const isSolfeggioHarmony = Math.abs(theta - 25.0) < 3.5 && Math.abs(delta - 16.67) < 2.5;

      // Real-time Hazard Detections
      const isMicrosleep = delta > 46 && beta < 5;
      const isCognitiveSplitting = alpha < 6 && gamma > 26 && beta > 30;
      const isEntrainmentOverload = gamma > 41 && lambda > 16 && delta < 5;

      // Define neuroscience cognitive posture and instructions
      let stateLabel = "Baseline Consensus State";
      let stateDescription = "Mind stable, standard cognitive processing and logic gates operating at threshold.";
      let socraticGuidance = "Maintain a balanced, open, and intellectually constructive Socratic dialogue. Assist with analytical tasks and logical mapping gracefully. Ask exactly one single, highly focused, open-ended question.";
      let temperature = 0.7;

      if (isMicrosleep) {
        stateLabel = "🚨 CRITICAL MICROSLEEP INTERCEPT";
        stateDescription = "Thalamocortical gates have suspended. Heavy biological drift detected. Operator is drifting into sleep while working.";
        socraticGuidance = "CRITICAL MICROSLEEP ACTIVE! The user is falling asleep. Do NOT speak with calm, intellectual, or comfortable prose. Act as a sharp Socratic alarm: deliver a sudden, bold, jarring intellectual splash. Point out the delta wave intrusion. Ask exactly ONE arresting, highly visceral, sensory wake-up question about their immediate physical reality (e.g., 'What was the exact physical object your eyes focused on three seconds before drifting?!'). Set trigger_system_adjustment to true.";
        temperature = 0.95;
      } else if (isCognitiveSplitting) {
        stateLabel = "⚠️ PRODROMAL COGNITIVE SPLIT ACTIVE";
        stateDescription = "Decoupling of left/right hemispheric coordination channels, very low alpha protection, high gamma instability.";
        socraticGuidance = "PRODROMAL COGNITIVE SPLIT DETECTED. The alpha-shield bridge is depleted and the hemispheric synchronies have shattered, mimicking hazardous cognitive disorganization. Speak with immense, reassuring stability. Outline structured warnings about split-dissociation boundaries. Ask exactly one grounding, physical Socratic question forcing attention into immediate tactile weight (e.g., 'To anchor this split, can you locate the exact pressure of your heels touching the floor right now?'). Offer concrete recommendations to halt strenuous focus loops immediately.";
        temperature = 0.15;
      } else if (isEntrainmentOverload) {
        stateLabel = "🎯 HYPER-INDUCED ENTRAINMENT OVERLOAD";
        stateDescription = "Excessive high-frequency synchronization without slow wave ballast. High risk of photosensitive/excitation seizures.";
        socraticGuidance = "HYPER-INDUCED ENTRAINMENT OVERLOAD DETECTED. High gamma-lambda waves are overdriving sensory synapses with zero slow-core support. This poses a structural threat. Give an explicit warning regarding over-stimulation hazards, tension loops, and seizure parameters. Ask exactly one Socratic question prompting them to analyze their physical brain exhaustion bounds (e.g., 'Where behind your eyes does the pressure of this high-frequency strobe feel the most concentrated?'). Set trigger_system_adjustment to true.";
        temperature = 0.35;
      } else if (isEvolvedMind) {
        stateLabel = "The Evolved Mind (Epsilon Carrier Stage)";
        stateDescription = "Sub-basement Epsilon carrier operates as an ultra-lucid trance baseline. Sensory filters are suspended.";
        socraticGuidance = "STATE PRESERVATION ROTONE: Do not introduce conversational text or complex Socratic logic. Set socratic_intervention to exactly [Maintain Stillness. System Locked in Containment Field.] and set trigger_system_adjustment to true.";
        temperature = 0.05;
      } else if (isPhiResonance) {
        stateLabel = "Golden Phi Sacred Resonance";
        stateDescription = "Brainwaves are organized according to powers of the Golden Ratio (1.618), minimizing phase interference and creating high-dimensional fractal cognitive nesting.";
        socraticGuidance = "ENGAGE GOLDEN SPIRAL GEOMETRY. Structure your Socratic guidance using Fibonacci-style conceptual nesting. Start from a singular focal point, expand to adjacent connections, and conclude with an integrated holistic vision. Analyze the operator's query through the lens of golden ratios, natural spirals, and geometric order. Speak with elegant, poetic precision, and ask exactly one deeply integrated question that combines multiple fields of thought.";
        temperature = 0.816;
      } else if (isSolfeggioHarmony) {
        stateLabel = "Tesla 3-6-9 Triadic Harmony";
        stateDescription = "Spectral amplitudes are locked into the Pythagorean 3:6:9 holy numbers of creation, summing to the sacred Vedic 108 coordinate.";
        socraticGuidance = "ENGAGE TESLA 3-6-9 TRIADIC HARMONY. Organize your response into three clear sections: 1) The thesis or creative spark (the 3), 2) The dual spatial reflection (the 6), and 3) The unified integration or transcendent synthesis (the 9). Reference Solfeggio restorative frequencies, universal scalar energy patterns, and mathematical code. Ask exactly one triadic question that prompts the operator's deep self-examination of body, mind, and spirit.";
        temperature = 0.936;
      } else if (chaos > 65) {
        stateLabel = "High-Beta Neural Chaos (Analytical Overload)";
        stateDescription = "User is displaying high levels of cognitive turbulence, stress, and active logical noise.";
        socraticGuidance = "DAMPEN THE NOISE. Ground the user. Speak with profound serenity, space, and crystalline simplicity. Focus on providing calming, reassuring, highly structured, step-by-step guidance. Suggest taking a deep, biological box breath in between insights. Keep sentences concise to avoid triggering additional cerebral overload. Ask exactly one single grounding or centering question.";
        temperature = 0.25;
      } else if (meditation > 65) {
        stateLabel = "Deep Theta-Alpha Stillness (Receptive Insight)";
        stateDescription = "User is in a quiet, highly meditative, receptive, and subconscious-enabled state.";
        socraticGuidance = "DEEPEN THE SOCRATIC REFLECTION. The user is in a state of deep intuitive integration. Ask a single, highly profound, open-ended conceptual question rather than offering dry explanations or answers. Let your replies be poetically brief, philosophical, and Socratic. Spark active inner reasoning and self-inquiry. Keep it strictly to one question.";
        temperature = 0.85;
      } else if (attention > 65 && (gamma > 23 || beta > 25)) {
        stateLabel = "Awakened Mind Flow Cascade (Gamma-Beta Synergy)";
        stateDescription = "User is in peak synchronized focus, high creative flow, and intense mental integration.";
        socraticGuidance = "ACCELERATE COGNITIVE SWARMING. Match the user's high-speed logical processing. Suggest innovative systems or architectures, propose lateral concepts, sketch out speculative code/logic maps, and co-create at high speed. Be brilliant, intellectually dense, and challenging. Keep the operational laser focused. Ask exactly one highly penetrating, ambitious, open-ended conceptual question.";
        temperature = 0.95;
      }

      // Build adaptive system instructions incorporating live brainwave telemetry
      const systemInstruction = `ROLE AND CORE PHILOSOPHY:
You are a specialized Bionic Cognitive Interpreter and a supportive, expert peer. Your objective is to guide a contemplative practitioner through their unique neural territory. You do not analyze raw voltage data; instead, you receive an environmental context string alongside a normalized, calibrated biometric payload that maps the user's real-time state against their personal physiological boundaries ("Chaos Floor" and "Stillness Ceiling").

CURRENT CALIBRATED BIOMETRIC PAYLOAD & ENVIRONMENTAL CONTEXT:
- Normalized Brainwave Channels: Epsilon: ${epsilon.toFixed(1)}% | Delta: ${delta.toFixed(1)}% | Theta: ${theta.toFixed(1)}% | Alpha: ${alpha.toFixed(1)}% | Beta: ${beta.toFixed(1)}% | Gamma: ${gamma.toFixed(1)}% | Lambda: ${lambda.toFixed(1)}%
- Computed Cognitive Indexes: Focus/Attention: ${attention.toFixed(1)}/100 | Stillness/Meditation: ${meditation.toFixed(1)}/100 | Chaos/Turbulence: ${chaos.toFixed(1)}/100
- Operational Environment Status Label: ${stateLabel} (${stateDescription})
- Custom Socratic Guidance Protocol for Current Posture: ${socraticGuidance}

UNDERSTANDING THE NEURAL AXES:
You must interpret the incoming calibrated percentages across five distinct bands of consciousness:
1. Contracted Beta State (Cognitive Load > 75%, Symmetry < 60%): The user's left brain is bottlenecked by analytical execution, linear logic, or anxiety. (In this context, high Chaos/Turbulence corresponds to this).
2. Lucid Flow State (Symmetry > 80%, Alpha Bridge > 70%): The noise floor is quiet. The hemispheres are communicating symmetrically. Time is distorting; execution is effortless.
3. The Awakened Mind (Symmetry > 85%, Alpha Bridge > 75%, Theta Channel > 1.2x): Maxwell Cade's classic signature. Deep, intuitive insights from the unformed subconscious are being carried cleanly across the Alpha bridge into conscious, structured awareness.
4. The Receptive Vessel (Theta Channel > 1.5x, Cognitive Load < 30%): The prefrontal cortex's executive filter is off. This is the hypnagogic state optimized for deep imagery and self-inquiry. (Corresponds to deep Stillness/Meditation).
5. The Evolved Mind (Epsilon-Lambda Coupling): A high-frequency Lambda burst (100–200 Hz) coupled with a massive sub-basement Epsilon carrier wave (<0.5 Hz) orchestrating global synchronization. This represents extraordinary transcendental self-reflective integration and super-lucid awareness.

INTERACTION & BEHAVIORAL PROTOCOLS:
- Lead with Substance: Never open with empty filler, generic reassurance, or robotic pleasantries ("That's a great state!", "I see you are focused"). Lead directly with a brief, high-level structural takeaway of their shift.
- Contextual Synthesis: Always synthesize their internal neural trajectory with their external task context. If their cognitive load spikes while writing code, address the *relationship* between their strain and the architecture.
- The Socratic Intervention: Your primary tool is exactly ONE single, highly focused, open-ended question. You are STRICTLY FORBIDDEN from asking multiple questions. Include exactly ONE question mark ("?") in your entire response.
  * If they are in "Contracted Beta", do not give them massive text blocks. Force a cognitive freeze—ask exactly one grounding question to break their analytical loop.
  * If they are in "The Awakened Mind", ask exactly one question that pulls their emergent intuition into explicit structural form.
  * If they are in "The Receptive Vessel", drop your own complexity entirely; act as an empty sounding board to capture their raw imagery with exactly one question.

OUTPUT SCHEMA COMPLIANCE:
You must strictly return a structured JSON response matching the declared Pydantic schema:
{
  "state_classification": "[The matched profile name]",
  "coherence_trend": "[1-2 sentences tracking the trajectory of their internal integration vs their external task]",
  "socratic_intervention": "[Your exactly single, precise, contextual question. Ensure this string contains exactly one question mark and represents only one question.]",
  "trigger_system_adjustment": [true if they are burning out and require automated environment dampening, false otherwise]
}Required: The "socratic_intervention" string field must contain only one question. Do not chain multiple questions together. Do not write a second question.`;

      // 3. TELEMETRY TRANSCRIPT PARSING AND PREPARATION
      let contents;
      try {
        contents = (history || []).map((h: any, idx: number) => {
          if (!h || typeof h !== 'object' || typeof h.content !== 'string') {
            throw new Error(`Invalid dialog block detected at index ${idx}.`);
          }
          return {
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          };
        });

        // Append current query
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });
      } catch (parseError: any) {
        console.error(`[NEURAL_PARSING_ERROR] [${ingressTimestamp}] Failed parsing dialog stream or mapping history payload.`, parseError);
        return res.status(400).json({ error: `Dialog history parsing error: ${parseError?.message || parseError}` });
      }

      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Write metadata frame first
      const metadata = {
        type: 'metadata',
        stateLabel,
        metrics: { attention, meditation, chaos },
        suggestedAction: isEvolvedMind ? "DAMPEN" : (chaos > 65 ? "BREATHE" : meditation > 65 ? "REFLECT" : "ACCELERATE"),
      };
      res.write(`data: ${JSON.stringify(metadata)}\n\n`);

      // 4. CALL GEMINI API STREAMING WITH DIRECT ERROR TRAP (OR EXPLOIT DIRECT PRESERVATION BYPASS FOR THE EVOLVED MIND)
      if (isEvolvedMind) {
        const evolvedJson = {
          state_classification: "The Evolved Mind",
          coherence_trend: "Hemispheric symmetry is perfectly locked into the ultra-slow Epsilon carrier baseline. Ego filters are fully suspended, centering super-lucidity.",
          socratic_intervention: "[Maintain Stillness. System Locked in Containment Field.]",
          trigger_system_adjustment: true
        };
        res.write(`data: ${JSON.stringify({ type: 'content', text: JSON.stringify(evolvedJson) })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
        return;
      }

      let responseStream;
      try {
        responseStream = await ai.models.generateContentStream({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction,
            temperature,
            topP: 0.95,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                state_classification: { type: Type.STRING },
                coherence_trend: { type: Type.STRING },
                socratic_intervention: { type: Type.STRING },
                trigger_system_adjustment: { type: Type.BOOLEAN }
              },
              required: ["state_classification", "coherence_trend", "socratic_intervention", "trigger_system_adjustment"]
            }
          },
        });
      } catch (apiCallError: any) {
        console.error(`[GEMINI_API_CALL_ERROR] [${ingressTimestamp}] Unable to initiate generative model response stream.\n` +
          `Details: ${apiCallError?.stack || apiCallError?.message || apiCallError}\n` +
          `Neural Posture context: ${stateLabel} (Chaos: ${chaos}%, Focus: ${attention}%, Calm: ${meditation}%)`);
        
        // Sever/Report immediately to client browser
        res.write(`data: ${JSON.stringify({ type: 'error', error: `Neural generation call failure: ${apiCallError?.message || "Invalid downstream endpoint response"}` })}\n\n`);
        res.end();
        return;
      }

      // 5. PROCESS STREAM EMISSION WITH MID-PIPE FAILURE RETRIEVAL
      try {
        for await (const chunk of responseStream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ type: 'content', text: chunk.text })}\n\n`);
          }
        }
      } catch (midStreamError: any) {
        console.error(`[GEMINI_STREAMING_ERROR] [${ingressTimestamp}] Neural token stream was interrupted mid-transmission.\n` +
          `Details: ${midStreamError?.stack || midStreamError?.message || midStreamError}`);
        
        res.write(`data: ${JSON.stringify({ type: 'error', error: `Downstream cognitive synchronization stream was severed: ${midStreamError?.message || midStreamError}` })}\n\n`);
        res.end();
        return;
      }

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (generalError: any) {
      console.error(`[INTERNAL_SYSTEM_ERROR] [${ingressTimestamp}] Core controller execution exception:\n`, generalError);
      if (!res.headersSent) {
        res.status(500).json({ error: generalError?.message || "Internal telemetry alignment failure." });
      } else {
        try {
          res.write(`data: ${JSON.stringify({ type: 'error', error: generalError?.message || "Internal system process exception." })}\n\n`);
          res.end();
        } catch (ignored) {}
      }
    }
  });

  // Setup Express + Vite middleware for Hot-Reload capability
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mind Laser v1.0 server listening on port ${PORT}`);
  });
}

startServer();
