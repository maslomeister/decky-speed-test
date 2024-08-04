# credits to https://github.com/ma3a/SDH-PlayTime

import datetime
import time
import subprocess
import logging
import os
import sys
from pathlib import Path


decky_home = os.environ["DECKY_HOME"]
log_dir = os.environ["DECKY_PLUGIN_LOG_DIR"]
data_dir = os.environ["DECKY_PLUGIN_RUNTIME_DIR"]
plugin_dir = Path(os.environ["DECKY_PLUGIN_DIR"])


logging.basicConfig(
    filename=f"{log_dir}/speed-test.log",
    format="[Speed Test] %(asctime)s %(levelname)s %(message)s",
    filemode="w+",
    force=True,
)
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def add_plugin_to_path():
    directories = [["./"], ["python"]]
    for import_dir in directories:
        sys.path.append(str(plugin_dir.joinpath(*import_dir)))


add_plugin_to_path()


from python.db.migrations import DbMigration
from python.db.sqlite_db import SqlLiteDb
from python.db.dao import Dao


class Plugin:
    dao = None

    async def _main(self):
        try:
            db = SqlLiteDb(f"{data_dir}/speed-test.db")
            migration = DbMigration(db)
            migration.migrate()

            dao = Dao(db)
            self.dao = dao

        except Exception as e:
            logger.exception(f"Unhandled exception: {e}")

    async def save_results(
        self,
        down: int,
        up: int,
        latency: int,
        jitter: int,
        aim_scores: str,
    ):
        try:
            result = subprocess.check_output(
                ["iwgetid", "-r"], stderr=subprocess.STDOUT
            )

            network_name = result.decode("utf-8").strip()

            curr_time = datetime.datetime.fromtimestamp(time.time())

            self.dao.save_results(
                curr_time, down, up, latency, jitter, network_name, aim_scores
            )

            return {
                "date_time": curr_time.isoformat(),
                "down": down,
                "up": up,
                "latency": latency,
                "network_name": network_name,
            }

        except Exception as e:
            logger.exception(f"Unhandled exception: {e}")
            return e

    # async def test_save(
    #     self,
    #     down: int,
    #     up: int,
    #     latency: int,
    #     jitter: int,
    #     aim_scores: str,
    # ):
    #     try:
    #         grep_pattern = '(?<=ESSID:")[^"]*'
    #         network_name = os.system(f"iwconfig wlan0 | grep -oP '{grep_pattern}'")

    #         return network_name
    #     except Exception as e:
    #         logger.exception(f"Unhandled exception: {e}")
    #         return False

    async def fetch_latest_result(self):
        try:
            results = self.dao.fetchLatestResults()
            if results:
                return {
                    "data": {
                        "date_time": results[0],
                        "down": results[1],
                        "up": results[2],
                        "latency": results[3],
                        "jitter": results[4],
                        "network_name": results[5],
                    },
                    "msg": True,
                }
            return {"data": {}, "msg": False}

        except Exception as e:
            logger.exception(f"Unhandled exception: {e}")
            return e

    async def fetch_paginated_results(self, start_index: int, amount: int):
        try:
            results = self.dao.fetchPaginatedResults(start_index, amount)

            return {"data": results[0], "has_more": results[1]}
        except Exception as e:
            logger.exception(f"Unhandled exception: {e}")
            return e
