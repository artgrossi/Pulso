import type { ContentBlock } from '@/lib/types/database';

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
}

export function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">Conteúdo em breve...</p>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <ContentBlockItem key={i} block={block} />
      ))}
    </div>
  );
}

function ContentBlockItem({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
          {block.content}
        </div>
      );

    case 'tip':
      return (
        <div className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <span className="mt-0.5 shrink-0 text-lg">💡</span>
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Dica
            </p>
            <p className="text-sm leading-relaxed text-emerald-200/80">
              {block.content}
            </p>
          </div>
        </div>
      );

    case 'warning':
      return (
        <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <span className="mt-0.5 shrink-0 text-lg">⚠️</span>
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
              Atenção
            </p>
            <p className="text-sm leading-relaxed text-amber-200/80">
              {block.content}
            </p>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <div className="bg-gray-800/50 p-8 text-center text-sm text-gray-500">
            📷 {block.content}
          </div>
        </div>
      );

    case 'video':
      return (
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <div className="bg-gray-800/50 p-8 text-center text-sm text-gray-500">
            🎬 {block.content}
          </div>
        </div>
      );

    default:
      return (
        <p className="text-sm text-gray-300">{block.content}</p>
      );
  }
}
