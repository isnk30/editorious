# Simple Image Editor

A clean and modern image editor built with Next.js. This application allows users to upload images, apply adjustments like hue, saturation, and exposure, crop images, and download the edited results.

## Features

- Image upload
- Image editing with sliders for:
  - Hue
  - Saturation
  - Exposure
- Image cropping
- Undo/Redo functionality
- Download edited images

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Click on the center area to upload an image
2. Use the settings icon to adjust hue, saturation, and exposure
3. Use the crop icon to crop the image
4. Use the undo/redo buttons to navigate through your edit history
5. Use the download button to save your edited image

## Technologies Used

- Next.js
- React
- TailwindCSS
- Zustand (for state management)
- Lucide React (for icons)
- React Easy Crop (for image cropping) 