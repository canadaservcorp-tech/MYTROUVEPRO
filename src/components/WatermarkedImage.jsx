import React from 'react';

const WatermarkedImage = ({ src, alt, className = '', watermark = 'myTROUVEpro' }) => (
  <div className={`relative ${className}`}>
    <img src={src} alt={alt} className="w-full h-full object-cover" />
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded">
        {watermark}
      </div>
    </div>
  </div>
);

export default WatermarkedImage;
