"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderMaterial, Vector2 } from "three";
import styles from "./motion.module.css";
const vertex = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const fragment = `precision mediump float;
varying vec2 vUv; uniform vec2 uPointer; uniform float uTime;
float line(vec2 p, vec2 a, vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return 1.-smoothstep(.001,.0035,length(pa-ba*h));}
void main(){vec2 p=vUv+uPointer*.008;float l=0.;
l+=line(p,vec2(.19,.2),vec2(.19,.78));l+=line(p,vec2(.19,.78),vec2(.79,.78));l+=line(p,vec2(.79,.78),vec2(.79,.2));l+=line(p,vec2(.79,.2),vec2(.19,.2));
l+=line(p,vec2(.19,.78),vec2(.34,.65));l+=line(p,vec2(.79,.78),vec2(.68,.65));l+=line(p,vec2(.34,.65),vec2(.68,.65));l+=line(p,vec2(.34,.65),vec2(.34,.34));l+=line(p,vec2(.68,.65),vec2(.68,.34));l+=line(p,vec2(.34,.34),vec2(.68,.34));l+=line(p,vec2(.19,.2),vec2(.34,.34));l+=line(p,vec2(.79,.2),vec2(.68,.34));
l+=line(p,vec2(.48,.34),vec2(.48,.53));l+=line(p,vec2(.48,.53),vec2(.58,.53));l+=line(p,vec2(.58,.53),vec2(.58,.34));
float fade=smoothstep(0.,.65,uTime)*(1.-smoothstep(6.8,7.9,uTime));gl_FragColor=vec4(.73,.58,.37,min(l,1.)*.52*fade);}`;
function RoomOutline() {
  const material = useRef<ShaderMaterial>(null);
  const target = useRef(new Vector2());
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uPointer: { value: new Vector2() }, uTime: { value: 0 } }),
    [],
  );
  useEffect(() => {
    const move = (event: PointerEvent) =>
      target.current.set(
        (event.clientX / innerWidth) * 2 - 1,
        -((event.clientY / innerHeight) * 2 - 1),
      );
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  useFrame((_, delta) => {
    if (!material.current) return;
    uniforms.uTime.value += Math.min(delta, 0.1);
    uniforms.uPointer.value.lerp(target.current, 0.035);
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
/** Decorative short-lived overlay. Never use this in place of the real hero content. */
export default function MaterialReveal() {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 8000);
    return () => clearTimeout(timer);
  }, []);
  if (!active) return null;
  return (
    <div className={styles.canvas} aria-hidden="true">
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 2] }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        <RoomOutline />
      </Canvas>
    </div>
  );
}
