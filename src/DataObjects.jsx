import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const FAR = -78;
const NEAR = 14;
const SPREAD_X = 17;
const SPREAD_Y = 12;

function edgesOf(geometry, matrix) {
  const edges = new THREE.EdgesGeometry(geometry, 18);
  if (matrix) edges.applyMatrix4(matrix);
  geometry.dispose();
  return edges;
}

/* Objects dissolve before they reach the camera, so nothing large and sharp
   ever crosses the headline. Fog handles the far end; this handles the near. */
function applyNearFade(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = `varying float vViewDepth;\n${shader.vertexShader}`.replace(
      '#include <fog_vertex>',
      '#include <fog_vertex>\n\tvViewDepth = -mvPosition.z;'
    );
    shader.fragmentShader = `varying float vViewDepth;\n${shader.fragmentShader}`.replace(
      '#include <fog_fragment>',
      '#include <fog_fragment>\n\tgl_FragColor.a *= smoothstep(1.5, 9.5, vViewDepth);'
    );
  };
  return material;
}

function lineGeometry(points) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

function ringPoints(radius, segments, target = []) {
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const b = ((i + 1) / segments) * Math.PI * 2;
    target.push(Math.cos(a) * radius, Math.sin(a) * radius, 0, Math.cos(b) * radius, Math.sin(b) * radius, 0);
  }
  return target;
}

function circleAt(cx, cy, radius, segments, target) {
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const b = ((i + 1) / segments) * Math.PI * 2;
    target.push(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, 0,
      cx + Math.cos(b) * radius, cy + Math.sin(b) * radius, 0);
  }
}

function squareAt(cx, cy, half, target) {
  const corners = [[-half, -half], [half, -half], [half, half], [-half, half]];
  corners.forEach(([x, y], i) => {
    const [nx, ny] = corners[(i + 1) % 4];
    target.push(cx + x, cy + y, 0, cx + nx, cy + ny, 0);
  });
}

function segment(x1, y1, x2, y2, target) {
  target.push(x1, y1, 0, x2, y2, 0);
}

/* Recognisable data objects, drawn as technical wireframe. */
const builders = [
  function database() {
    const drums = [0, 1, 2].map((i) => edgesOf(
      new THREE.CylinderGeometry(0.62, 0.62, 0.3, 22),
      new THREE.Matrix4().makeTranslation(0, (i - 1) * 0.36, 0)
    ));
    return mergeGeometries(drums);
  },
  function barChart() {
    const heights = [0.46, 0.92, 0.64, 1.24, 0.82];
    const bars = heights.map((h, i) => edgesOf(
      new THREE.BoxGeometry(0.22, h, 0.22),
      new THREE.Matrix4().makeTranslation((i - 2) * 0.32, h / 2 - 0.62, 0)
    ));
    return mergeGeometries(bars);
  },
  function networkGraph() {
    return edgesOf(new THREE.IcosahedronGeometry(0.85, 0));
  },
  function dataGrid() {
    const points = [];
    const size = 1.7;
    const divisions = 4;
    for (let i = 0; i <= divisions; i += 1) {
      const t = -size / 2 + (i / divisions) * size;
      points.push(-size / 2, t, 0, size / 2, t, 0);
      points.push(t, -size / 2, 0, t, size / 2, 0);
    }
    return lineGeometry(points);
  },
  function pieChart() {
    const points = ringPoints(0.82, 40);
    ringPoints(0.36, 26, points);
    [0.4, 2.3, 4.6].forEach((a) => {
      points.push(Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0, Math.cos(a) * 0.82, Math.sin(a) * 0.82, 0);
    });
    return lineGeometry(points);
  },
  function layerStack() {
    const plates = [0, 1, 2].map((i) => edgesOf(
      new THREE.BoxGeometry(1.15, 0.13, 0.85),
      new THREE.Matrix4().makeTranslation(i * 0.09, i * 0.3 - 0.3, 0)
    ));
    return mergeGeometries(plates);
  },
  function pipeline() {
    const nodes = [[-1.05, 0.34], [0, -0.28], [1.05, 0.4]];
    const points = [];
    nodes.forEach(([x, y], index) => {
      for (let i = 0; i < 12; i += 1) {
        const a = (i / 12) * Math.PI * 2;
        const b = ((i + 1) / 12) * Math.PI * 2;
        points.push(x + Math.cos(a) * 0.22, y + Math.sin(a) * 0.22, 0, x + Math.cos(b) * 0.22, y + Math.sin(b) * 0.22, 0);
      }
      const next = nodes[index + 1];
      if (next) points.push(x + 0.22, y, 0, next[0] - 0.22, next[1], 0);
    });
    return lineGeometry(points);
  },
  function lineageGraph() {
    const nodes = [[-1.2, 0], [-0.25, 0.6], [-0.25, -0.6], [0.7, 0.6], [0.7, -0.6], [1.6, 0]];
    const edges = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]];
    const points = [];
    edges.forEach(([from, to]) => {
      segment(nodes[from][0] + 0.17, nodes[from][1], nodes[to][0] - 0.17, nodes[to][1], points);
    });
    nodes.forEach(([x, y]) => squareAt(x, y, 0.17, points));
    return lineGeometry(points);
  },
  function neuralNetwork() {
    const columns = [
      { x: -0.85, rows: 3 },
      { x: 0, rows: 4 },
      { x: 0.85, rows: 3 }
    ];
    const positions = columns.map(({ x, rows }) => (
      Array.from({ length: rows }, (_, i) => [x, (i - (rows - 1) / 2) * 0.46])
    ));
    const points = [];
    for (let c = 0; c < positions.length - 1; c += 1) {
      positions[c].forEach(([x1, y1]) => {
        positions[c + 1].forEach(([x2, y2]) => segment(x1 + 0.13, y1, x2 - 0.13, y2, points));
      });
    }
    positions.flat().forEach(([x, y]) => circleAt(x, y, 0.13, 10, points));
    return lineGeometry(points);
  },
  function globe() {
    const points = [];
    const radius = 0.88;
    const segments = 26;
    for (let i = 1; i < 5; i += 1) {
      const phi = (i / 5) * Math.PI;
      const r = Math.sin(phi) * radius;
      const y = Math.cos(phi) * radius;
      for (let j = 0; j < segments; j += 1) {
        const a = (j / segments) * Math.PI * 2;
        const b = ((j + 1) / segments) * Math.PI * 2;
        points.push(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(b) * r, y, Math.sin(b) * r);
      }
    }
    for (let m = 0; m < 6; m += 1) {
      const theta = (m / 6) * Math.PI;
      for (let j = 0; j < segments; j += 1) {
        const a = (j / segments) * Math.PI * 2;
        const b = ((j + 1) / segments) * Math.PI * 2;
        points.push(
          Math.sin(a) * Math.cos(theta) * radius, Math.cos(a) * radius, Math.sin(a) * Math.sin(theta) * radius,
          Math.sin(b) * Math.cos(theta) * radius, Math.cos(b) * radius, Math.sin(b) * Math.sin(theta) * radius
        );
      }
    }
    return lineGeometry(points);
  },
  function trendChart() {
    const points = [];
    segment(-0.95, -0.7, -0.95, 0.75, points);
    segment(-0.95, -0.7, 1.0, -0.7, points);
    const series = [[-0.72, -0.34], [-0.34, 0.12], [0.02, -0.14], [0.4, 0.4], [0.78, 0.2]];
    series.forEach(([x, y], i) => {
      const next = series[i + 1];
      if (next) segment(x, y, next[0], next[1], points);
      squareAt(x, y, 0.06, points);
    });
    return lineGeometry(points);
  },
  function containerStack() {
    const boxes = [
      [-0.62, -0.42], [0, -0.42], [0.62, -0.42],
      [-0.31, 0.1], [0.31, 0.1],
      [0, 0.62]
    ];
    const parts = boxes.map(([x, y]) => edgesOf(
      new THREE.BoxGeometry(0.56, 0.44, 0.44),
      new THREE.Matrix4().makeTranslation(x, y, 0)
    ));
    return mergeGeometries(parts);
  }
];

export default function DataObjects({ objectCount, dustCount, scrollRef, pointerRef }) {
  const drift = useRef({ speed: 1, lastScroll: 0 });

  const { geometries, materials, meshes, dust, dustMaterial } = useMemo(() => {
    const builtGeometries = builders.map((build) => build());
    const builtMaterials = [0.62, 0.4, 0.24].map((opacity) => applyNearFade(new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity,
      fog: true,
      depthWrite: false
    })));

    const builtMeshes = [];
    for (let i = 0; i < objectCount; i += 1) {
      const geometry = builtGeometries[i % builtGeometries.length];
      const tier = i % 7 === 0 ? 0 : i % 3 === 0 ? 1 : 2;
      const line = new THREE.LineSegments(geometry, builtMaterials[tier]);
      const scale = tier === 0 ? 1.5 + Math.random() * 0.9 : 0.6 + Math.random() * 0.9;
      line.scale.setScalar(scale);
      line.position.set(
        (Math.random() - 0.5) * SPREAD_X * 2,
        (Math.random() - 0.5) * SPREAD_Y * 2,
        FAR + Math.random() * (NEAR - FAR)
      );
      line.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      line.userData = {
        rx: (Math.random() - 0.5) * 0.22,
        ry: (Math.random() - 0.5) * 0.26,
        rate: 0.6 + Math.random() * 0.9
      };
      builtMeshes.push(line);
    }

    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustPositions[i * 3] = (Math.random() - 0.5) * SPREAD_X * 2.4;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y * 2.4;
      dustPositions[i * 3 + 2] = FAR + Math.random() * (NEAR - FAR);
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const builtDustMaterial = applyNearFade(new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      fog: true,
      depthWrite: false
    }));

    return {
      geometries: builtGeometries,
      materials: builtMaterials,
      meshes: builtMeshes,
      dust: dustGeometry,
      dustMaterial: builtDustMaterial
    };
  }, [objectCount, dustCount]);

  useEffect(() => () => {
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    dust.dispose();
    dustMaterial.dispose();
  }, [geometries, materials, dust, dustMaterial]);

  useFrame(({ camera }, delta) => {
    const step = Math.min(delta, 0.05);
    const scroll = scrollRef.current ?? 0;
    const velocity = Math.abs(scroll - drift.current.lastScroll) / Math.max(step, 0.001);
    drift.current.lastScroll = scroll;
    const target = 1 + Math.min(velocity * 26, 7);
    drift.current.speed += (target - drift.current.speed) * Math.min(1, step * 2.5);

    const travel = drift.current.speed * step * 1.9;

    meshes.forEach((mesh) => {
      mesh.position.z += travel * mesh.userData.rate;
      if (mesh.position.z > NEAR) {
        mesh.position.z = FAR;
        mesh.position.x = (Math.random() - 0.5) * SPREAD_X * 2;
        mesh.position.y = (Math.random() - 0.5) * SPREAD_Y * 2;
      }
      mesh.rotation.x += mesh.userData.rx * step;
      mesh.rotation.y += mesh.userData.ry * step;
    });

    const dustPositions = dust.attributes.position;
    for (let i = 0; i < dustPositions.count; i += 1) {
      let z = dustPositions.getZ(i) + travel * 0.6;
      if (z > NEAR) z = FAR;
      dustPositions.setZ(i, z);
    }
    dustPositions.needsUpdate = true;

    const pointer = pointerRef.current;
    camera.position.x += (pointer.x * 2.6 - camera.position.x) * Math.min(1, step * 1.5);
    camera.position.y += (pointer.y * 1.8 - camera.position.y) * Math.min(1, step * 1.5);
    camera.lookAt(0, 0, -20);
  });

  return (
    <group>
      {meshes.map((mesh, index) => <primitive key={index} object={mesh} />)}
      <points geometry={dust} material={dustMaterial} frustumCulled={false} />
    </group>
  );
}
