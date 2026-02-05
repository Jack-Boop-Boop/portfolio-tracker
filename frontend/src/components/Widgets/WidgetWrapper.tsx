import { ReactNode } from 'react'
import { GripVertical, Maximize2, MoreHorizontal } from 'lucide-react'

interface WidgetWrapperProps {
  title: string
  children: ReactNode
  onMaximize?: () => void
}

export default function WidgetWrapper({ title, children, onMaximize }: WidgetWrapperProps) {
  return (
    <div className="h-full flex flex-col bg-terminal-card rounded-lg border border-terminal-border
                    shadow-card overflow-hidden hover:border-terminal-hover transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border
                      bg-terminal-card/50">
        <div className="flex items-center gap-2">
          <div className="widget-drag-handle cursor-move p-1 hover:bg-terminal-hover rounded">
            <GripVertical className="w-4 h-4 text-text-muted" />
          </div>
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
        </div>

        <div className="flex items-center gap-1">
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="p-1 hover:bg-terminal-hover rounded transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-text-muted" />
            </button>
          )}
          <button className="p-1 hover:bg-terminal-hover rounded transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {children}
      </div>
    </div>
  )
}
