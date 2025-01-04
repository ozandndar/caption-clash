import CaptionInput from '@/components/CaptionInput'
import CaptionList from '@/components/CaptionList'

export default function ScreenshotPage({ params }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Screenshot display component here */}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Captions</h2>
        <CaptionInput 
          screenshotId={params.id} 
          onCaptionAdded={(newCaption) => {
            // Optional: Handle new caption added
          }}
        />
        <CaptionList screenshotId={params.id} />
      </div>
    </div>
  )
} 