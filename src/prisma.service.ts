import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    // constructor() {
    //     super({
    //         log: [
    //             { level: 'query', emit: 'event' },
    //             { level: 'error', emit: 'stdout' },
    //             { level: 'info', emit: 'stdout' },
    //             { level: 'warn', emit: 'stdout' },
    //         ],
    //     });
    //
    //     // @ts-ignore
    //     this.$on('query', (e) => {
    //         // @ts-ignore
    //         console.log('Query:', e.query);
    //         // @ts-ignore
    //         console.log('Params:', e.params);
    //     });
    // }
    async onModuleInit() {
        await this.$connect();
    }
}
