import { Migration } from '@mikro-orm/migrations';

export class Migration20230925090432 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null, "email" varchar(255) not null, "name" varchar(255) not null, "products" text[] not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
