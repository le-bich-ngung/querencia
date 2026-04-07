/**
 * Dynamic tool page â /tools/[slug]
 * Render má»i tool HTML trong iframe Äá» trÃ¡nh CSS/JS conflict
 * Tool HTML ÄÆ°á»£c serve tá»« /public/tools/*.html
 */
import { notFound } from 'next/navigation';
import { getToolBySlug, TOOLS } from '../../../lib/tools-registry';
import { ToolFrame } from './tool-frame';

// Static params cho táº¥t cáº£ 44 tools
export function generateStaticParams() {
  return TOOLS.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} â Querencia`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  return <ToolFrame tool={tool} />;
}
