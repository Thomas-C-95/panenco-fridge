import { Migration } from '@mikro-orm/migrations';

export class Migration20230926075717 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "fridge_contents" ("fridge_name" varchar(255) not null, "product_id" uuid not null, constraint "fridge_contents_pkey" primary key ("fridge_name", "product_id"));');

    this.addSql('alter table "fridge_contents" add constraint "fridge_contents_fridge_name_foreign" foreign key ("fridge_name") references "fridge" ("name") on update cascade on delete cascade;');
    this.addSql('alter table "fridge_contents" add constraint "fridge_contents_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product" drop constraint "product_fridge_name_foreign";');

    this.addSql('alter table "product" drop column "fridge_name";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "fridge_contents" cascade;');

    this.addSql('alter table "product" add column "fridge_name" varchar(255) not null;');
    this.addSql('alter table "product" add constraint "product_fridge_name_foreign" foreign key ("fridge_name") references "fridge" ("name") on update cascade;');
  }

}
