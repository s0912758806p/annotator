import { useState } from 'react';
import { Upload, Button, message, Card, Space } from 'antd';
import { UploadOutlined, LogoutOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import ImageAnnotation from './ImageAnnotation';
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

  const handleUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const limitedFileList = newFileList.slice(0, 2);
    setFileList(limitedFileList);

    const newImages: ImageData[] = [];
    limitedFileList.forEach((file) => {
      if (file.originFileObj && file.status !== 'error') {
        const url = URL.createObjectURL(file.originFileObj);
        newImages.push({
          id: file.uid,
          url: url,
          file: file.originFileObj,
        });
      }
    });
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
    
    setImages(images.filter((img) => img.id !== imageId));
    message.success('圖片已刪除');
  };

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

          {images.length > 0 && (
            <div className="images-container">
              {images.map((image) => (
                <div key={image.id} className="image-item">
                  <ImageAnnotation 
                    imageUrl={image.url} 
                    imageName={image.file.name}
                    onDelete={() => handleDeleteImage(image.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Annotator;
