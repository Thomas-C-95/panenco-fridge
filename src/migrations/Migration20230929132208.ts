import { Migration } from '@mikro-orm/migrations';

export class Migration20230929132208 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "fridge" ("name" varchar(255) not null, "location" varchar(255) not null, "capacity" int not null, constraint "fridge_pkey" primary key ("name"));');

    this.addSql('alter table "fridge_contents" add constraint "fridge_contents_fridge_name_foreign" foreign key ("fridge_name") references "fridge" ("name") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "fridge_contents" drop constraint "fridge_contents_fridge_name_foreign";');

    this.addSql('drop table if exists "fridge" cascade;');
  }

}
