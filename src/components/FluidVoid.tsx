import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uIntensity;
  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0, amplitude = 0.5, frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0; amplitude *= 0.5;
    }
    return value;
  }

  vec4 sampleFluidState(vec2 p, float t) {
    vec2 fluidP = p;
    float n1 = fbm(fluidP * 1.5 + t * 0.2);
    fluidP += n1 * 0.18;
    float n2 = fbm(fluidP * 2.5 - t * 0.15);
    fluidP += n2 * 0.1;
    float n3 = fbm(fluidP * 4.0 + t * 0.1);
    fluidP += n3 * 0.05;
    float finalNoise = fbm(fluidP * 3.0 + t * 0.08);
    return vec4(finalNoise, fluidP, n1);
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= uResolution.x / uResolution.y;
    vec2 mouseInfluence = vec2(0.0);
    float mouseDist = 10.0;
    if (uMouse.x > 0.0) {
      mouseDist = length(p - (uMouse * 2.0 - 1.0));
    }
    float mouseInfluenceStrength = smoothstep(0.5, 0.0, mouseDist) * 0.3;
    float angle = atan(p.y - (uMouse.y * 2.0 - 1.0), p.x - (uMouse.x * 2.0 - 1.0));
    mouseInfluence = vec2(cos(angle), sin(angle)) * mouseInfluenceStrength;
    vec2 sampleP = p + mouseInfluence;
    vec4 fluidState = sampleFluidState(sampleP, uTime);
    float finalNoise = fluidState.x;
    float normalizedNoise = smoothstep(-0.6, 0.6, finalNoise);
    vec3 baseColor = vec3(0.02, 0.02, 0.02);
    vec3 midColor = vec3(0.15, 0.13, 0.10);
    vec3 oliveColor = vec3(0.569, 0.573, 0.553);
    vec3 color = mix(baseColor, midColor, normalizedNoise);
    color = mix(color, oliveColor, pow(normalizedNoise, 3.0) * 0.6);
    float luminosity = dot(color, vec3(0.299, 0.587, 0.114));
    color += oliveColor * luminosity * 0.3;
    color *= uIntensity;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function FluidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uIntensity: { value: 1.0 },
  }), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX / window.innerWidth;
      mouseRef.current.ty = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime * 0.3;
    mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;
    mat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    mat.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

export default function FluidVoid() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }} style={{ width: "100%", height: "100%" }} gl={{ antialias: false, alpha: false }}>
        <FluidMesh />
      </Canvas>
    </div>
  );
}
