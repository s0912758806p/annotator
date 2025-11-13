import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import { Button, Space, message } from 'antd';
import { DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { KonvaEventObject } from 'konva/lib/Node';

interface Point {
  x: number;
  y: number;
}

interface ImageAnnotationProps {
  imageUrl: string;
  imageName: string;
  onDelete: () => void;
}

export interface ImageAnnotationRef {
  getAnnotationData: () => {
    imageName: string;
    imageUrl: string;
    points: Point[];
    dimensions: { width: number; height: number };
  };
}

const ImageAnnotation = forwardRef<ImageAnnotationRef, ImageAnnotationProps>(
  ({ imageUrl, imageName, onDelete }, ref) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getAnnotationData: () => ({
      imageName,
      imageUrl,
      points,
      dimensions,
    }),
  }));

  const createCirclePoints = (width: number, height: number, numPoints: number = 16): Point[] => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const points: Point[] = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    return points;
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      
      const maxWidth = 600;
      const ratio = img.width / img.height;
      const width = Math.min(maxWidth, img.width);
      const height = width / ratio;
      
      setDimensions({ width, height });
      
      const defaultPoints = createCirclePoints(width, height);
      
      setPoints(defaultPoints);
      message.success('已自動創建預設圓形標註，可拖動節點調整或點擊邊線添加新節點');
    };
  }, [imageUrl]);

  const handleResetAnnotation = () => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const defaultPoints = createCirclePoints(dimensions.width, dimensions.height);
    
    setPoints(defaultPoints);
    setSelectedPointIndex(null);
    message.info('已重置為預設圓形標註');
  };

  const handleSaveAnnotation = () => {
    if (points.length === 0) {
      message.warning('沒有標註數據！');
      return;
    }
    
    const annotationData = {
      image: imageName,
      points: points,
      timestamp: new Date().toISOString(),
    };
    
    console.log('標註數據:', annotationData);
    message.success('標註數據已保存到控制台！');
  };

  const findClosestLineSegment = (clickPoint: Point): { segmentIndex: number; insertPoint: Point } | null => {
    if (points.length < 2) return null;
    
    let minDistance = Infinity;
    let closestSegmentIndex = -1;
    let closestPoint: Point = { x: 0, y: 0 };
    
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      
      const lineLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      const t = Math.max(0, Math.min(1, 
        ((clickPoint.x - p1.x) * (p2.x - p1.x) + (clickPoint.y - p1.y) * (p2.y - p1.y)) / (lineLength * lineLength)
      ));
      
      const projectionPoint = {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y),
      };
      
      const distance = Math.sqrt(
        Math.pow(clickPoint.x - projectionPoint.x, 2) + 
        Math.pow(clickPoint.y - projectionPoint.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSegmentIndex = i;
        closestPoint = projectionPoint;
      }
    }
    
    if (minDistance < 15) {
      return {
        segmentIndex: closestSegmentIndex,
        insertPoint: closestPoint,
      };
    }
    
    return null;
  };

  const handleLineClick = (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    
    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();
    
    if (!pointerPosition) return;
    
    const clickPoint = { x: pointerPosition.x, y: pointerPosition.y };
    const result = findClosestLineSegment(clickPoint);
    
    if (result) {
      const newPoints = [...points];
      newPoints.splice(result.segmentIndex + 1, 0, result.insertPoint);
      setPoints(newPoints);
      message.success(`已在邊線上添加新節點！當前共 ${newPoints.length} 個節點`);
    }
  };

  const handlePointDragMove = (index: number, e: KonvaEventObject<DragEvent>) => {
    const newPoints = [...points];
    newPoints[index] = {
      x: e.target.x(),
      y: e.target.y(),
    };
    setPoints(newPoints);
  };

  const getLinePoints = () => {
    const linePoints: number[] = [];
    points.forEach((point) => {
      linePoints.push(point.x, point.y);
    });
    return linePoints;
  };

  return (
    <div ref={containerRef} className="image-annotation">
      <div style={{ marginBottom: 12 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 8 
        }}>
          <h3 style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {imageName}
          </h3>
          <Button 
            icon={<CloseOutlined />}
            onClick={onDelete}
            danger
            size="small"
            title="刪除此圖片"
          >
            刪除
          </Button>
        </div>
        <Space wrap>
          <Button 
            icon={<DeleteOutlined />}
            onClick={handleResetAnnotation}
          >
            重置標註
          </Button>
          <Button 
            icon={<SaveOutlined />}
            onClick={handleSaveAnnotation}
            type="primary"
          >
            保存標註
          </Button>
        </Space>
      </div>

      <div 
        style={{ 
          border: '2px solid #d9d9d9', 
          borderRadius: 4,
          overflow: 'hidden',
          background: '#fafafa',
          maxWidth: 600
        }}
      >
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          style={{ cursor: 'default', display: 'block', maxWidth: '100%' }}
        >
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                width={dimensions.width}
                height={dimensions.height}
              />
            )}

            {points.length > 0 && (
              <Line
                points={getLinePoints()}
                stroke="#1890ff"
                strokeWidth={3}
                closed={true}
                fill="rgba(24, 144, 255, 0.2)"
                onClick={handleLineClick}
                onMouseEnter={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'crosshair';
                  }
                }}
                onMouseLeave={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'default';
                  }
                }}
              />
            )}

            {points.map((point, index) => (
              <Circle
                key={index}
                x={point.x}
                y={point.y}
                radius={8}
                fill={selectedPointIndex === index ? '#ff4d4f' : '#1890ff'}
                stroke="white"
                strokeWidth={2}
                draggable={true}
                onDragMove={(e) => handlePointDragMove(index, e)}
                onMouseEnter={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'move';
                  }
                }}
                onMouseLeave={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'default';
                  }
                }}
                onClick={(e) => {
                  e.cancelBubble = true;
                  setSelectedPointIndex(index);
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {points.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          已標註 {points.length} 個節點 | 拖動節點調整範圍 | 點擊邊線添加新節點
        </div>
      )}
    </div>
  );
});

ImageAnnotation.displayName = 'ImageAnnotation';

export default ImageAnnotation;
