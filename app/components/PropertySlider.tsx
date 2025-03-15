import React, { useState, useRef, useEffect } from 'react'

interface PropertySliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

const PropertySlider: React.FC<PropertySliderProps> = ({
  label,
  value,
  onChange,
  min = -100,
  max = 100,
  step = 1
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  const handleValueClick = () => {
    setInputValue(value.toString())
    setIsEditing(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    let newValue = Number(inputValue)
    
    // Validate the input value
    if (isNaN(newValue)) {
      newValue = value
    } else {
      newValue = Math.max(min, Math.min(max, newValue))
    }
    
    onChange(newValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  // Calculate the position of the slider dot
  const dotPosition = ((value - min) / (max - min)) * 100;

  // Handle dot dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
    const newValue = Math.round(((percentage / 100) * (max - min) + min) / step) * step
    
    onChange(newValue)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium uppercase">{label}</label>
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-12 text-xs text-right bg-white border border-gray-300 rounded px-1 py-0.5 focus:outline-none"
            autoFocus
          />
        ) : (
          <span 
            className="text-xs cursor-pointer hover:text-blue-500"
            onClick={handleValueClick}
          >
            {value >= 0 ? '+' : ''}{value}
          </span>
        )}
      </div>
      <div 
        ref={sliderRef}
        className="relative h-1.5 mb-3"
      >
        {label === 'HUE' && (
          <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500"></div>
          </div>
        )}
        {label === 'SATURATION' && (
          <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-gray-300 to-red-500"></div>
          </div>
        )}
        {label === 'EXPOSURE' && (
          <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-black to-white"></div>
          </div>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-1.5 bg-transparent appearance-none cursor-pointer relative z-10"
          style={{
            WebkitAppearance: 'none',
            appearance: 'none'
          }}
        />
        {/* Slider dot */}
        <div 
          ref={dotRef}
          className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 ${isHovering || isDragging ? 'bg-gray-600' : 'bg-gray-400'} rounded-full cursor-pointer z-20`}
          style={{ left: `${dotPosition}%`, marginLeft: '-6px' }}
          onMouseDown={handleMouseDown}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        ></div>
      </div>
    </div>
  )
}

export default PropertySlider 