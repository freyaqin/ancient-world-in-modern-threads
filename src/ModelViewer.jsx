import Arrow from './Arrow';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function ModelViewer({ object }) {
  const host = useRef(null);
  const actions = useRef(null);
  const [status, setStatus] = useState('Loading the 3D garment…');
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [jacketOn, setJacketOn] = useState(true);
  const modelUrl = !jacketOn && object.modelWithoutJacket ? object.modelWithoutJacket : object.model;

  useEffect(() => {
    const container = host.current;
    const abort = new AbortController();
    let renderer, controls, model, observer, environment;
    function disposeModel(root) {
      const geometries = new Set(), materials = new Set(), textures = new Set();
      root?.traverse(node => {
        if (node.geometry) geometries.add(node.geometry);
        for (const material of (Array.isArray(node.material) ? node.material : [node.material])) {
          if (!material) continue;
          materials.add(material);
          Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); });
        }
      });
      textures.forEach(texture => { texture.dispose(); texture.source?.data?.close?.(); });
      materials.forEach(material => material.dispose());
      geometries.forEach(geometry => geometry.dispose());
    }
    let disposed = false;
    setReady(false); setFailed(false); setStatus('Loading the 3D garment…');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
    const render = () => { if (!disposed && renderer) renderer.render(scene, camera); };
    const fail = () => {
      if (!disposed) { setReady(false); setFailed(true); setStatus('The 3D view could not load. You can retry or return to the Object photograph.'); }
    };
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      const studio = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(renderer);
      environment = pmrem.fromScene(studio, .04);
      scene.environment = environment.texture;
      studio.dispose(); pmrem.dispose();
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.addEventListener('webglcontextlost', fail);
      container.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x999999, 2));
      const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(3, 4, 5); scene.add(key);
      const fill = new THREE.DirectionalLight(0xffffff, 1); fill.position.set(-3, 1, -2); scene.add(fill);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = false; // Explicit buttons avoid intercepting page scroll.
      controls.minPolarAngle = Math.PI * .15;
      controls.maxPolarAngle = Math.PI * .85;
      controls.addEventListener('change', render);
      let modelWidth = .6, modelDepth = .3;
      const fitDistance = () => Math.max(1, modelWidth / camera.aspect) / (2 * Math.tan(THREE.MathUtils.degToRad(16))) * 1.15 + modelDepth / 2;
      const reset = () => { camera.position.set(0, 0, fitDistance()); controls.target.set(0, 0, 0); controls.update(); render(); };
      const orbit = (angle) => {
        const relative = camera.position.clone().sub(controls.target);
        relative.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        camera.position.copy(relative.add(controls.target)); controls.update(); render();
      };
      const zoom = (factor) => {
        const relative = camera.position.clone().sub(controls.target);
        relative.setLength(THREE.MathUtils.clamp(relative.length() * factor, .6, fitDistance() * 2.5));
        camera.position.copy(relative.add(controls.target)); controls.update(); render();
      };
      actions.current = { left: () => orbit(-Math.PI / 8), right: () => orbit(Math.PI / 8), in: () => zoom(.85), out: () => zoom(1.18), reset };
      reset();
      observer = new ResizeObserver(() => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); reset();
      });
      observer.observe(container);
      (async () => {
        try {
          const response = await fetch(modelUrl, { signal: abort.signal });
          if (!response.ok) throw new Error('Model unavailable');
          const buffer = await response.arrayBuffer();
          if (disposed) return;
          const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(buffer, '');
          if (disposed) { disposeModel(gltf.scene); return; }
          model = gltf.scene;
          model.rotation.set(...object.modelRotation);
          model.updateMatrixWorld(true);
          const bounds = new THREE.Box3().setFromObject(model);
          const size = bounds.getSize(new THREE.Vector3());
          if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('Empty model');
          const center = bounds.getCenter(new THREE.Vector3());
          // Preserve the export's materials, textures, and internal transforms.
          const framed = new THREE.Group();
          framed.add(model);
          model.position.sub(center);
          framed.scale.setScalar(1 / size.y);
          scene.add(framed);
          modelWidth = size.x / size.y; modelDepth = size.z / size.y;
          reset();
          render(); setReady(true); setStatus('3D garment ready. Drag to rotate, or use the controls below.');
        } catch (error) { if (error.name !== 'AbortError') fail(); }
      })();
    } catch { fail(); }
    return () => {
      disposed = true; abort.abort(); observer?.disconnect(); controls?.dispose();
      disposeModel(model); environment?.dispose(); renderer?.dispose();
      renderer?.domElement.removeEventListener('webglcontextlost', fail);
      renderer?.domElement.remove(); actions.current = null;
    };
  }, [object, attempt, modelUrl]);

  function onKeyDown(event) {
    const action = { ArrowLeft: 'left', ArrowRight: 'right', '+': 'in', '=': 'in', '-': 'out', Home: 'reset' }[event.key];
    if (action && ready) { event.preventDefault(); actions.current?.[action](); }
  }
  return <div className="model-viewer">
    {object.modelWithoutJacket && <div className="jacket-control"><span>Jacket</span><button type="button" role="switch" aria-checked={jacketOn} aria-label="Jacket" onClick={() => setJacketOn(value => !value)}><span className="switch-track" aria-hidden="true"><span/></span><span aria-hidden="true">{jacketOn ? 'On' : 'Off'}</span></button></div>}
    <div ref={host} className="model-canvas" role="group" aria-label={object.modelDescription} aria-describedby="model-instructions" tabIndex="0" onKeyDown={onKeyDown} />
    <p role="status" className="model-status">{status}</p>
    {failed && <button className="retry-button" onClick={() => setAttempt(value => value + 1)}>Retry 3D view</button>}
    <div className="model-controls" aria-label="3D model controls">
      <button disabled={!ready} onClick={() => actions.current?.left()} aria-label="Rotate left"><Arrow direction="rotate-left"/></button>
      <button disabled={!ready} onClick={() => actions.current?.right()} aria-label="Rotate right"><Arrow direction="rotate-right"/></button>
      <button disabled={!ready} onClick={() => actions.current?.in()} aria-label="Zoom in">+</button>
      <button disabled={!ready} onClick={() => actions.current?.out()} aria-label="Zoom out">−</button>
      <button disabled={!ready} onClick={() => actions.current?.reset()}>Reset</button>
    </div>
    <p id="model-instructions" className="viewer-hint">Drag to turn · Arrow keys to rotate · + / − to zoom · Home to reset</p>
    <p className="model-note">This AI reconstruction by Tripo.ai offers an approximation of the silhouette; color, texture, and surface design may not be faithfully represented.<br/>Compare the AI recreation with the original garment or its collection photograph: what is missing or changed, and how does that shape your understanding of what AI can—and cannot—represent?</p>
  </div>;
}
