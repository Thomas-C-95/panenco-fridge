import { Migration } from '@mikro-orm/migrations';

export class Migration20230928133725 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_owner_id_foreign";');

    this.addSql('alter table "product" alter column "owner_id" drop default;');
    this.addSql('alter table "product" alter column "owner_id" type uuid using ("owner_id"::text::uuid);');
    this.addSql('alter table "product" alter column "owner_id" drop not null;');
    this.addSql('alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_owner_id_foreign";');

    this.addSql('alter table "product" alter column "owner_id" drop default;');
    this.addSql('alter table "product" alter column "owner_id" type uuid using ("owner_id"::text::uuid);');
    this.addSql('alter table "product" alter column "owner_id" set not null;');
    this.addSql('alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
  }

}
