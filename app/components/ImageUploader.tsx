import React, { useRef, useState, useEffect } from 'react'
import { useEditorStore } from '../store/editorStore'

const ImageUploader: React.FC = () => {
  const { image, setImage, hue, saturation, exposure } = useEditorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 })

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImage(event.target.result)
        
        // Get image dimensions
        const img = new Image()
        img.onload = () => {
          // Calculate dimensions while maintaining aspect ratio
          const maxWidth = 600
          const maxHeight = 600
          let newWidth = img.width
          let newHeight = img.height
          
          if (newWidth > maxWidth) {
            newHeight = (maxWidth / newWidth) * newHeight
            newWidth = maxWidth
          }
          
          if (newHeight > maxHeight) {
            newWidth = (maxHeight / newHeight) * newWidth
            newHeight = maxHeight
          }
          
          setDimensions({ 
            width: Math.round(newWidth), 
            height: Math.round(newHeight) 
          })
        }
        img.src = event.target.result
      }
    }
    reader.readAsDataURL(file)
  }

  // Update dimensions when image changes
  useEffect(() => {
    if (image) {
      const img = new Image()
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        const maxWidth = 600
        const maxHeight = 600
        let newWidth = img.width
        let newHeight = img.height
        
        if (newWidth > maxWidth) {
          newHeight = (maxWidth / newWidth) * newHeight
          newWidth = maxWidth
        }
        
        if (newHeight > maxHeight) {
          newWidth = (maxHeight / newHeight) * newWidth
          newHeight = maxHeight
        }
        
        setDimensions({ 
          width: Math.round(newWidth), 
          height: Math.round(newHeight) 
        })
      }
      img.src = image
    }
  }, [image])

  return (
    <div 
      className={`flex items-center justify-center cursor-pointer bg-gray-100 ${image ? 'p-2.5' : 'w-[600px] h-[600px]'}`}
      onClick={handleClick}
      style={image ? { 
        width: `${dimensions.width + 20}px`, 
        height: `${dimensions.height + 20}px`,
        borderRadius: '4px'
      } : {}}
    >
      {image ? (
        <img 
          src={image} 
          alt="Uploaded" 
          className="max-w-full max-h-full object-contain"
          style={{
            filter: `hue-rotate(${hue}deg) saturate(${100 + saturation}%) brightness(${100 + exposure}%)`,
            width: dimensions.width,
            height: dimensions.height
          }}
        />
      ) : (
        <div className="text-gray-400">Place an image</div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}

export default ImageUploader 