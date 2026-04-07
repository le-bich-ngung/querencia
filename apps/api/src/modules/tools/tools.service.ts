/**
 * Tools Service — NestJS
 * Danh sách tools sync với apps/web/src/lib/tools-registry.ts
 * Chỉ track quota cho tools có qCost > 0
 */
import { Injectable } from '@nestjs/common';
import { QuotaService } from './quota.service';

interface ToolEntry {
  slug:    string;
  name:    string;
  tier:    'free' | 'paid';
  qCost:   number;
  backend: 'none' | 'ai-service' | 'external-api';
}

// Chỉ list tools có backend — pure client-side tools không cần register ở đây
const BACKEND_TOOLS: ToolEntry[] = [
  { slug: 'flashcards',             name: 'Flashcards',              tier: 'free', qCost: 0, backend: 'ai-service' },
  { slug: 'vault',                  name: 'Vault — Self-destruct Link', tier: 'free', qCost: 0, backend: 'ai-service' },
  { slug: 'pdf-to-word',            name: 'PDF → Word',              tier: 'free', qCost: 1, backend: 'ai-service' },
  { slug: 'screenshot-translator',  name: 'Screenshot Translator',   tier: 'paid', qCost: 2, backend: 'ai-service' },
];

@Injectable()
export class ToolsService {
  getTools(userId?: string) {
    return BACKEND_TOOLS;
  }


  constructor(private readonly quotaService: QuotaService) {}

  async useTool(toolSlug: string, userId: string, plan: string) {
    const tool = BACKEND_TOOLS.find(t => t.slug === toolSlug);
    if (!tool) return { ok: true, qDeducted: 0 }; // client-side tool

    if (tool.qCost > 0) {
      await this.quotaService.checkAndDeduct(userId, plan, tool.qCost);
    }

    return { ok: true, tool: tool.slug, qDeducted: tool.qCost };
  }

  async getQuota(userId: string) {
    return this.quotaService.getUsage(userId);
  }
}
