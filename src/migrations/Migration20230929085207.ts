import { Migration } from '@mikro-orm/migrations';

export class Migration20230929085207 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "role" varchar(255) not null default \'user\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "role";');
  }

}
