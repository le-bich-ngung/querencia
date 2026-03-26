/**
 * Dynamic tool page — /tools/[slug]
 * Render mỗi tool HTML trong iframe để tránh CSS/JS conflict
 * Tool HTML được serve từ /public/tools/*.html
 */
import { notFound } from 'next/navigation';
import { getToolBySlug, TOOLS } from '@/lib/tools-registry';
import { ToolFrame } from './tool-frame';

// Static params cho tất cả 44 tools
export function generateStaticParams() {
  return TOOLS.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Querencia`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  return <ToolFrame tool={tool} />;
}
