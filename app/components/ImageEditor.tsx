import React, { useState, useRef, useEffect } from 'react'
import { 
  Undo2, 
  Redo2, 
  Download, 
  SlidersHorizontal, 
  Crop 
} from 'lucide-react'
import ImageUploader from './ImageUploader'
import ImageCropper from './ImageCropper'
import PropertiesPanel from './PropertiesPanel'
import { useEditorStore } from '../store/editorStore'

const ImageEditor: React.FC = () => {
  const { 
    image, 
    setImage, 
    hue, 
    saturation, 
    exposure, 
    cropMode, 
    setCropMode, 
    undo, 
    redo, 
    saveSnapshot 
  } = useEditorStore()
  
  const [showProperties, setShowProperties] = useState(false)
  const [showDownloadTooltip, setShowDownloadTooltip] = useState(false)
  const propertiesPanelRef = useRef<HTMLDivElement>(null)
  const slidersBtnRef = useRef<HTMLButtonElement>(null)

  const handleCropComplete = (croppedImage: string) => {
    setImage(croppedImage)
    setCropMode(false)
    saveSnapshot()
  }

  const handleCropCancel = () => {
    setCropMode(false)
  }

  const handleDownload = () => {
    if (!image) return

    // Create a temporary canvas to apply filters
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Apply filters
      ctx.filter = `hue-rotate(${hue}deg) saturate(${100 + saturation}%) brightness(${100 + exposure}%)`
      ctx.drawImage(img, 0, 0, img.width, img.height)
      
      // Create download link
      const link = document.createElement('a')
      link.download = 'edited-image.jpg'
      link.href = canvas.toDataURL('image/jpeg', 0.8)
      link.click()
    }
    img.src = image
  }

  const toggleProperties = () => {
    setShowProperties(!showProperties)
    if (cropMode) setCropMode(false)
  }

  const toggleCropMode = () => {
    setCropMode(!cropMode)
    if (showProperties) setShowProperties(false)
  }

  // Handle click outside to close properties panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showProperties &&
        propertiesPanelRef.current &&
        !propertiesPanelRef.current.contains(event.target as Node) &&
        slidersBtnRef.current &&
        !slidersBtnRef.current.contains(event.target as Node)
      ) {
        setShowProperties(false)
        saveSnapshot()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProperties, saveSnapshot])

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 flex items-center justify-center relative">
        <div className="flex items-center justify-center space-x-6">
          <div className="relative">
            {cropMode && image ? (
              <ImageCropper 
                onCropComplete={handleCropComplete} 
                onCropCancel={handleCropCancel}
              />
            ) : (
              <ImageUploader />
            )}
          </div>
          
          {showProperties && image && !cropMode && (
            <div ref={propertiesPanelRef} className="w-64">
              <PropertiesPanel />
            </div>
          )}
        </div>
      </main>
      
      <footer className="p-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center"
            onClick={undo}
          >
            <Undo2 size={20} />
          </button>
          <button 
            className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center"
            onClick={redo}
          >
            <Redo2 size={20} />
          </button>
        </div>
        
        <div className="flex space-x-3">
          {image && (
            <>
              <button 
                ref={slidersBtnRef}
                className={`w-10 h-10 ${showProperties ? 'bg-gray-300' : 'bg-gray-100'} rounded-md flex items-center justify-center`}
                onClick={toggleProperties}
              >
                <SlidersHorizontal size={20} />
              </button>
              <button 
                className={`w-10 h-10 ${cropMode ? 'bg-gray-300' : 'bg-gray-100'} rounded-md flex items-center justify-center`}
                onClick={toggleCropMode}
              >
                <Crop size={20} />
              </button>
            </>
          )}
        </div>
        
        <div className="relative">
          {image && (
            <button 
              className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center"
              onClick={handleDownload}
              onMouseEnter={() => setShowDownloadTooltip(true)}
              onMouseLeave={() => setShowDownloadTooltip(false)}
            >
              <Download size={20} />
            </button>
          )}
          {showDownloadTooltip && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              Download
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

export default ImageEditor 