earthquake-usdesign
==============

![Travis Build Status](https://api.travis-ci.org/usgs/earthquake-usdesign.svg)

Web application for computing seismic design values conforming to various design codes in the United States.

[License](License.md)

### Dependencies
There are multiple dependencies that must be installed for this project:

1. PHP
1. PostgreSQL


#### Install PHP
```bash
$ brew install php56 --with-pdo-pgsql
```

#### Install PostgreSQL
This will take you through the process of installing, starting, and creating a
PostgreSQL database locally.

1. Install

  ```bash
  $ brew install postgresql
  ```
  After running `brew install postgresql`, the terminal will output directions
  that you will use to get your installation up and running.

1. Create/Upgrade a Database

  If this is your first install, create a database with:
  ```bash
  $ initdb \
    --auth=md5 \
    --auth-host=md5 \
    --auth-local=md5 \
    --pgdata=<db_directory> \
    --encoding=UTF8 \
    --locale=en_US.UTF-8 \
    --username=<db_admin_username>
    --pwprompt
  ```
  You will need to replace the `<db_directory>` and `<db_admin_username>` with
  actual values that make sense for your environment. The `<db_directory>` is
  a fully-qualified path name to a directory. This directory is where data
  files for the database installation will be located. The
  `<db_admin_username>` is the name of the administrator for the database
  installation. This command will prompt you to enter a password for the
  `<db_admin_username>`.

  > Note: We suggest defining a `.data` directory at the root level of this
  > application for the `<db_directory>`.

1. Start/Stop PostgreSQL

  After running the `initdb` command, you should see a success message. Use the
  `pg_ctl` utility to start the database.

  ```bash
  $ pg_ctl -D <db_directory> start
  ```

  You will need to replace the `<db_directory>` with the same value you used
  when running the `initdb` command (above). Alternatively, you can set the
  `PGDATA` environment variable to this value and you will not need to specify
  the `-D <db_directory>` flag.

1. Login

  Login to the default `postgres` database with the user that created the
  database.

  ```bash
  $ psql postgres
  ```

  > Note: PostgreSQL will create the default database `postgres`, which  you
  > can access with the same user that you used to create the database.

1. Database

  The install process is assuming that an 'earthquake' database already exists.

  ```
  CREATE DATABASE earthquake;
  ```
