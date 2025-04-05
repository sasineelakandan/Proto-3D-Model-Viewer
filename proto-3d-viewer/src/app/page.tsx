'use client';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('../app/Component/ModelViewer'), { ssr: false });

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364] text-white text-center py-8 px-4">
      <h1 className="text-4xl font-bold mb-2">Simple 3D Model Viewer</h1>
      <p className=" text-lg text-gray-300 mb-6">
        Experience your 3D model with texture in an interactive environment
      </p>
      <ModelViewer />
    </div>
  );
};

export default Home;
