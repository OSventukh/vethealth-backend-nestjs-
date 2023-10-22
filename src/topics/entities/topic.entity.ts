import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { TopicContentTypeEnum } from '../topic.enum';

import { PostEntity } from '@/posts/entities/post.entity';
import { CategoryEntity } from '@/categories/entities/category.entity';
import { PageEntity } from '@/pages/entities/page.entity';
import { UserEntity } from '@/users/entities/user.entity';
import { TopicStatusEntity } from '@/statuses/entities/topic-status.entity';
import { FileEntity } from '@/files/entities/file.entity';
import { Transform } from 'class-transformer';

@Entity({ name: 'topics' })
export class TopicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToOne(() => FileEntity, { eager: true })
  @JoinColumn()
  image: FileEntity;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => TopicStatusEntity, { eager: true })
  @Transform(({ obj }) => obj?.status?.name)
  status: TopicStatusEntity;

  @Column()
  slug: string;

  @Column({ name: 'content_type', type: 'enum', enum: TopicContentTypeEnum })
  contentType: TopicContentTypeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => PostEntity, (post) => post.topics)
  @JoinTable({ name: 'topic_post_relation' })
  posts: PostEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.topics)
  @JoinTable({ name: 'topic_category_relation' })
  categories: CategoryEntity[];

  @ManyToOne(() => PageEntity)
  page: PageEntity;

  @ManyToOne(() => TopicEntity, (topic) => topic.children)
  parent: TopicEntity;

  @OneToMany(() => TopicEntity, (topic) => topic.parent)
  children: TopicEntity[];

  @ManyToMany(() => UserEntity, (user) => user.topics)
  @JoinTable({ name: 'topic_user_relation' })
  users: UserEntity[];
}
