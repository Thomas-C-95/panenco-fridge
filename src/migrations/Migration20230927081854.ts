import { Migration } from '@mikro-orm/migrations';

export class Migration20230927081854 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "recipe" ("name" varchar(255) not null, "description" varchar(255) not null, "ingredients" text[] not null, constraint "recipe_pkey" primary key ("name"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "recipe" cascade;');
  }

}
