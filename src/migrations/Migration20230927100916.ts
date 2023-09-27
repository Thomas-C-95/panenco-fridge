import { Migration } from '@mikro-orm/migrations';

export class Migration20230927100916 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "recipe" add column "owner_id" uuid not null;');
    this.addSql('alter table "recipe" alter column "ingredients" type text[] using ("ingredients"::text[]);');
    this.addSql('alter table "recipe" add constraint "recipe_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "recipe" drop constraint "recipe_owner_id_foreign";');

    this.addSql('alter table "recipe" alter column "ingredients" type varchar(255) using ("ingredients"::varchar(255));');
    this.addSql('alter table "recipe" drop column "owner_id";');
  }

}
