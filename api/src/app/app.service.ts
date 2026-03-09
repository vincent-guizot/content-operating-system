import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: "Content Operating System API SERVER"
    }
  }
}
