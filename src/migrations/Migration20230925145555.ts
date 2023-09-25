import { Migration } from '@mikro-orm/migrations';

export class Migration20230925145555 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "fridge" ("name" varchar(255) not null, "location" varchar(255) not null, "capacity" int not null, constraint "fridge_pkey" primary key ("name"));');

    this.addSql('create table "user" ("id" uuid not null, "email" varchar(255) not null, "name" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "product" ("id" uuid not null, "type" varchar(255) not null, "size" int not null, "owner_id" uuid not null, "fridge_name" varchar(255) not null, constraint "product_pkey" primary key ("id"));');

    this.addSql('alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_fridge_name_foreign" foreign key ("fridge_name") references "fridge" ("name") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_fridge_name_foreign";');

    this.addSql('alter table "product" drop constraint "product_owner_id_foreign";');

    this.addSql('drop table if exists "fridge" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "product" cascade;');
  }

}
