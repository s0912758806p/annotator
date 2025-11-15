import { useState, useEffect, useRef, createRef } from 'react';
import { Upload, Button, message, Space } from 'antd';
import { UploadOutlined, LogoutOutlined, ExportOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import * as exifr from 'exifr';
import ImageAnnotation, { type ImageAnnotationRef } from '../ImageAnnotation/index';
import './index.scss';

interface AnnotatorProps {
  onLogout: () => void;
}

interface ImageData {
  id: string;
  url: string;
  file: File;
}

const Annotator = ({ onLogout }: AnnotatorProps) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const annotationRefs = useRef<Map<string, React.RefObject<ImageAnnotationRef | null>>>(new Map());

  const handleUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const limitedFileList = newFileList.slice(0, 2);
    setFileList(limitedFileList);

    const newImages: ImageData[] = [];
    const newRefs = new Map<string, React.RefObject<ImageAnnotationRef | null>>();
    
    limitedFileList.forEach((file) => {
      if (file.originFileObj && file.status !== 'error') {
        const url = URL.createObjectURL(file.originFileObj);
        newImages.push({
          id: file.uid,
          url: url,
          file: file.originFileObj,
        });
        newRefs.set(file.uid, createRef<ImageAnnotationRef | null>());
      }
    });
    
    annotationRefs.current = newRefs;
    setImages(newImages);

    if (newFileList.length > 2) {
      message.warning('Maximum 2 images allowed!');
    }
  };

  const beforeUpload = async (file: File) => {
    // 1. Check file format
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validFormats.includes(file.type.toLowerCase())) {
      message.error(`Invalid format! Only ${validFormats.join(', ')} are allowed.`);
      return false;
    }

    // 2. Check file size (quality indicator)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error('Image size must not exceed 10MB!');
      return false;
    }

    // 3. Check minimum file size (quality check)
    const minSize = 10 * 1024; // 10KB minimum
    if (file.size < minSize) {
      message.error('Image quality too low (file size too small)!');
      return false;
    }

    // 4. Check resolution and orientation using Image object
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = URL.createObjectURL(file);
      });

      // Check minimum resolution
      const minWidth = 200;
      const minHeight = 200;
      if (img.width < minWidth || img.height < minHeight) {
        message.error(`Image resolution too low! Minimum ${minWidth}x${minHeight} required.`);
        URL.revokeObjectURL(img.src);
        return false;
      }

      // Check maximum resolution
      const maxWidth = 4096;
      const maxHeight = 4096;
      if (img.width > maxWidth || img.height > maxHeight) {
        message.error(`Image resolution too high! Maximum ${maxWidth}x${maxHeight} allowed.`);
        URL.revokeObjectURL(img.src);
        return false;
      }

      // 5. Check EXIF data for orientation
      try {
        const exifData = await exifr.parse(file) as { Orientation?: number } | undefined;
        if (exifData) {
          const orientation: number | undefined = exifData.Orientation;
          if (orientation && orientation !== 1) {
            message.warning(`Image orientation detected (EXIF: ${orientation}). Image will be displayed as-is.`);
          }
        }
      } catch {
        // EXIF data not available or error reading it, continue anyway
        console.log('EXIF data not available');
      }

      URL.revokeObjectURL(img.src);
      message.success(`Image validated: ${img.width}x${img.height}, ${(file.size / 1024).toFixed(2)}KB`);
    } catch {
      message.error('Failed to validate image!');
      return false;
    }

    return false; // Prevent auto upload, we handle it manually
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    
    const imageToRemove = images.find((img) => img.id === file.uid);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    setImages(images.filter((img) => img.id !== file.uid));
  };

  const handleDeleteImage = (imageId: string) => {
    const newFileList = fileList.filter((item) => item.uid !== imageId);
    setFileList(newFileList);
    
    const imageToRemove = images.find((img) => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    annotationRefs.current.delete(imageId);
    setImages(images.filter((img) => img.id !== imageId));
    message.success('Image deleted');
  };

  const handleExport = async () => {
    if (images.length === 0) {
      message.warning('No images to export!');
      return;
    }

    try {
      const exportData = [];

      for (const image of images) {
        const ref = annotationRefs.current.get(image.id);
        if (ref?.current) {
          const annotationData = ref.current.getAnnotationData();
          
          const imageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(image.file);
          });

          exportData.push({
            imageName: annotationData.imageName,
            imageData: imageBase64,
            annotations: {
              points: annotationData.points,
              dimensions: annotationData.dimensions,
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `annotations-${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('Annotation data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      message.error('Export failed, please try again!');
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      onLogout();
    }
  }, [onLogout]);

  return (
    <div className="annotator-container">
      <div className="annotator-header">
        <h1>Annotator</h1>
        <Button 
          icon={<LogoutOutlined />} 
          onClick={onLogout}
          danger
        >
          Logout
        </Button>
      </div>

      <div className="upload-section">
        <Space size="large">
          <Upload
            fileList={fileList}
            onChange={handleUpload}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
            multiple
            maxCount={2}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} size="large">
              Upload Images (Max 2)
            </Button>
          </Upload>

          <Button 
            type="primary" 
            size="large"
            disabled={images.length === 0} 
            icon={<ExportOutlined />} 
            onClick={handleExport}
          >
            Export All
          </Button>
        </Space>
      </div>

      {images.length > 0 && (
        <div className="images-container">
          {images.map((image) => {
            const ref = annotationRefs.current.get(image.id);
            return (
              <div key={image.id} className="image-item">
                <ImageAnnotation 
                  ref={ref}
                  imageUrl={image.url} 
                  imageName={image.file.name}
                  onDelete={() => handleDeleteImage(image.id)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Annotator;
