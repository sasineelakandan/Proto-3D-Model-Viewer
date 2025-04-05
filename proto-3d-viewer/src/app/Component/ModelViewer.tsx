'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const ModelViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // === Scene Setup ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);

    // === Lighting ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // === Load Texture ===
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/model/capsule0.jpg');

    // === Load OBJ Model ===
    const loader = new OBJLoader();
    loader.load(
      '/model/capsule.obj',
      (obj: THREE.Object3D) => {
        
        if (modelRef.current) {
          scene.remove(modelRef.current);
        }

        obj.traverse((child: any) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const geometry = mesh.geometry as THREE.BufferGeometry;

            
            if (!geometry.attributes.uv) {
              console.warn(` No UV coordinates found in mesh "${mesh.name}". Texture may not map properly.`);
            }

          
            mesh.material = new THREE.MeshStandardMaterial({
              map: texture,
              color: 0xffffff,
              roughness: 0.8,
              metalness: 0.2,
            });
          }
        });

        modelRef.current = obj;
        scene.add(obj);

        
        obj.traverse((child: any) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const vertexCount = (mesh.geometry as THREE.BufferGeometry).attributes.position.count;
            console.log(`Mesh: ${mesh.name || '(Unnamed)'}, Vertices: ${vertexCount}`);
          }
        });
      },
      (xhr: any) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error: any) => {
        console.error(' An error occurred while loading the model:', error);
      }
    );

    // === Animation Loop ===
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01;
        modelRef.current.rotation.x += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // === Cleanup ===
    return () => {
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = null;
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ModelViewer;
