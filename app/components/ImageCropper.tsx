import React, { useState, useCallback, useEffect, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { useEditorStore } from '../store/editorStore'
import CropHandles from './CropHandles'

interface ImageCropperProps {
  onCropComplete: (croppedImage: string) => void
  onCropCancel: () => void
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onCropComplete, onCropCancel }) => {
  const { image } = useEditorStore()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 })
  const cropperContainerRef = useRef<HTMLDivElement>(null)

  // Calculate dimensions when component mounts
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

  // Add keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCropCancel()
      } else if (e.key === 'Enter') {
        handleApplyCrop()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCropCancel])

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop)
  }

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom)
  }

  const onCropCompleteCallback = useCallback(
    (_: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<string> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    // Set canvas size to match the cropped image
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    // Return the cropped image as a data URL
    return canvas.toDataURL('image/jpeg')
  }

  const handleApplyCrop = async () => {
    if (!image || !croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      onCropComplete(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  if (!image) return null

  return (
    <div className="relative" style={{ 
      width: `${dimensions.width + 20}px`, 
      height: `${dimensions.height + 40}px`,
      backgroundColor: '#f3f4f6',
      padding: '10px',
      borderRadius: '4px'
    }}>
      <div className="text-xs text-gray-500 mb-2 flex justify-between">
        <span>Press ESC to cancel</span>
        <span>Press Enter to apply</span>
      </div>
      <div 
        ref={cropperContainerRef}
        style={{ 
          width: `${dimensions.width}px`, 
          height: `${dimensions.height}px`,
          position: 'relative'
        }}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={undefined} // Allow free-form cropping
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteCallback}
          cropShape="rect"
          showGrid={true}
          classes={{
            containerClassName: 'custom-cropper-container',
            cropAreaClassName: 'custom-crop-area'
          }}
        />
        <CropHandles cropAreaRef={cropperContainerRef} />
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="bg-white text-black px-3 py-1 rounded-md text-sm"
          onClick={handleApplyCrop}
        >
          Apply?
        </button>
      </div>
    </div>
  )
}

export default ImageCropper 