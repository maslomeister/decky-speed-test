from dataclasses import dataclass
import datetime
import sqlite3


from python.db.sqlite_db import SqlLiteDb


@dataclass
class LatestResults:
    date_time: str
    down: int
    up: int
    latency: int
    jitter: int
    network_name: str


class Dao:
    def __init__(self, db: SqlLiteDb):
        self._db = db

    def save_results(
        self,
        date_time: datetime.datetime,
        down: int,
        up: int,
        latency: int,
        jitter: int,
        network_name: str,
        aim_scores: str,
        source: str = None,
    ) -> None:
        with self._db.transactional() as connection:
            self._save_results(
                connection,
                date_time,
                down,
                up,
                latency,
                jitter,
                network_name,
                aim_scores,
                source,
            )

    def _save_results(
        self,
        connection: sqlite3.Connection,
        date_time: datetime.datetime,
        down: int,
        up: int,
        latency: int,
        jitter: int,
        network_name: str,
        aim_scores: str,
        source: str = None,
    ):
        connection.execute(
            """
                INSERT INTO results (date_time, down, up, latency, jitter, network_name, aim_scores, migrated)
                VALUES(:date_time,:down,:up,:latency,:jitter,:network_name,:aim_scores,:source)
                """,
            {
                "date_time": date_time.isoformat(),
                "down": down,
                "up": up,
                "latency": latency,
                "jitter": jitter,
                "network_name": network_name,
                "aim_scores": aim_scores,
                "source": source,
            },
        )

    def fetchLatestResults(self) -> LatestResults:
        with self._db.transactional() as connection:
            return self._fetchLatestResults(connection)

    def _fetchLatestResults(
        self,
        connection: sqlite3.Connection,
    ) -> LatestResults | None:
        result = connection.execute(
            """
                SELECT date_time, down, up, latency, jitter, network_name
                FROM  results ORDER BY date_time DESC LIMIT 1
            """
        ).fetchone()

        return result
