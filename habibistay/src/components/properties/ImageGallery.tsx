'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Grid3x3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageGalleryProps {
  images: any[]
  onClose: () => void
}

export default function ImageGallery({ images, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single')

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={onClose}
            className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-white">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
              className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors"
            >
              <Grid3x3 className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {viewMode === 'single' ? (
          <>
            {/* Single Image View */}
            <div className="h-full flex items-center justify-center p-16">
              <div className="relative w-full h-full max-w-6xl">
                <Image
                  src={images[currentIndex]?.url || '/placeholder-property.jpg'}
                  alt={images[currentIndex]?.caption || 'Property image'}
                  fill
                  className="object-contain"
                />
                {images[currentIndex]?.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-center">{images[currentIndex].caption}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Thumbnails */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex justify-center space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                      index === currentIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.url || '/placeholder-property.jpg'}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Grid View */
          <div className="h-full overflow-y-auto p-8 pt-20">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setViewMode('single')
                  }}
                  className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={image.url || '/placeholder-property.jpg'}
                    alt={image.caption || `Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                      <p className="text-white text-sm truncate">{image.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}