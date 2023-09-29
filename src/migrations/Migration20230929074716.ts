import { Migration } from '@mikro-orm/migrations';

export class Migration20230929074716 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "fridge" ("name" varchar(255) not null, "location" varchar(255) not null, "capacity" int not null, constraint "fridge_pkey" primary key ("name"));');

    this.addSql('create table "user" ("id" uuid not null, "email" varchar(255) not null, "name" varchar(255) not null, "password" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "recipe" ("name" varchar(255) not null, "description" varchar(255) not null, "ingredients" jsonb not null, "owner_id" uuid not null, constraint "recipe_pkey" primary key ("name"));');

    this.addSql('create table "product" ("id" uuid not null, "name" varchar(255) not null, "size" int not null, "owner_id" uuid null, constraint "product_pkey" primary key ("id"));');

    this.addSql('create table "fridge_contents" ("fridge_name" varchar(255) not null, "product_id" uuid not null, constraint "fridge_contents_pkey" primary key ("fridge_name", "product_id"));');

    this.addSql('alter table "recipe" add constraint "recipe_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "fridge_contents" add constraint "fridge_contents_fridge_name_foreign" foreign key ("fridge_name") references "fridge" ("name") on update cascade on delete cascade;');
    this.addSql('alter table "fridge_contents" add constraint "fridge_contents_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "fridge_contents" drop constraint "fridge_contents_fridge_name_foreign";');

    this.addSql('alter table "recipe" drop constraint "recipe_owner_id_foreign";');

    this.addSql('alter table "product" drop constraint "product_owner_id_foreign";');

    this.addSql('alter table "fridge_contents" drop constraint "fridge_contents_product_id_foreign";');

    this.addSql('drop table if exists "fridge" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "recipe" cascade;');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "fridge_contents" cascade;');
  }

}
