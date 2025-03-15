import React, { useEffect } from 'react'
import PropertySlider from './PropertySlider'
import { useEditorStore } from '../store/editorStore'

const PropertiesPanel: React.FC = () => {
  const { hue, saturation, exposure, setHue, setSaturation, setExposure, saveSnapshot } = useEditorStore()

  const handleHueChange = (value: number) => {
    setHue(value)
  }

  const handleSaturationChange = (value: number) => {
    setSaturation(value)
  }

  const handleExposureChange = (value: number) => {
    setExposure(value)
  }

  // Save snapshot when component unmounts
  useEffect(() => {
    return () => {
      saveSnapshot()
    }
  }, [saveSnapshot])

  return (
    <div className="bg-gray-100 p-4 rounded-lg w-full h-fit">
      <h2 className="text-sm text-gray-500 mb-5 font-bold">PROPERTIES</h2>
      
      <div className="mb-6">
        <PropertySlider
          label="HUE"
          value={hue}
          onChange={handleHueChange}
          min={-180}
          max={180}
          step={1}
        />
      </div>
      
      <div className="mb-6">
        <PropertySlider
          label="SATURATION"
          value={saturation}
          onChange={handleSaturationChange}
          min={-100}
          max={100}
          step={1}
        />
      </div>
      
      <div className="mb-4">
        <PropertySlider
          label="EXPOSURE"
          value={exposure}
          onChange={handleExposureChange}
          min={-100}
          max={100}
          step={1}
        />
      </div>
    </div>
  )
}

export default PropertiesPanel 