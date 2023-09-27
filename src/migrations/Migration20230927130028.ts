import { Migration } from '@mikro-orm/migrations';

export class Migration20230927130028 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" alter column "size" type int using ("size"::int);');
    this.addSql('alter table "product" alter column "size" set default 1;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" alter column "size" drop default;');
    this.addSql('alter table "product" alter column "size" type int using ("size"::int);');
  }

}
