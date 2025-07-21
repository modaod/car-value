import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate, OneToMany } from 'typeorm';
import { Report } from '../report/report.entity'; // Add this import
@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id: number;
   
   @Column({ length: 100, unique: true })
   email: string;
   
   @Exclude()
   @Column({ length: 100 })
   password: string;

   @Column({ default: true })
  admin: boolean;

   @OneToMany(() => Report, (report) => report.user)
   reports: Report[];

   @AfterInsert()
   logInsert() {
      console.log(`Inserted user with id: ${this.id}`);
   }

   @AfterUpdate()
   logUpdate() {
      console.log(`Updated user with id: ${this.id}`);
   }

   @AfterRemove()
   logRemove() {
      console.log(`Removed user with id: ${this.id}`);
   }
}