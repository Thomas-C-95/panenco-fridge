import { Migration } from '@mikro-orm/migrations';

export class Migration20230927141838 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" alter column "type" type varchar(255) using ("type"::varchar(255));');
    this.addSql('alter table "product" alter column "type" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" alter column "type" type varchar(255) using ("type"::varchar(255));');
    this.addSql('alter table "product" alter column "type" set not null;');
  }

}
