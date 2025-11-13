# Image Annotation System

A modern, interactive image annotation tool built with React, TypeScript, and Konva. This application allows users to upload images and create polygon annotations with adjustable control points.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=flat&logo=vite)
![Ant Design](https://img.shields.io/badge/Ant%20Design-Latest-0170FE?style=flat&logo=antdesign)
![Konva](https://img.shields.io/badge/Konva-Latest-FF6B6B?style=flat)

## ✨ Features

- 🔐 **Simple Authentication System** - Login page with admin credentials
- 🔄 **Login State Persistence** - Stay logged in even after page refresh (NEW!)
- 📤 **Image Upload** - Upload up to 2 images simultaneously
- 🖼️ **Grid Layout** - Display multiple images in a responsive 3-column grid
- ✨ **Auto Default Annotation** - Automatic rectangle annotation upon image upload
- ✏️ **Polygon Annotation** - Create irregular polygons with unlimited control points
- ➕ **Click-to-Add Points** - Click on any edge line to insert new control points
- 🎯 **Interactive Points** - Drag and adjust annotation control points freely
- 📦 **One-Click Export** - Export all images and annotations as JSON with Base64 encoded images (NEW!)
- 💾 **Complete Data Preservation** - Save both image data and annotation coordinates
- 🎨 **Modern UI** - Beautiful interface powered by Ant Design
- 📱 **Responsive Design** - Works seamlessly across different screen sizes

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd annotator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 How to Use

### 1. Login

- **Username**: `admin`
- **Password**: `123456`

Enter the credentials to access the annotation system.

### 2. Upload Images

- Click the "Upload Images" button
- Select 1-2 image files (max 2 images, 10MB per file)
- Supported formats: JPG, PNG, GIF, etc.
- Images will be displayed in a grid layout

### 3. Annotate Images

**🎉 New Feature**: Images are automatically annotated with a default rectangle upon upload!

#### Automatic Default Annotation
- Upon image upload, a **default rectangular annotation** is automatically created
- The rectangle covers the center area of the image (70% of image size)
- No need to click "Start Annotation" - ready to edit immediately!

#### Adjust Annotation
- **Drag Points**: Click and drag any control point to adjust the polygon shape
- **Add New Points**: Click on any edge line to insert a new control point at that position
  - Cursor changes to crosshair when hovering over edges
  - Creates irregular polygon shapes with unlimited points
- **Visual Feedback**: The polygon area is highlighted in semi-transparent blue
- **Point Selection**: Selected points are highlighted in red

#### Manage Annotations
- **Instructions**: View usage instructions
- **Reset Annotation**: Restore to default rectangle (4 points)
- **Save Annotation**: Export annotation data to browser console (for individual images)
- **Export** (NEW! 🎉): Export all images and annotations as a single JSON file

### 4. Export All Data (NEW! 🚀)

Click the **"Export"** button next to the upload button to export all images and annotations:

- **Format**: JSON file with Base64 encoded images
- **File Name**: `annotations-{timestamp}.json`
- **Content**: Complete image data + annotation coordinates + dimensions
- **Use Cases**: Data backup, sharing, model training, analysis

**Export Data Structure**:
```json
[
  {
    "imageName": "example.jpg",
    "imageData": "data:image/jpeg;base64,...(complete Base64 image data)",
    "annotations": {
      "points": [
        { "x": 90, "y": 60 },
        { "x": 510, "y": 60 },
        { "x": 510, "y": 340 },
        { "x": 90, "y": 340 }
      ],
      "dimensions": { "width": 600, "height": 400 }
    },
    "timestamp": "2025-11-13T10:30:45.123Z"
  }
]
```

### 5. Logout

Click the "Logout" button in the top-right corner to return to the login page.

## 🛠️ Tech Stack

### Core Technologies

- **[React 19.2.0](https://react.dev/)** - Latest React with improved performance
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite 7.2.2](https://vitejs.dev/)** - Lightning-fast build tool with SWC

### UI & Styling

- **[Ant Design](https://ant.design/)** - Enterprise-class UI components
  - Form, Upload, Button, Card, Message components
  - Chinese (Traditional) locale support

### Canvas & Drawing

- **[Konva](https://konvajs.org/)** - 2D canvas library for interactive graphics
- **[React-Konva](https://konvajs.org/docs/react/)** - React wrapper for Konva
  - Stage, Layer, Image, Line, Circle components

## 📁 Project Structure

```
annotator/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Main application styles
│   ├── main.tsx                # Application entry point
│   ├── index.css               # Global styles
│   │
│   ├── Login.tsx               # Login page component
│   ├── Login.css               # Login page styles
│   │
│   ├── Annotator.tsx           # Main annotation page (upload & display)
│   ├── Annotator.css           # Annotation page styles
│   │
│   ├── ImageAnnotation.tsx     # Single image annotation component
│   │
│   └── assets/                 # Static assets
│
├── public/                     # Public assets
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🎨 Key Components

### App Component
Main application component that manages authentication state and routing between Login and Annotator pages.

### Login Component
Simple authentication interface with form validation. Uses fixed credentials for demonstration purposes.

### Annotator Component
Handles image upload, display, and management. Enforces the 2-image upload limit and manages the grid layout.

### ImageAnnotation Component
Core annotation functionality using Konva:
- Image rendering on canvas
- Polygon drawing with multiple points
- Interactive draggable control points
- Real-time visual feedback

## 💾 Annotation Data Format

Annotation data is exported in the following JSON format:

```json
{
  "image": "example.jpg",
  "points": [
    { "x": 100, "y": 150 },
    { "x": 300, "y": 150 },
    { "x": 300, "y": 350 },
    { "x": 100, "y": 350 }
  ],
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

## 🔧 Configuration

### Upload Limits

To change the maximum number of uploadable images, modify the `maxCount` prop in `Annotator.tsx`:

```typescript
<Upload
  maxCount={2}  // Change this value
  // ...
>
```

### Image Size Limits

Adjust the file size limit in `Annotator.tsx`:

```typescript
const isLt10M = file.size / 1024 / 1024 < 10;  // 10MB limit
```

### Grid Columns

Modify the grid layout in `Annotator.css`:

```css
@media (min-width: 1400px) {
  .images-container {
    grid-template-columns: repeat(3, 1fr);  /* Max 3 columns */
  }
}
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

## 🚧 Future Enhancements

### Backend Integration
- [ ] Implement RESTful API for annotation storage
- [ ] User authentication with database
- [ ] Multi-user collaboration support

### Feature Improvements
- [ ] Support for more image formats
- [ ] Image zoom and pan functionality
- [ ] Annotation categories and labels
- [ ] Export annotations as JSON/CSV/XML
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts

### User Experience
- [ ] Tutorial/onboarding guide
- [ ] Dark mode support
- [ ] Mobile optimization
- [ ] Batch operations
- [ ] Progress autosave

### Performance
- [ ] Lazy loading for large images
- [ ] Virtual scrolling for many images
- [ ] Annotation data compression
- [ ] Web Worker for heavy operations

## 🐛 Known Limitations

1. **Upload Limit**: Maximum 2 images per upload (configurable)
2. **Data Storage**: Annotations are currently logged to console only
3. **Point Deletion**: Cannot delete individual points (must clear entire annotation)
4. **Authentication**: Uses hardcoded credentials (demo purpose only)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/) - The library for web and native user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Ant Design](https://ant.design/) - A design system for enterprise-level products
- [Konva](https://konvajs.org/) - 2D canvas library for desktop and mobile applications
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ using React + TypeScript + Vite**
