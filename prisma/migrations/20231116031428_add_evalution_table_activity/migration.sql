/*
  Warnings:

  - Added the required column `evaluation` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idStudent" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "activityGroup" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "workload" INTEGER NOT NULL,
    "activityPeriod" TEXT NOT NULL,
    "placeOfCourse" TEXT NOT NULL,
    "certificate" TEXT NOT NULL,
    "evaluation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_activities" ("activityGroup", "activityPeriod", "activityType", "certificate", "id", "idStudent", "name", "placeOfCourse", "workload") SELECT "activityGroup", "activityPeriod", "activityType", "certificate", "id", "idStudent", "name", "placeOfCourse", "workload" FROM "activities";
DROP TABLE "activities";
ALTER TABLE "new_activities" RENAME TO "activities";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
