import { useState } from 'react'
import { FileStack } from 'lucide-react'
import api, { getErrorMessage, readToolResult, uploadFile } from '../services/api'
import Button from '../components/Button'
import FileDropzone from '../components/FileDropzone'
import FileListItem from '../components/FileListItem'
import ProgressState from '../components/ProgressState'

export default function MergeTool() {
  // State stays local to this page — nothing is lifted higher than needed.
  const [files, setFiles] = useState([])
  const [fileIds, setFileIds] = useState([])
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const busy = status === 'uploading' || status === 'processing'

  const addFiles = (incoming) => {
    setFiles((prev) => [...prev, ...incoming])
    setFileIds([]) // new selection invalidates previously uploaded ids
    setStatus('idle')
    setMessage('')
    setResult(null)
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setFileIds([])
  }

  const reset = () => {
    setFiles([])
    setFileIds([])
    setStatus('idle')
    setMessage('')
    setResult(null)
  }

  const runMerge = async (ids) => {
    setStatus('processing')
    setMessage('Merging documents…')
    const { data } = await api.post('/tools/merge', { file_ids: ids })
    setResult(readToolResult(data))
    setStatus('success')
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setStatus('error')
      setMessage('Select at least 2 PDFs to merge.')
      return
    }

    try {
      // Reuse already-uploaded ids so a failed merge can be retried without re-uploading.
      let ids = fileIds
      if (ids.length !== files.length) {
        setStatus('uploading')
        setMessage(`Uploading ${files.length} files…`)
        ids = []
        for (const file of files) {
          try {
            ids.push(await uploadFile(file))
          } catch (error) {
            throw new Error(`${file.name}: ${getErrorMessage(error, 'upload failed')}`)
          }
        }
        setFileIds(ids)
      }

      await runMerge(ids)
    } catch (error) {
      setStatus('error')
      setMessage(getErrorMessage(error, 'Merge failed. Please try again.'))
    }
  }

  const handleRetry = () => {
    if (fileIds.length === files.length && fileIds.length >= 2) {
      runMerge(fileIds).catch((error) => {
        setStatus('error')
        setMessage(getErrorMessage(error, 'Merge failed. Please try again.'))
      })
      return
    }
    handleMerge()
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14">
      <div className="mb-8 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface">
          <FileStack className="size-5 text-accent" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Merge PDF</h1>
          <p className="mt-1 text-sm text-muted">
            Combine two or more PDFs into one file, in the order listed below.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <FileDropzone
          multiple
          disabled={busy}
          onFilesSelected={addFiles}
          hint="PDF only · minimum 2 files"
        />

        {files.length > 0 ? (
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-sm font-medium text-ink">Selected files</h2>
              <span className="font-mono text-xs text-muted">{files.length} files</span>
            </div>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <FileListItem
                  key={`${file.name}-${index}`}
                  name={file.name}
                  size={file.size}
                  status={fileIds[index] ? 'uploaded' : undefined}
                  onRemove={busy ? undefined : () => removeFile(index)}
                />
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <Button onClick={handleMerge} disabled={busy || files.length < 2}>
            {busy ? <span className="animate-pulse">Working…</span> : 'Merge PDFs'}
          </Button>
          {files.length > 0 && !busy ? (
            <Button variant="ghost" onClick={reset}>
              Clear
            </Button>
          ) : null}
        </div>

        <ProgressState
          status={status}
          message={message}
          result={result}
          onRetry={handleRetry}
          onReset={reset}
        />
      </div>
    </div>
  )
}
