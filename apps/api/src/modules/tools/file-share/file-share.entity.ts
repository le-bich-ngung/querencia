import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('file_shares')
export class FileShare {
  @PrimaryColumn()
  id: string;

  @Column()
  r2Key: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  fileName: string;

  @Column({ default: false })
  hasPassword: boolean;

  @Column({ type: 'int', default: 0 })
  dlLimit: number; // 0 = unlimited

  @Column({ type: 'int', default: 0 })
  dlCount: number;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ nullable: true })
  uploadedBy: string; // userId, nullable (no account needed)

  @CreateDateColumn()
  createdAt: Date;
}
