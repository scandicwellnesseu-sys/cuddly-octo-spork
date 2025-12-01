import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: { sub: string; organizationId: string };
}

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presigned-upload')
  @ApiOperation({ summary: 'Hämta presigned URL för uppladdning' })
  async getPresignedUpload(
    @Req() req: AuthenticatedRequest,
    @Body() body: { filename: string; mimeType: string },
  ) {
    return this.filesService.getPresignedUploadUrl(
      body.filename,
      body.mimeType,
      req.user.organizationId,
    );
  }

  @Get(':key/signed-url')
  @ApiOperation({ summary: 'Hämta signerad URL för fil' })
  async getSignedUrl(@Param('key') key: string) {
    const url = await this.filesService.getSignedUrl(key);
    return { url };
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Ta bort fil' })
  async deleteFile(@Param('key') key: string) {
    const success = await this.filesService.deleteFile(key);
    return { success };
  }
}
