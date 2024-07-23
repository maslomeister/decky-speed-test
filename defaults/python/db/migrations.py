# credits to https://github.com/ma3a/SDH-PlayTime

from dataclasses import dataclass
from typing import List
from python.db.sqlite_db import SqlLiteDb


@dataclass
class Migration:
    version: int
    statements: List[str]


_migrations = [
    Migration(
        1,
        [
            """
        CREATE TABLE results(
            date_time TEXT,
            down INT,
            up INT,
            latency INT,
            jitter INT,
            network_name TEXT,
            aim_scores BLOB
        )
        """,
        ],
    ),
    Migration(
        2,
        [
            """
        CREATE INDEX results_date_time_epoch_idx
            ON results(UNIXEPOCH(date_time))
        """,
        ],
    ),
    Migration(3, ["ALTER TABLE results ADD COLUMN migrated TEXT"]),
]


class DbMigration:
    def __init__(self, db: SqlLiteDb):
        self.db = db

    def _current_migration_version(self):
        with self.db.transactional() as con:
            con.execute("CREATE TABLE IF NOT EXISTS migration (id INT PRIMARY KEY);")
            return con.execute(
                "SELECT coalesce(max(id), 0) as max_id FROM migration"
            ).fetchone()[0]

    def _migration(self, migration: Migration):
        version = self._current_migration_version()
        latest_version_in_migration = max(_migrations, key=lambda m: m.version).version

        if latest_version_in_migration < version:
            raise Exception(
                "Database have been updated with latest version. Please update plugin"
            )

        if migration.version > version:
            with self.db.transactional() as con:
                for stm in migration.statements:
                    con.execute(stm)
                con.execute(
                    "INSERT INTO migration (id) VALUES (?)", [migration.version]
                )

    def migrate(self):
        for migration in _migrations:
            self._migration(migration)
