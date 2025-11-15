# Image Annotation System

A modern, professional image annotation tool built with React, TypeScript, and Konva. This application enables users to upload images, create precise polygon annotations with adjustable control points, and export annotated results.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=flat&logo=vite)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.28.1-0170FE?style=flat&logo=antdesign)
![Konva](https://img.shields.io/badge/Konva-10.0.8-FF6B6B?style=flat)
![Sass](https://img.shields.io/badge/Sass-1.94.0-CC6699?style=flat&logo=sass)

## ✨ Features

### 🔐 Authentication
- **Simple Login System** - Secure access with admin credentials
- **Session Persistence** - Stay logged in across page refreshes using localStorage

### 📤 Image Management
- **Multi-Image Upload** - Upload up to 2 images simultaneously
- **Advanced Validation** - Comprehensive image validation before upload:
  - ✅ Format check (JPEG, PNG, GIF, WEBP)
  - ✅ Resolution validation (200x200 to 4096x4096)
  - ✅ File size limits (10KB to 10MB)
  - ✅ EXIF orientation detection
  - ✅ Quality assessment
- **Responsive Grid Layout** - Clean 3-column grid display for multiple images

### 🎨 Annotation Tools
- **Auto Default Circle** - Automatic 16-point circular annotation on upload
- **Polygon Annotation** - Create complex shapes with unlimited control points
- **Interactive Editing**:
  - 🖱️ Drag nodes to adjust shape (5px precision nodes)
  - ➕ Click edges to add new control points
  - 🎯 Visual feedback with semi-transparent blue overlay
  - 🔴 Selected point highlighting
- **Easy Controls**:
  - Reset to default circle
  - Save annotation data to console
  - Delete individual images

### 💾 Export Capabilities
- **Individual Image Download** - Download image with annotation overlay as PNG
- **Batch Export** - Export all images and annotations as JSON
- **Complete Data Preservation** - Base64 encoded images with annotation coordinates
- **Timestamp Tracking** - Automatic timestamp for each annotation

### 🎨 Modern UI/UX
- **Clean Interface** - Minimalist design with Ant Design components
- **Icon-Based Actions** - Intuitive download and delete icons
- **Hover Effects** - Visual feedback on image cards
- **Responsive Design** - Works seamlessly across different screen sizes

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd annotator
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### 1. Login

Access the annotation system with default credentials:

- **Username**: `admin`
- **Password**: `123456`

> ⚠️ Note: These are demo credentials. In production, implement proper authentication.

### 2. Upload Images

1. Click the **"Upload Images (Max 2)"** button
2. Select 1-2 image files from your device
3. Images are automatically validated:
   - Format verification
   - Resolution check (200x200 to 4096x4096)
   - File size validation (10KB to 10MB)
   - EXIF data extraction
4. Valid images appear in the grid with automatic circular annotations

**Validation Messages:**
- ✅ Success: `Image validated: 1920x1080, 245.67KB`
- ❌ Error: `Image resolution too low! Minimum 200x200 required.`
- ⚠️ Warning: `Image orientation detected (EXIF: 6). Image will be displayed as-is.`

### 3. Annotate Images

#### Automatic Circle Annotation
- Upon upload, a **default circular annotation** is automatically created
- 16 evenly distributed control points
- Centered on the image with proportional radius
- Ready to edit immediately

#### Edit Annotation
**Drag Points:**
- Click and drag any 5px control point to reshape the annotation
- Selected points are highlighted in red
- Cursor changes to "move" icon when hovering over points

**Add New Points:**
- Hover over any edge line (cursor changes to crosshair)
- Click to insert a new control point at that exact position
- Create complex irregular polygons with unlimited points
- Success message: `New node added! Total 24 nodes`

**Visual Feedback:**
- Semi-transparent blue fill shows annotated area
- Blue outline marks the polygon boundary
- White-bordered control points for easy visibility

#### Manage Annotations
- **Reset** - Restore to default 16-point circle
- **Save** - Log annotation data to browser console
- **Download** - Export image with annotation overlay as PNG
- **Delete** - Remove image from the session

### 4. Download Individual Image

Click the **download icon** (📥) next to the image name to:
- Export the image with annotation overlay
- Includes polygon fill, outline, and control points
- Saves as `{original-name}_annotated.png`
- PNG format with transparency support

### 5. Export All Data

Click the **"Export All"** button to export all images and annotations:

**Export Format:**
```json
[
  {
    "imageName": "example.jpg",
    "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "annotations": {
      "points": [
        { "x": 300, "y": 200 },
        { "x": 450, "y": 210 },
        { "x": 480, "y": 350 },
        { "x": 290, "y": 340 }
      ],
      "dimensions": { 
        "width": 600, 
        "height": 400 
      }
    },
    "timestamp": "2025-11-15T12:30:45.123Z"
  }
]
```

**File Name:** `annotations-{timestamp}.json`

**Use Cases:**
- Machine learning training data
- Data backup and archiving
- Sharing annotations with team members
- Batch processing pipelines

### 6. Logout

Click the **"Logout"** button in the header to return to the login page.

## 🛠️ Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 19.2.0 | UI library with latest features |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | Type-safe development |
| [Vite](https://vitejs.dev/) | 7.2.2 | Lightning-fast build tool with HMR |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| [Ant Design](https://ant.design/) | 5.28.1 | Enterprise-class UI components |
| [Sass](https://sass-lang.com/) | 1.94.0 | Advanced CSS preprocessing |

**Ant Design Components Used:**
- Form, Input, Button, Upload, Space
- Message notifications
- Card (for image containers)

### Canvas & Graphics

| Technology | Version | Purpose |
|------------|---------|---------|
| [Konva](https://konvajs.org/) | 10.0.8 | 2D canvas library for annotations |
| [React-Konva](https://konvajs.org/docs/react/) | 19.2.0 | React wrapper for Konva |

**Konva Components:**
- Stage, Layer, Image
- Line (for polygon outlines)
- Circle (for control points)

### Image Processing

| Technology | Version | Purpose |
|------------|---------|---------|
| [exifr](https://github.com/MikeKovarik/exifr) | Latest | EXIF data extraction and image metadata |

## 📁 Project Structure

```
annotator/
├── src/
│   ├── components/                # React components
│   │   ├── Login/
│   │   │   ├── index.tsx          # Login component
│   │   │   └── index.scss         # Login styles
│   │   ├── Annotator/
│   │   │   ├── index.tsx          # Main annotation page
│   │   │   └── index.scss         # Annotator styles
│   │   └── ImageAnnotation/
│   │       ├── index.tsx          # Single image annotation
│   │       └── index.scss         # Image annotation styles
│   │
│   ├── App.tsx                    # Root application component
│   ├── App.css                    # Global app styles
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global CSS reset
│   └── assets/                    # Static assets
│
├── public/                        # Public static files
├── dist/                          # Production build output
│
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # App-specific TS config
├── tsconfig.node.json             # Node-specific TS config
├── eslint.config.js               # ESLint configuration
└── README.md                      # This file
```

## 🎨 Component Architecture

### App Component
**Purpose:** Root component managing authentication state and routing

**Features:**
- Session state management with localStorage
- Route switching between Login and Annotator
- Ant Design ConfigProvider for global settings

### Login Component
**Purpose:** Simple authentication interface

**Features:**
- Form validation with Ant Design Form
- Fixed credentials for demonstration (admin/123456)
- localStorage-based session persistence
- Error and success message handling

**Props:**
```typescript
interface LoginProps {
  onLoginSuccess: () => void;
}
```

### Annotator Component
**Purpose:** Main image management and upload interface

**Features:**
- Multi-image upload with validation
- Advanced image validation (format, resolution, size, EXIF)
- Image grid display with responsive layout
- Batch export functionality
- Session validation

**Key Functions:**
- `beforeUpload()` - Comprehensive image validation
- `handleUpload()` - Image upload management
- `handleExport()` - Batch JSON export with Base64 images
- `handleDeleteImage()` - Individual image removal

### ImageAnnotation Component
**Purpose:** Core annotation functionality for individual images

**Features:**
- Canvas-based image rendering
- Automatic circle annotation (16 points)
- Interactive polygon editing
- Node manipulation (drag, add, select)
- Individual image download with annotation overlay

**Key Functions:**
- `createCirclePoints()` - Generate default circular annotation
- `handlePointDragMove()` - Node position updates
- `handleLineClick()` - Add new points on edges
- `handleDownloadWithAnnotation()` - Export annotated image as PNG
- `findClosestLineSegment()` - Edge click detection algorithm

**Props:**
```typescript
interface ImageAnnotationProps {
  imageUrl: string;
  imageName: string;
  onDelete: () => void;
}
```

**Ref Methods:**
```typescript
interface ImageAnnotationRef {
  getAnnotationData: () => {
    imageName: string;
    imageUrl: string;
    points: Point[];
    dimensions: { width: number; height: number };
  };
}
```

## 💾 Data Formats

### Annotation Point
```typescript
interface Point {
  x: number;  // X coordinate in pixels
  y: number;  // Y coordinate in pixels
}
```

### Console Save Format
```json
{
  "image": "example.jpg",
  "points": [
    { "x": 100, "y": 150 },
    { "x": 300, "y": 150 }
  ],
  "timestamp": "2025-11-15T12:30:00.000Z"
}
```

### Batch Export Format
```json
[
  {
    "imageName": "example.jpg",
    "imageData": "data:image/jpeg;base64,...",
    "annotations": {
      "points": [...],
      "dimensions": { "width": 600, "height": 400 }
    },
    "timestamp": "2025-11-15T12:30:45.123Z"
  }
]
```

## 🔧 Configuration

### Image Upload Limits

**Maximum Images:**
Modify `maxCount` in `src/components/Annotator/index.tsx`:
```typescript
<Upload
  maxCount={2}  // Change this value
  // ...
>
```

**File Size Limits:**
Adjust validation in `beforeUpload()`:
```typescript
const maxSize = 10 * 1024 * 1024; // 10MB
const minSize = 10 * 1024;        // 10KB
```

**Resolution Limits:**
Modify in `beforeUpload()`:
```typescript
const minWidth = 200;    // Minimum width
const minHeight = 200;   // Minimum height
const maxWidth = 4096;   // Maximum width
const maxHeight = 4096;  // Maximum height
```

### Annotation Defaults

**Control Point Size:**
Adjust in `src/components/ImageAnnotation/index.tsx`:
```typescript
<Circle
  radius={5}        // Point radius in pixels
  strokeWidth={1.5} // Border width
  // ...
/>
```

**Default Circle Points:**
Modify in `createCirclePoints()`:
```typescript
const numPoints = 16;  // Number of initial points
const radius = Math.min(width, height) * 0.35;  // Circle size ratio
```

### Grid Layout

**Responsive Breakpoints:**
Modify in `src/components/Annotator/index.scss`:
```scss
@media (min-width: 1400px) {
  .images-container {
    grid-template-columns: repeat(3, 1fr); // 3 columns on large screens
  }
}
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

## 🚧 Future Enhancements

### High Priority
- [ ] **Undo/Redo** - Action history for annotation editing
- [ ] **Delete Individual Points** - Remove specific control points
- [ ] **Zoom & Pan** - Navigate large images easily
- [ ] **Keyboard Shortcuts** - Improve workflow efficiency
- [ ] **Autosave** - Prevent data loss

### Backend Integration
- [ ] RESTful API for annotation storage
- [ ] Database-backed user authentication
- [ ] Multi-user collaboration
- [ ] Cloud storage for images
- [ ] Real-time synchronization

### Advanced Features
- [ ] Multiple annotation types (rectangle, ellipse, freehand)
- [ ] Annotation labels and categories
- [ ] Image preprocessing (crop, rotate, adjust)
- [ ] Batch upload and processing
- [ ] CSV/XML export formats
- [ ] Annotation templates

### User Experience
- [ ] Interactive tutorial/onboarding
- [ ] Dark mode support
- [ ] Mobile touch optimization
- [ ] Annotation history view
- [ ] Search and filter images
- [ ] Drag-and-drop upload

### Performance
- [ ] Lazy loading for large image sets
- [ ] Virtual scrolling
- [ ] Web Worker for image processing
- [ ] Annotation data compression
- [ ] Progressive image loading

## 🐛 Known Limitations

| Limitation | Description | Status |
|------------|-------------|--------|
| **Upload Limit** | Maximum 2 images per session | Configurable |
| **Point Deletion** | Cannot delete individual points | Planned |
| **Console Save** | Individual saves log to console only | By design |
| **Demo Auth** | Hardcoded credentials (admin/123456) | Demo only |
| **No Undo** | Cannot revert annotation changes | Planned |
| **Session Only** | No persistent storage across sessions | Future |

## 🔒 Security Considerations

> ⚠️ **Important:** This is a demonstration application with basic security.

For production deployment:

1. **Authentication:**
   - Implement proper JWT-based authentication
   - Use secure password hashing (bcrypt, argon2)
   - Add rate limiting and CAPTCHA

2. **File Upload:**
   - Server-side validation of file types
   - Virus scanning for uploaded files
   - Content Security Policy (CSP) headers

3. **Data Storage:**
   - Encrypt sensitive data at rest
   - Use secure HTTPS connections
   - Implement proper CORS policies

4. **Input Validation:**
   - Sanitize all user inputs
   - Validate annotation coordinates
   - Prevent XSS attacks

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and fix all warnings
- Write meaningful commit messages
- Update documentation for new features
- Test across different browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[React](https://react.dev/)** - The library for web and native user interfaces
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[Ant Design](https://ant.design/)** - Enterprise-class UI design system
- **[Konva](https://konvajs.org/)** - 2D canvas library for annotations
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript with syntax for types
- **[exifr](https://github.com/MikeKovarik/exifr)** - Fast and versatile EXIF reader
- **[Sass](https://sass-lang.com/)** - Professional grade CSS extension

## 📧 Support

For questions, issues, or feature requests:

- **Issues:** Open an issue on GitHub
- **Discussions:** Use GitHub Discussions for questions
- **Email:** Contact the maintainers

## 🎯 Project Status

**Current Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** November 2025

### Recent Updates

- ✅ Full English interface
- ✅ SCSS styling implementation
- ✅ Advanced image validation with exifr
- ✅ Individual image download with annotation overlay
- ✅ Optimized control point size (5px) for precision
- ✅ Icon-based UI improvements
- ✅ Component-based architecture

---

**Made with ❤️ using React + TypeScript + Vite + Sass**

*Happy Annotating! 🎨*
