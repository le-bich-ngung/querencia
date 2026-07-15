import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VocabService } from './vocab.service';
import { CreateVocabSetDto } from './dto/create-vocab-set.dto';
import { UpdateVocabSetDto } from './dto/update-vocab-set.dto';

@ApiTags('Vocab')
@Controller('vocab-sets')
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tạo bộ từ vựng mới (upload)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateVocabSetDto) {
    return this.vocabService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('mine')
  @ApiOperation({ summary: 'Danh sách bộ từ của chính mình (cả private + public)' })
  listMine(@CurrentUser('id') userId: string) {
    return this.vocabService.listMine(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('mine/:id')
  @ApiOperation({ summary: 'Chi tiết 1 bộ từ của mình (kèm words để học)' })
  getMine(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.vocabService.getMineDetail(userId, id);
  }

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Danh sách bộ từ công khai của mọi người' })
  listPublic() {
    return this.vocabService.listPublic();
  }

  @Public()
  @Get('public/:id')
  @ApiOperation({ summary: 'Chi tiết 1 bộ từ công khai (ai cũng xem được)' })
  getPublicOne(@Param('id') id: string) {
    return this.vocabService.getPublicDetail(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Sửa tên / đổi Private-Public / sửa từ' })
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateVocabSetDto) {
    return this.vocabService.update(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Xoá bộ từ' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.vocabService.remove(userId, id);
  }
}
