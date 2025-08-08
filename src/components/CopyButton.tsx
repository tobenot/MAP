import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string; // default label when not copied
  copiedLabel?: string; // label shown briefly after copy
}

export default function CopyButton({ text, className = '', label = '复制', copiedLabel = '已复制' }: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center px-2 py-1 text-xs rounded border border-primary-300 text-primary-700 bg-white hover:bg-primary-50 ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}