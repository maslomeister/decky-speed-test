# credits to https://github.com/ma3a/SDH-PlayTime

import datetime
import subprocess
import time
import asyncio
import os
import sys
import traceback


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))


cwd = os.getcwd()

from python.db.migrations import DbMigration
from python.db.sqlite_db import SqlLiteDb
from python.db.dao import Dao

print(cwd)


def format_exception(e):
    exception_list = traceback.format_stack()
    exception_list = exception_list[:-2]
    exception_list.extend(traceback.format_tb(sys.exc_info()[2]))
    exception_list.extend(
        traceback.format_exception_only(sys.exc_info()[0], sys.exc_info()[1])
    )

    exception_str = "Traceback (most recent call last):\n"
    exception_str += "".join(exception_list)
    # Removing the last \n
    exception_str = exception_str[:-1]

    return exception_str


class Plugin:
    dao = None

    async def _main(self):
        try:
            db = SqlLiteDb("./speed-test.db")
            migration = DbMigration(db)
            migration.migrate()

            dao = Dao(db)
            self.dao = dao

        except Exception as e:
            print(f"Unhandled exception: {e}")

    async def save_results(
        self,
        down: int,
        up: int,
        latency: int,
        jitter: int,
        aim_scores: str,
    ):
        try:
            curr_time = datetime.datetime.fromtimestamp(time.time())
            print("Saving: ", [curr_time, down, up, latency, jitter])

            self.dao.save_results(
                curr_time, down, up, latency, jitter, "hh", aim_scores
            )

            return [curr_time, down, up, latency, "hh", aim_scores]
        except Exception as e:
            print(format_exception(e))
            return e

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
                    "msg": "true",
                }
            return {"msg": "false"}
        except Exception as e:
            print(format_exception(e))
            return e


if __name__ == "__main__":
    plugin = Plugin()
    asyncio.run(plugin._main())
    # asyncio.run(plugin.save_results(10, 20, 10, 10, "test"))
    asyncio.run(plugin.fetch_latest_result())
