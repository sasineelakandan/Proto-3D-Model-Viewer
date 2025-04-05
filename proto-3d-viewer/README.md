# 📦 3D Model Viewer — Proto Corp Assignment

A simple web application built using **Next.js** and **Three.js** to render a textured 3D OBJ model and display its metadata, including vertex count and position data. This project fulfills the requirements of the Proto Corp job assignment.

---

## 🚀 Features

- ✅ Three.js scene setup with perspective camera and WebGL renderer
- ✅ OrbitControls for zoom and rotation
- ✅ Loads and renders an OBJ model with texture
- ✅ Displays mesh metadata:
  - Mesh name
  - Number of vertices
  - X, Y, Z positions (bounding box)

---

## 📁 Folder Structure
/public/model/ ├── capsule.obj └── capsule0.jpg

/app/ModelViewer.tsx -> Main viewer component /app/page.tsx -> Renders the viewer
---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sasineelakandan/Proto-3D-Model-Viewer.git
   cd Proto-3D-Model-Viewer

npm install

npm run dev
