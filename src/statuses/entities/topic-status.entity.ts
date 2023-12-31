import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

@Entity({ name: 'topic-statuses' })
export class TopicStatusEntity {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  id: number;

  @ApiProperty({ example: 'Active' })
  @Allow()
  @Column()
  name: string;
}
