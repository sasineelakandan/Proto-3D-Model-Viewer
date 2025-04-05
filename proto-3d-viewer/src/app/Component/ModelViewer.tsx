'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

interface MeshMetadata {
  name: string;
  vertices: number;
  faces: number;
  hasUV: boolean;
  hasNormals: boolean;
  materialName?: string;
  geometryType: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

const ModelViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const [metadata, setMetadata] = useState<MeshMetadata[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

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

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/model/capsule0.jpg');

    const loader = new OBJLoader();
    loader.load(
      '/model/capsule.obj',
      (obj: THREE.Object3D) => {
        if (modelRef.current) {
          scene.remove(modelRef.current);
        }

        const extractedMetadata: MeshMetadata[] = [];

        obj.traverse((child: any) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const geometry = mesh.geometry as THREE.BufferGeometry;

            mesh.material = new THREE.MeshStandardMaterial({
              map: texture,
              color: 0xffffff,
              roughness: 0.8,
              metalness: 0.2,
            });

            const vertexCount = geometry.attributes.position?.count || 0;
            const faceCount = geometry.index ? geometry.index.count / 3 : vertexCount / 3;
            const hasUV = !!geometry.attributes.uv;
            const hasNormals = !!geometry.attributes.normal;
            const materialName = (mesh.material as any)?.name || 'Unnamed';

            // Compute bounding box
            geometry.computeBoundingBox();
            const box = geometry.boundingBox!;
            const { min, max } = box;

            extractedMetadata.push({
              name: mesh.name || '(Unnamed)',
              vertices: vertexCount,
              faces: Math.floor(faceCount),
              hasUV,
              hasNormals,
              materialName,
              geometryType: geometry.type,
              minX: min.x,
              maxX: max.x,
              minY: min.y,
              maxY: max.y,
              minZ: min.z,
              maxZ: max.z,
            });
          }
        });

        setMetadata(extractedMetadata);
        modelRef.current = obj;
        scene.add(obj);
      },
      (xhr: any) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error: any) => {
        console.error('An error occurred while loading the model:', error);
      }
    );

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

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />

      {/* === Metadata Viewer === */}
      <div className="absolute top-5 left-5 bg-black bg-opacity-70 text-white p-4 rounded-lg max-h-[80vh] overflow-y-auto shadow-lg backdrop-blur-sm text-sm">
        <h3 className="text-lg font-semibold mb-2">Model Metadata</h3>
        {metadata.length > 0 ? (
          metadata.map((item, index) => (
            <div key={index} className="mb-4">
              <p><span className="font-bold">Name:</span> 3D Object</p>
              <p><span className="font-bold">Vertices:</span> {item.vertices}</p>
              <p><span className="font-bold">Faces:</span> {item.faces}</p>
              <p><span className="font-bold">UV:</span> {item.hasUV ? 'Yes' : 'No'}</p>
              <p><span className="font-bold">Normals:</span> {item.hasNormals ? 'Yes' : 'No'}</p>
              <p><span className="font-bold">Material:</span> 0</p>
              <p><span className="font-bold">Geometry:</span> {item.geometryType}</p>
              <p><span className="font-bold">X:</span> Min {item.minX.toFixed(2)} / Max {item.maxX.toFixed(2)}</p>
              <p><span className="font-bold">Y:</span> Min {item.minY.toFixed(2)} / Max {item.maxY.toFixed(2)}</p>
              <p><span className="font-bold">Z:</span> Min {item.minZ.toFixed(2)} / Max {item.maxZ.toFixed(2)}</p>
              <hr className="my-2 border-gray-600" />
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ModelViewer;
