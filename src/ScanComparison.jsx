import React, { useMemo, useRef } from 'react';
import ModelViewer from './ModelViewer';

export default function ScanComparison({ object }) {
  const sync = useRef({ listeners: new Set(), position: null });
  const scan = useMemo(() => ({ ...object, model: object.bodyScan, modelWithoutJacket: null,
    modelRotation: object.bodyScanRotation || [0, 0, 0],
    modelDescription: 'Rotatable body scan of the dressform with jacket. Rotation and zoom are linked to the AI reconstruction.' }), [object]);
  return <section className="scan-comparison" aria-label="Body scan and AI reconstruction comparison">
    <h2>Body scan &amp; AI reconstruction</h2>
    <p>Turn or zoom either model to explore both together. Each is fitted to its own height; this is a visual comparison, not a measurement comparison. The scan shows the jacket on.</p>
    <div className="scan-comparison-grid">
      <section><h3>3D body scan</h3><ModelViewer object={scan} sync={sync} scan /></section>
      <section><h3>AI reconstruction</h3><ModelViewer object={object} sync={sync} /></section>
    </div>
  </section>;
}
