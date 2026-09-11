import { useState } from 'react'
import { Scissors } from 'lucide-react'
import api, { getErrorMessage, readToolResult, uploadFile } from '../services/api'
import Button from '../components/Button'
import FileDropzone from '../components/FileDropzone'
import FileListItem from '../components/FileListItem'
import ProgressState from '../components/ProgressState'

export default function SplitTool() {
  const [file, setFile] = useState(null)
  const [fileId, setFileId] = useState(null)
  const [pages, setPages] = useState('')
  const [pagesError, setPagesError] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const busy = status === 'uploading' || status === 'processing'

  const reset = () => {
    setFile(null)
    setFileId(null)
    setPages('')
    setPagesError('')
    setStatus('idle')
    setMessage('')
    setResult(null)
  }

  const runSplit = async (id, value) => {
    setStatus('processing')
    setMessage('Splitting document…')
    const { data } = await api.post('/tools/split', { file_id: id, pages: value })
    setResult(readToolResult(data))
    setStatus('success')
  }

  const handleSplit = async () => {
    const value = pages.trim()

    if (!file) {
      setStatus('error')
      setMessage('Select a PDF first.')
      return
    }
    if (!value) {
      setPagesError('Enter a page range, e.g. 1-3,5')
      return
    }
    if (!/^\s*\d+(\s*-\s*\d+)?(\s*,\s*\d+(\s*-\s*\d+)?)*\s*$/.test(value)) {
      setPagesError('Use numbers, ranges and commas only — e.g. 1-3,5')
      return
    }
    setPagesError('')

    try {
      let id = fileId
      if (!id) {
        setStatus('uploading')
        setMessage(`Uploading ${file.name}…`)
        id = await uploadFile(file)
        setFileId(id)
      }
      await runSplit(id, value)
    } catch (error) {
      setStatus('error')
      setMessage(getErrorMessage(error, 'Split failed. Please try again.'))
    }
  }

  const handleRetry = () => {
    if (fileId) {
      runSplit(fileId, pages.trim()).catch((error) => {
        setStatus('error')
        setMessage(getErrorMessage(error, 'Split failed. Please try again.'))
      })
      return
    }
    handleSplit()
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14">
      <div className="mb-8 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface">
          <Scissors className="size-5 text-accent" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Split PDF</h1>
          <p className="mt-1 text-sm text-muted">
            Extract an exact page range from a single document.
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
          <label htmlFor="pages" className="mb-1.5 block text-sm font-medium text-ink">
            Page range
          </label>
          <input
            id="pages"
            type="text"
            value={pages}
            disabled={busy}
            onChange={(event) => {
              setPages(event.target.value)
              setPagesError('')
            }}
            placeholder="e.g. 1-3,5"
            className="w-full max-w-xs rounded-lg border border-line bg-surface px-3.5 py-2.5 font-mono text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/70 hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
          />
          {pagesError ? <p className="mt-1.5 text-sm text-error">{pagesError}</p> : null}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSplit} disabled={busy || !file}>
            {busy ? <span className="animate-pulse">Working…</span> : 'Split PDF'}
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
