import { Migration } from '@mikro-orm/migrations';

export class Migration20231002101315 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "fridge" ("name" varchar(255) not null, "location" varchar(255) not null, "capacity" int not null, constraint "fridge_pkey" primary key ("name"));');

    this.addSql('create table "product" ("id" uuid not null, "name" varchar(255) not null, "size" int not null, constraint "product_pkey" primary key ("id"));');
    this.addSql('alter table "product" add constraint "product_name_unique" unique ("name");');

    this.addSql('create table "user" ("id" uuid not null, "email" varchar(255) not null, "name" varchar(255) not null, "role" varchar(255) not null default \'user\', "password" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "recipe" ("name" varchar(255) not null, "description" varchar(255) not null, "ingredients" jsonb not null, "owner_id" uuid not null, constraint "recipe_pkey" primary key ("name"));');

    this.addSql('create table "product_quantity" ("id" serial primary key, "owner_id" uuid null, "location_name" varchar(255) null, "product_id" uuid null, "quantity" int not null default 0);');

    this.addSql('alter table "recipe" add constraint "recipe_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "product_quantity" add constraint "product_quantity_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "product_quantity" add constraint "product_quantity_location_name_foreign" foreign key ("location_name") references "fridge" ("name") on update cascade on delete set null;');
    this.addSql('alter table "product_quantity" add constraint "product_quantity_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_quantity" drop constraint "product_quantity_location_name_foreign";');

    this.addSql('alter table "product_quantity" drop constraint "product_quantity_product_id_foreign";');

    this.addSql('alter table "recipe" drop constraint "recipe_owner_id_foreign";');

    this.addSql('alter table "product_quantity" drop constraint "product_quantity_owner_id_foreign";');

    this.addSql('drop table if exists "fridge" cascade;');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "recipe" cascade;');

    this.addSql('drop table if exists "product_quantity" cascade;');
  }

}
