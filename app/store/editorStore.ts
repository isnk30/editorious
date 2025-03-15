import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface EditorState {
  image: string | null
  history: {
    past: EditorSnapshot[]
    future: EditorSnapshot[]
  }
  hue: number
  saturation: number
  exposure: number
  cropMode: boolean
  
  // Actions
  setImage: (image: string | null) => void
  setHue: (value: number) => void
  setSaturation: (value: number) => void
  setExposure: (value: number) => void
  setCropMode: (active: boolean) => void
  undo: () => void
  redo: () => void
  saveSnapshot: () => void
}

interface EditorSnapshot {
  image: string | null
  hue: number
  saturation: number
  exposure: number
}

export const useEditorStore = create<EditorState>()(
  devtools(
    (set, get) => ({
      image: null,
      history: {
        past: [],
        future: []
      },
      hue: 0,
      saturation: 0,
      exposure: 0,
      cropMode: false,

      setImage: (image) => {
        set({ image })
        get().saveSnapshot()
      },
      
      setHue: (value) => {
        set({ hue: value })
      },
      
      setSaturation: (value) => {
        set({ saturation: value })
      },
      
      setExposure: (value) => {
        set({ exposure: value })
      },
      
      setCropMode: (active) => {
        set({ cropMode: active })
      },
      
      saveSnapshot: () => {
        const { image, hue, saturation, exposure } = get()
        set((state) => ({
          history: {
            past: [...state.history.past, { image, hue, saturation, exposure }],
            future: []
          }
        }))
      },
      
      undo: () => {
        const { history } = get()
        if (history.past.length === 0) return
        
        const newPast = [...history.past]
        const lastState = newPast.pop()
        
        if (!lastState) return
        
        set((state) => ({
          image: lastState.image,
          hue: lastState.hue,
          saturation: lastState.saturation,
          exposure: lastState.exposure,
          history: {
            past: newPast,
            future: [{ image: state.image, hue: state.hue, saturation: state.saturation, exposure: state.exposure }, ...state.history.future]
          }
        }))
      },
      
      redo: () => {
        const { history } = get()
        if (history.future.length === 0) return
        
        const newFuture = [...history.future]
        const nextState = newFuture.shift()
        
        if (!nextState) return
        
        set((state) => ({
          image: nextState.image,
          hue: nextState.hue,
          saturation: nextState.saturation,
          exposure: nextState.exposure,
          history: {
            past: [...state.history.past, { image: state.image, hue: state.hue, saturation: state.saturation, exposure: state.exposure }],
            future: newFuture
          }
        }))
      }
    }),
    { name: 'editor-store' }
  )
) 