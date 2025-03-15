import React, { useEffect } from 'react'

interface CropHandlesProps {
  cropAreaRef: React.RefObject<HTMLDivElement>
}

const CropHandles: React.FC<CropHandlesProps> = ({ cropAreaRef }) => {
  useEffect(() => {
    // Find the crop area element
    const findCropArea = () => {
      if (!cropAreaRef.current) return null
      
      // Look for the crop area element
      const cropArea = document.querySelector('.reactEasyCrop_CropArea')
      if (cropArea) {
        // Add corner handles
        addCornerHandles(cropArea as HTMLElement)
        // Add side handles
        addSideHandles(cropArea as HTMLElement)
        // Add rule of thirds grid
        addRuleOfThirdsGrid(cropArea as HTMLElement)
      }
    }

    const addCornerHandles = (cropArea: HTMLElement) => {
      // Create corner handles
      const topLeft = document.createElement('div')
      topLeft.className = 'corner-handle top-left'
      topLeft.style.cssText = 'position: absolute; width: 10px; height: 10px; background-color: white; top: -5px; left: -5px; border-radius: 50%; cursor: nwse-resize; z-index: 10;'
      cropArea.appendChild(topLeft)

      const topRight = document.createElement('div')
      topRight.className = 'corner-handle top-right'
      topRight.style.cssText = 'position: absolute; width: 10px; height: 10px; background-color: white; top: -5px; right: -5px; border-radius: 50%; cursor: nesw-resize; z-index: 10;'
      cropArea.appendChild(topRight)

      const bottomLeft = document.createElement('div')
      bottomLeft.className = 'corner-handle bottom-left'
      bottomLeft.style.cssText = 'position: absolute; width: 10px; height: 10px; background-color: white; bottom: -5px; left: -5px; border-radius: 50%; cursor: nesw-resize; z-index: 10;'
      cropArea.appendChild(bottomLeft)

      const bottomRight = document.createElement('div')
      bottomRight.className = 'corner-handle bottom-right'
      bottomRight.style.cssText = 'position: absolute; width: 10px; height: 10px; background-color: white; bottom: -5px; right: -5px; border-radius: 50%; cursor: nwse-resize; z-index: 10;'
      cropArea.appendChild(bottomRight)
    }

    const addSideHandles = (cropArea: HTMLElement) => {
      // Create side handles
      const leftHandle = document.createElement('div')
      leftHandle.className = 'side-handle left'
      leftHandle.style.cssText = 'position: absolute; width: 6px; height: 30px; background-color: white; left: -3px; top: 50%; transform: translateY(-50%); cursor: ew-resize; border-radius: 2px; z-index: 10;'
      cropArea.appendChild(leftHandle)

      const rightHandle = document.createElement('div')
      rightHandle.className = 'side-handle right'
      rightHandle.style.cssText = 'position: absolute; width: 6px; height: 30px; background-color: white; right: -3px; top: 50%; transform: translateY(-50%); cursor: ew-resize; border-radius: 2px; z-index: 10;'
      cropArea.appendChild(rightHandle)

      const topHandle = document.createElement('div')
      topHandle.className = 'side-handle top'
      topHandle.style.cssText = 'position: absolute; width: 30px; height: 6px; background-color: white; top: -3px; left: 50%; transform: translateX(-50%); cursor: ns-resize; border-radius: 2px; z-index: 10;'
      cropArea.appendChild(topHandle)

      const bottomHandle = document.createElement('div')
      bottomHandle.className = 'side-handle bottom'
      bottomHandle.style.cssText = 'position: absolute; width: 30px; height: 6px; background-color: white; bottom: -3px; left: 50%; transform: translateX(-50%); cursor: ns-resize; border-radius: 2px; z-index: 10;'
      cropArea.appendChild(bottomHandle)
    }

    const addRuleOfThirdsGrid = (cropArea: HTMLElement) => {
      // Create rule of thirds grid
      const gridContainer = document.createElement('div')
      gridContainer.className = 'rule-of-thirds-grid'
      gridContainer.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none;'
      
      // Horizontal lines
      const horizontalLine1 = document.createElement('div')
      horizontalLine1.style.cssText = 'position: absolute; width: 100%; height: 1px; background-color: rgba(255, 255, 255, 0.5); top: 33.33%; left: 0;'
      gridContainer.appendChild(horizontalLine1)
      
      const horizontalLine2 = document.createElement('div')
      horizontalLine2.style.cssText = 'position: absolute; width: 100%; height: 1px; background-color: rgba(255, 255, 255, 0.5); top: 66.66%; left: 0;'
      gridContainer.appendChild(horizontalLine2)
      
      // Vertical lines
      const verticalLine1 = document.createElement('div')
      verticalLine1.style.cssText = 'position: absolute; width: 1px; height: 100%; background-color: rgba(255, 255, 255, 0.5); left: 33.33%; top: 0;'
      gridContainer.appendChild(verticalLine1)
      
      const verticalLine2 = document.createElement('div')
      verticalLine2.style.cssText = 'position: absolute; width: 1px; height: 100%; background-color: rgba(255, 255, 255, 0.5); left: 66.66%; top: 0;'
      gridContainer.appendChild(verticalLine2)
      
      cropArea.appendChild(gridContainer)
    }

    // Wait for the crop area to be rendered
    const checkInterval = setInterval(() => {
      findCropArea()
    }, 100)

    return () => {
      clearInterval(checkInterval)
    }
  }, [cropAreaRef])

  return null
}

export default CropHandles 