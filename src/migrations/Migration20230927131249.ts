import { Migration } from '@mikro-orm/migrations';

export class Migration20230927131249 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "recipe" alter column "ingredients" type jsonb using ("ingredients"::jsonb);');

    this.addSql('alter table "product" alter column "size" drop default;');
    this.addSql('alter table "product" alter column "size" type int using ("size"::int);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "recipe" alter column "ingredients" type varchar(255) using ("ingredients"::varchar(255));');

    this.addSql('alter table "product" alter column "size" type int using ("size"::int);');
    this.addSql('alter table "product" alter column "size" set default 1;');
  }

}
