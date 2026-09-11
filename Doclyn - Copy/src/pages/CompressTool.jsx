import { useState } from 'react'
import { Minimize2 } from 'lucide-react'
import api, { getErrorMessage, readToolResult, uploadFile } from '../services/api'
import Button from '../components/Button'
import FileDropzone from '../components/FileDropzone'
import FileListItem from '../components/FileListItem'
import ProgressState from '../components/ProgressState'

const LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export default function CompressTool() {
  const [file, setFile] = useState(null)
  const [fileId, setFileId] = useState(null)
  const [level, setLevel] = useState('medium')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const busy = status === 'uploading' || status === 'processing'

  const reset = () => {
    setFile(null)
    setFileId(null)
    setStatus('idle')
    setMessage('')
    setResult(null)
  }

  const runCompress = async (id, selectedLevel) => {
    setStatus('processing')
    setMessage(`Compressing at ${selectedLevel} level…`)
    const { data } = await api.post('/tools/compress', { file_id: id, level: selectedLevel })
    setResult(readToolResult(data))
    setStatus('success')
  }

  const handleCompress = async () => {
    if (!file) {
      setStatus('error')
      setMessage('Select a PDF first.')
      return
    }

    try {
      let id = fileId
      if (!id) {
        setStatus('uploading')
        setMessage(`Uploading ${file.name}…`)
        id = await uploadFile(file)
        setFileId(id)
      }
      await runCompress(id, level)
    } catch (error) {
      setStatus('error')
      setMessage(getErrorMessage(error, 'Compression failed. Please try again.'))
    }
  }

  const handleRetry = () => {
    if (fileId) {
      runCompress(fileId, level).catch((error) => {
        setStatus('error')
        setMessage(getErrorMessage(error, 'Compression failed. Please try again.'))
      })
      return
    }
    handleCompress()
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14">
      <div className="mb-8 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface">
          <Minimize2 className="size-5 text-accent" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Compress PDF</h1>
          <p className="mt-1 text-sm text-muted">
            Reduce file size while keeping the document readable.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <FileDropzone
          disabled={busy}
          onFilesSelected={(selected) => {
            setFile(selected[0])
            setFileId(null)
            setStatus('idle')
            setMessage('')
            setResult(null)
          }}
          hint="PDF only · exactly 1 file"
        />

        {file ? (
          <ul>
            <FileListItem
              name={file.name}
              size={file.size}
              status={fileId ? 'uploaded' : undefined}
              onRemove={busy ? undefined : reset}
            />
          </ul>
        ) : null}

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">Compression level</span>
          <div
            role="radiogroup"
            aria-label="Compression level"
            className="inline-flex rounded-lg border border-line bg-surface p-1"
          >
            {LEVELS.map((option) => {
              const active = level === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={busy}
                  onClick={() => setLevel(option.value)}
                  className={`rounded-md px-4 py-1.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60 ${
                    active
                      ? 'bg-accent text-white'
                      : 'text-muted hover:bg-accent-tint hover:text-accent'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleCompress} disabled={busy || !file}>
            {busy ? <span className="animate-pulse">Working…</span> : 'Compress PDF'}
          </Button>
          {file && !busy ? (
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
