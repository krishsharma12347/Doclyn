import { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'

/*
  Reusable dropzone.
  Props:
    - multiple: allow more than one file
    - accept: input accept string (default "application/pdf")
    - onFilesSelected(files: File[])
    - disabled
    - hint: small helper line under the label
*/
export default function FileDropzone({
  multiple = false,
  accept = 'application/pdf',
  onFilesSelected,
  disabled = false,
  hint,
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [rejected, setRejected] = useState('')

  const handleFiles = useCallback(
    (fileList) => {
      const all = Array.from(fileList || [])
      const pdfs = all.filter(
        (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
      )

      if (pdfs.length !== all.length) {
        setRejected('Only PDF files are supported. Non-PDF files were ignored.')
      } else {
        setRejected('')
      }

      if (pdfs.length === 0) return
      onFilesSelected(multiple ? pdfs : [pdfs[0]])
    },
    [multiple, onFilesSelected],
  )

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openPicker()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          if (disabled) return
          handleFiles(event.dataTransfer.files)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg px-6 py-12 text-center transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-canvas ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        } ${
          isDragging
            ? 'border-2 border-solid border-accent bg-accent-tint'
            : 'border-2 border-dashed border-line bg-surface hover:border-accent hover:bg-accent-tint/40'
        }`}
      >
        <span
          className={`flex size-11 items-center justify-center rounded-lg border transition-all duration-200 ${
            isDragging ? 'border-accent bg-surface' : 'border-line bg-canvas'
          }`}
        >
          <UploadCloud className="size-5 text-accent" strokeWidth={1.75} />
        </span>

        <div>
          <p className="text-sm font-medium text-ink">
            {isDragging
              ? 'Drop to add'
              : multiple
                ? 'Drag PDFs here, or click to browse'
                : 'Drag a PDF here, or click to browse'}
          </p>
          {hint ? <p className="mt-1 font-mono text-xs text-muted">{hint}</p> : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {rejected ? <p className="mt-2 text-sm text-warning">{rejected}</p> : null}
    </div>
  )
}
