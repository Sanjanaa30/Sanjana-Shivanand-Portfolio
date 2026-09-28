import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import DataObjects from './DataObjects';

export default function DataFieldCanvas({ objectCount, dustCount, scrollRef, pointerRef }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 52, near: 0.1, far: 160, position: [0, 0, 16] }}
    >
      <fogExp2 attach="fog" args={[0x000000, 0.03]} />
      <DataObjects objectCount={objectCount} dustCount={dustCount} scrollRef={scrollRef} pointerRef={pointerRef} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.5} luminanceThreshold={0.22} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
