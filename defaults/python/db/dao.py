from dataclasses import dataclass
import datetime
import json
import sqlite3
from typing import List, Tuple


from python.db.sqlite_db import SqlLiteDb


@dataclass
class LatestResults:
    date_time: str
    down: int
    up: int
    latency: int
    jitter: int
    network_name: str


@dataclass
class PaginatedResult:
    date_time: str
    down: int
    up: int
    latency: int
    jitter: int
    network_name: str
    aim_scores: str


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

    def fetchPaginatedResults(
        self, start_index: int, amount: int
    ) -> Tuple[List[PaginatedResult], bool]:
        with self._db.transactional() as connection:
            return self._fetchPaginatedResults(start_index, amount, connection)

    def _fetchPaginatedResults(
        self,
        start_index: int,
        amount: int,
        connection: sqlite3.Connection,
    ) -> Tuple[List[PaginatedResult], bool]:
        query = """
            SELECT date_time, down, up, latency, jitter, network_name, aim_scores
            FROM results
            ORDER BY date_time DESC
            LIMIT ? OFFSET ?
        """
        result_tuples = connection.execute(query, (amount, start_index)).fetchall()

        additional_query = """
            SELECT 1
            FROM results
            ORDER BY date_time DESC
            LIMIT 1 OFFSET ?
        """
        additional_rows = connection.execute(
            additional_query, (start_index + amount,)
        ).fetchall()
        has_more = len(additional_rows) > 0

        results = [
            {
                "date_time": row[0],
                "down": row[1],
                "up": row[2],
                "latency": row[3],
                "jitter": row[4],
                "network_name": row[5],
                "aim_scores": json.loads(row[6]),
            }
            for row in result_tuples
        ]
        return results, has_more
