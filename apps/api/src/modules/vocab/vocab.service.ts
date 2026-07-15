import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DB_TOKEN } from '../../database/database.module';
import { vocabSets } from '@querencia/db';
import { eq, and, desc } from 'drizzle-orm';
import { CreateVocabSetDto } from './dto/create-vocab-set.dto';
import { UpdateVocabSetDto } from './dto/update-vocab-set.dto';

// Chỉ trả metadata (không kèm mảng words) cho danh sách — tránh tải nặng
const listColumns = {
  id: vocabSets.id,
  name: vocabSets.name,
  isPublic: vocabSets.isPublic,
  wordCount: vocabSets.wordCount,
  userId: vocabSets.userId,
  createdAt: vocabSets.createdAt,
  updatedAt: vocabSets.updatedAt,
};

@Injectable()
export class VocabService {
  constructor(@Inject(DB_TOKEN) private readonly db: any) {}

  async create(userId: string, dto: CreateVocabSetDto) {
    const [row] = await this.db
      .insert(vocabSets)
      .values({
        userId,
        name: dto.name,
        isPublic: !!dto.isPublic,
        words: dto.words,
        wordCount: dto.words.length,
      })
      .returning(listColumns);
    return row;
  }

  async listMine(userId: string) {
    return this.db
      .select(listColumns)
      .from(vocabSets)
      .where(eq(vocabSets.userId, userId))
      .orderBy(desc(vocabSets.createdAt));
  }

  async listPublic() {
    return this.db
      .select(listColumns)
      .from(vocabSets)
      .where(eq(vocabSets.isPublic, true))
      .orderBy(desc(vocabSets.createdAt));
  }

  async getMineDetail(userId: string, id: string) {
    const [row] = await this.db
      .select()
      .from(vocabSets)
      .where(and(eq(vocabSets.id, id), eq(vocabSets.userId, userId)));
    if (!row) throw new NotFoundException('Không tìm thấy bộ từ này.');
    return row;
  }

  async getPublicDetail(id: string) {
    const [row] = await this.db
      .select()
      .from(vocabSets)
      .where(and(eq(vocabSets.id, id), eq(vocabSets.isPublic, true)));
    if (!row) throw new NotFoundException('Bộ từ không tồn tại hoặc không công khai.');
    return row;
  }

  private async assertOwner(userId: string, id: string) {
    const [row] = await this.db.select({ userId: vocabSets.userId }).from(vocabSets).where(eq(vocabSets.id, id));
    if (!row) throw new NotFoundException('Không tìm thấy bộ từ này.');
    if (row.userId !== userId) throw new ForbiddenException('Bạn không có quyền sửa bộ từ này.');
  }

  async update(userId: string, id: string, dto: UpdateVocabSetDto) {
    await this.assertOwner(userId, id);
    const patch: any = { updatedAt: new Date() };
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.isPublic !== undefined) patch.isPublic = dto.isPublic;
    if (dto.words !== undefined) {
      patch.words = dto.words;
      patch.wordCount = dto.words.length;
    }
    const [row] = await this.db
      .update(vocabSets)
      .set(patch)
      .where(eq(vocabSets.id, id))
      .returning(listColumns);
    return row;
  }

  async remove(userId: string, id: string) {
    await this.assertOwner(userId, id);
    await this.db.delete(vocabSets).where(eq(vocabSets.id, id));
    return { success: true };
  }
}
