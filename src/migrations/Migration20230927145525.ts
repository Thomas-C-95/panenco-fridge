import { Migration } from '@mikro-orm/migrations';

export class Migration20230927145525 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop column "type";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" add column "type" varchar(255) null;');
  }

}
