import { Migration } from '@mikro-orm/migrations';

export class Migration20230927113908 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "recipe" alter column "ingredients" type varchar(255) using ("ingredients"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "recipe" alter column "ingredients" type text[] using ("ingredients"::text[]);');
  }

}
