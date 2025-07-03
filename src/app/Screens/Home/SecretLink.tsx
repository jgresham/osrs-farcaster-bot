import React from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

interface SecretLinkDisplayProps {
  secretUrl: string
}

function SecretLinkDisplay({
  secretUrl,
}: SecretLinkDisplayProps) {
  const [isRevealed, setIsRevealed] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)

  const handleToggleReveal = () => setIsRevealed((prev) => !prev)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(secretUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 5000)
  }

  // Show stars for the secret, but keep the length similar for UX
  const masked = '•'.repeat(secretUrl.length)

  return (
    <div className="mb-4 w-full flex flex-col items-center">
      <span className="text-xs text-gray-700 font-medium mb-1">
        Copy your secret link and paste it in the RuneLite Dink plugin Primary Webhook URL:
      </span>
      <span className="font-mono text-sm bg-gray-100 rounded px-2 py-1 break-all flex items-center gap-1 select-none">
        <span
          className={isRevealed ? "select-all" : "select-none"}
          aria-label={isRevealed ? "Secret link revealed" : "Secret link hidden"}
          style={{ minWidth: "12rem" }}
        >
          {isRevealed ? secretUrl : masked}
        </span>
        <button
          type="button"
          aria-label={isRevealed ? "Hide secret link" : "Show secret link"}
          className="ml-1 p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleToggleReveal}
          tabIndex={0}
        >
          {isRevealed ? (
            <EyeOff className="w-4 h-4 text-gray-700" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4 text-gray-700" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          aria-label={linkCopied ? 'Copied!' : 'Copy link'}
          className="ml-1 p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCopy}
          tabIndex={0}
          title={isRevealed ? "Copy link" : "Reveal link to copy"}
        >
          {linkCopied ? (
            <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
          ) : (
            <Copy className="w-4 h-4 text-gray-500" aria-hidden="true" />
          )}
        </button>
      </span>
    </div>
  )
}

export default SecretLinkDisplay;