<?php

/**
 * PostgreSQL DatabaseInstaller.
 */
class DatabaseInstaller {

  // PDO handle
  protected $dbh = null;
  // PDO url
  protected $url;
  // PDO user
  protected $user;
  // PDO password
  protected $pass;

  /**
   * Constructor
   */
  public function __construct ($dsn, $user, $pass, $schema) {
    $this->dsn = $dsn;
    $this->user = $user;
    $this->pass = $pass;
    $this->schema = $schema;
    // get dbname
    preg_match('/dbname=([^;]+)/', $dsn, $matches);
    if (count($matches) < 2) {
      throw new Exception('"dbname" is required in a postgress connection url');
    }
    $this->dbname = $matches[1];
  }

  /**
   * Connect to the database.
   *
   * @return {PDO} PDO connection with exception mode.
   */
  public function connect () {
    if ($this->dbh === null) {
      $this->dbh = new PDO($this->dsn, $this->user, $this->pass);
      $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $this->dbh->beginTransaction();
    }
    return $this->dbh;
  }

  /**
   * commits all commands executed during the current database transaction
   */
  public function commit () {
    $this->dbh->commit();
  }

  /**
   * rolls back all commands executed during the current database transaction
   */
  public function rollBack () {
    $this->dbh->rollBack();
  }

  /**
   * Disconnect from database.
   */
  public function disconnect () {
    $this->dbh = null;
  }

  /**
   * Run one or more sql statements.
   *
   * Removes c-style comments before execution.
   *
   * @param $statements {String}
   *        semi-colon delimited list of statements to execute.
   */
  public function run ($statements) {
    // make sure connected
    $this->connect();

    // Remove /* */ comments
    $statements = preg_replace('#/\*.*\*/#', '', $statements);
    // split on semicolons that are outside of single quotes
    // http://stackoverflow.com/questions/21105360/regex-find-comma-not-inside-quotes
    $statements = preg_split("/(?!\B'[^']*);(?![^']*'\B)/", $statements);

    foreach ($statements as $sql) {
      $sql = trim($sql);
      if ($sql !== '') {
        try {
          $this->dbh->exec($sql);
        } catch (Exception $e) {
          echo 'SQL Exception: ' . $e->getMessage() . PHP_EOL .
              'While running:' . PHP_EOL . $sql . PHP_EOL;
          throw $e;
        }
      }
    }
  }

  /**
   * Run sql statements from a file.
   *
   * Same as $this->run(file_get_contents($file)).
   *
   * @param $file {String}
   *        path to sql script.
   */
  public function runScript ($file) {
    $this->run(file_get_contents($file));
  }


  /**
   * Check if database exists.
   *
   * @return {Boolean} true if able to connect to database, false otherwise.
   */
  public function databaseExists () {
    try {
      $this->connect();
      $this->dbh = null;
      return true;
    } catch (PDOException $e) {
      return false;
    }
  }

  /**
   * Create $schema if it doesn't already exist.
   */
  public function createSchema ($schema) {
    if (!$this->schemaExists($schema)) {
      $this->run('CREATE SCHEMA ' . $this->schema);
      $this->run('SET search_path = ' . $this->schema . ', public');
    }
  }

  /**
   * Drop the $schema if it already exist.
   */
  public function dropSchema ($schema) {
    if ($this->schemaExists($schema)) {
      $this->run('DROP SCHEMA ' . $this->schema . ' CASCADE');
    }
  }

  /**
   * Disable postgis extension
   */
  public function disablePostgis () {
    $this->run('DROP EXTENSION IF EXISTS postgis');
  }

  /**
   * Enable postgis extension
   */
  public function enablePostgis () {
    $this->run('CREATE EXTENSION IF NOT EXISTS postgis');
  }

  /**
   * Drop $user with roles
   */
  public function dropUser ($roles, $user) {
    if ($this->userExists($user)) {
      $this->run('REVOKE USAGE ON SCHEMA ' . $this->schema .' FROM ' . $user);
      $this->run('REVOKE GRANT OPTION FOR ' . implode(',', $roles) .
          ' ON ALL TABLES IN SCHEMA ' . $this->schema .' FROM ' . $user);
      $this->run('REVOKE ALL PRIVILEGES ON DATABASE ' . $this->dbname .
          ' FROM ' . $user);
      $this->run('DROP USER IF EXISTS ' . $user);
    }
  }

  /**
   * Create user.
   */
  public function createUser ($user, $password) {
    if ($this->userExists($user)) {
      throw new Exception('ERROR: The \'' . $user . '\' user already exists.');
      return;
    }
    // create read only user
    $this->run('CREATE USER ' . $user . ' WITH PASSWORD \'' .
        $password . '\'');
  }

  /**
   * Grant usage and roles to a user.
   */
  public function grantUsage($roles, $user) {
    $this->run('GRANT USAGE ON SCHEMA ' . $this->schema .' TO ' . $user);
    $this->run('GRANT ' . implode(',', $roles) .
        ' ON ALL TABLES IN SCHEMA ' . $this->schema .' TO ' . $user);
  }

  /**
   * Checks if $user exists
   */
  public function userExists ($user) {
    $db = $this->connectWithoutDbname();
    $sql = 'SELECT usename FROM pg_catalog.pg_user WHERE usename = \'' .
        $user . '\'';
    $result = $db->query($sql)->fetchColumn();
    $db = null;

    if ($result === false) {
      return false;
    }

    // $user exists
    return true;
  }

  /**
   * Checks if $schema exists
   */
  public function schemaExists ($schema) {
    $dbh = $this->connect();
    $sql = 'SELECT schema_name FROM information_schema.schemata WHERE ' .
        'schema_name = \'' . $schema . '\'';
    $results = $dbh->query($sql);
    $result = $results->fetch();
    $dbh = null;

    // $schema exists
    if ($result[0] === $schema) {
      return true;
    }

    return false;
  }

  /**
   * Connect to the mysql server without specifying a database name.
   * Used by dropDatabase() and createDatabase().
   */
  protected function connectWithoutDbname() {
    $db = new PDO(str_replace('dbname=' . $this->dbname, 'dbname=postgres',
        $this->dsn), $this->user, $this->pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $db;
  }

}
