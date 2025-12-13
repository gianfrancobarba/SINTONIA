import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    return 'OK';
  }

  getHello(): string {
    return 'SINTONIA Backend is running!';
  }
}
