## To create mongodb dump file

```bash
mongodump --db=<db_name> --archive=<file_name>.gz --gzip
```

Example:

```bash
mongodump --db=sample_mflix --archive=dumptest.gz --gzip
```

above command will create a dump file named `dumptest.gz` for the database `sample_mflix` in the current directory.

## To restore from mongodb dump file

```bash
mongorestore --archive=<file_name>.gz --gzip
```

```bash
mongorestore --archive=dumptest.gz --gzip
```

above command will restore the database from the dump file `dumptest.gz` in the current directory.
