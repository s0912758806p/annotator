import { useState, useEffect, useRef, createRef } from 'react';
import { Upload, Button, message, Card, Space } from 'antd';
import { UploadOutlined, LogoutOutlined, ExportOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import ImageAnnotation, { type ImageAnnotationRef } from './ImageAnnotation';
import './Annotator.css';

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
      message.warning('最多只能上傳2張圖片！');
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上傳圖片文件！');
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('圖片大小不能超過 10MB！');
      return false;
    }
    return false;
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
    message.success('圖片已刪除');
  };

  const handleExport = async () => {
    if (images.length === 0) {
      message.warning('沒有可匯出的圖片！');
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

      message.success('標註數據已成功匯出！');
    } catch (error) {
      console.error('匯出失敗：', error);
      message.error('匯出失敗，請重試！');
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
        <h1>圖片標註系統</h1>
        <Button 
          icon={<LogoutOutlined />} 
          onClick={onLogout}
          danger
        >
          登出
        </Button>
      </div>

      <Card className="upload-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="upload-and-export-container">
            <Upload
              fileList={fileList}
              onChange={handleUpload}
              beforeUpload={beforeUpload}
              onRemove={handleRemove}
              multiple
              maxCount={2}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                上傳圖片 (最多2張)
              </Button>
            </Upload>

            <Button type="primary" disabled={images.length === 0} icon={<ExportOutlined />} onClick={handleExport}>
              匯出
            </Button>
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
        </Space>
      </Card>
    </div>
  );
};

export default Annotator;
