import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import { Button, Space, message } from 'antd';
import { DeleteOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import type { KonvaEventObject } from 'konva/lib/Node';
import './index.scss';

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
      message.success('Default circle annotation created automatically. Drag nodes to adjust or click edges to add new nodes');
    };
  }, [imageUrl]);

  const handleResetAnnotation = () => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const defaultPoints = createCirclePoints(dimensions.width, dimensions.height);
    
    setPoints(defaultPoints);
    setSelectedPointIndex(null);
    message.info('Reset to default circle annotation');
  };

  const handleSaveAnnotation = () => {
    if (points.length === 0) {
      message.warning('No annotation data!');
      return;
    }
    
    const annotationData = {
      image: imageName,
      points: points,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Annotation data:', annotationData);
    message.success('Annotation data saved to console!');
  };

  const handleDownloadWithAnnotation = () => {
    if (!image || points.length === 0) {
      message.warning('No image or annotation to download!');
      return;
    }

    try {
      // Create a temporary canvas to draw image with annotation
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        message.error('Failed to create canvas context!');
        return;
      }

      // Draw the image
      ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);

      // Draw the annotation polygon
      if (points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.closePath();
        
        // Fill with semi-transparent blue
        ctx.fillStyle = 'rgba(24, 144, 255, 0.2)';
        ctx.fill();
        
        // Stroke with blue
        ctx.strokeStyle = '#1890ff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw control points
        points.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#1890ff';
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          message.error('Failed to create image blob!');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = imageName.replace(/\.[^/.]+$/, '') + '_annotated.png';
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        message.success('Image with annotation downloaded!');
      }, 'image/png');
    } catch (error) {
      console.error('Download failed:', error);
      message.error('Failed to download image!');
    }
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
      message.success(`New node added! Total ${newPoints.length} nodes`);
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
      <div className="annotation-header">
        <h3 className="image-name" title={imageName}>
          {imageName}
        </h3>
        <Space size="small">
          <Button 
            icon={<DownloadOutlined />}
            onClick={handleDownloadWithAnnotation}
            type="text"
            title="Download with annotation"
          />
          <Button 
            icon={<DeleteOutlined />}
            onClick={onDelete}
            type="text"
            danger
            title="Delete image"
          />
        </Space>
      </div>

      <Space wrap style={{ marginBottom: 12 }}>
        <Button 
          icon={<DeleteOutlined />}
          onClick={handleResetAnnotation}
          size="small"
        >
          Reset
        </Button>
        <Button 
          icon={<SaveOutlined />}
          onClick={handleSaveAnnotation}
          type="primary"
          size="small"
        >
          Save
        </Button>
      </Space>

      <div className="annotation-canvas">
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
                radius={5}
                fill={selectedPointIndex === index ? '#ff4d4f' : '#1890ff'}
                stroke="white"
                strokeWidth={1.5}
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
        <div className="annotation-info">
          {points.length} nodes annotated | Drag nodes to adjust | Click edges to add nodes
        </div>
      )}
    </div>
  );
});

ImageAnnotation.displayName = 'ImageAnnotation';

export default ImageAnnotation;
