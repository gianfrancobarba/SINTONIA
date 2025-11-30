import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('uploads')
export class UploadsController {
    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = join(process.cwd(), 'backend/uploads', filename);
        if (!existsSync(filePath)) {
            throw new NotFoundException('File not found');
        }
        return res.sendFile(filePath);
    }
}
