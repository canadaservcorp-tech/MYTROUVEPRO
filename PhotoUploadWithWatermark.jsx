import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

/**
 * PhotoUploadWithWatermark Component
 * Automatically adds myTROUVEpro watermark to uploaded images
 */
const PhotoUploadWithWatermark = ({ 
  onUploadComplete, 
  maxFiles = 5,
  watermarkText = 'myTROUVEpro',
  watermarkPosition = 'bottom-right' // top-left, top-right, bottom-left, bottom-right, center
}) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const addWatermark = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw original image
          ctx.drawImage(img, 0, 0);
          
          // Configure watermark
          const fontSize = Math.max(img.width / 25, 20); // Responsive font size
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black outline
          ctx.lineWidth = 2;
          
          // Measure text
          const textMetrics = ctx.measureText(watermarkText);
          const textWidth = textMetrics.width;
          const textHeight = fontSize;
          
          // Calculate position
          let x, y;
          const padding = 20;
          
          switch (watermarkPosition) {
            case 'top-left':
              x = padding;
              y = padding + textHeight;
              break;
            case 'top-right':
              x = canvas.width - textWidth - padding;
              y = padding + textHeight;
              break;
            case 'bottom-left':
              x = padding;
              y = canvas.height - padding;
              break;
            case 'bottom-right':
              x = canvas.width - textWidth - padding;
              y = canvas.height - padding;
              break;
            case 'center':
              x = (canvas.width - textWidth) / 2;
              y = (canvas.height + textHeight) / 2;
              break;
            default:
              x = canvas.width - textWidth - padding;
              y = canvas.height - padding;
          }
          
          // Draw watermark with outline
          ctx.strokeText(watermarkText, x, y);
          ctx.fillText(watermarkText, x, y);
          
          // Add subtle logo/icon watermark in opposite corner
          ctx.font = `${fontSize * 1.5}px Arial`;
          ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // Blue with transparency
          const iconX = watermarkPosition.includes('right') ? padding : canvas.width - padding - fontSize;
          const iconY = watermarkPosition.includes('bottom') ? padding + fontSize : canvas.height - padding;
          ctx.fillText('🔍', iconX, iconY);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              const watermarkedFile = new File(
                [blob], 
                file.name.replace(/\.(jpg|jpeg|png)$/i, '_watermarked.$1'),
                { type: file.type }
              );
              resolve(watermarkedFile);
            } else {
              reject(new Error('Failed to create watermarked image'));
            }
          }, file.type, 0.95); // 95% quality
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check file count limit
    if (images.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }
    
    setUploading(true);
    
    try {
      const watermarkedImages = [];
      
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large (max 5MB)`);
          continue;
        }
        
        // Add watermark
        const watermarkedFile = await addWatermark(file);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(watermarkedFile);
        
        watermarkedImages.push({
          file: watermarkedFile,
          preview: previewUrl,
          name: file.name
        });
      }
      
      const updatedImages = [...images, ...watermarkedImages];
      setImages(updatedImages);
      
      // Callback with watermarked files
      if (onUploadComplete) {
        onUploadComplete(updatedImages.map(img => img.file));
      }
      
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Failed to process images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    if (onUploadComplete) {
      onUploadComplete(newImages.map(img => img.file));
    }
  };

  return (
    <div className="w-full">
      {/* Upload Button */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxFiles}
          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2" />
              Processing images...
            </>
          ) : (
            <>
              <Upload size={20} className="mr-2" />
              Upload Photos ({images.length}/{maxFiles})
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-2">
          Images will be watermarked with "{watermarkText}"
        </p>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
              
              {/* Watermark indicator */}
              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                ✓ Watermarked
              </div>
            </div>
          ))}
        </div>
      )}
      
      {images.length === 0 && !uploading && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadWithWatermark;
