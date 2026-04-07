ï»¿/**
 * Tools Service â NestJS
 * Danh sÃ¡ch tools sync vá»i apps/web/src/lib/tools-registry.ts
 * Chá» track quota cho tools cÃ³ qCost > 0
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

// Chá» list tools cÃ³ backend â pure client-side tools khÃ´ng cáº§n register á» ÄÃ¢y
const BACKEND_TOOLS: ToolEntry[] = [
  { slug: 'flashcards',             name: 'Flashcards',              tier: 'free', qCost: 0, backend: 'ai-service' },
  { slug: 'vault',                  name: 'Vault â Self-destruct Link', tier: 'free', qCost: 0, backend: 'ai-service' },
  { slug: 'pdf-to-word',            name: 'PDF â Word',              tier: 'free', qCost: 1, backend: 'ai-service' },
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
