import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'react-social',
      password: 'react-social',
      database: 'react-social',
      entities: [],
      synchronize: true,
    }),
    UserController,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
