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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "activities_idStudent_fkey" FOREIGN KEY ("idStudent") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_activities" ("activityGroup", "activityPeriod", "activityType", "certificate", "createdAt", "evaluation", "id", "idStudent", "name", "placeOfCourse", "updatedAt", "workload") SELECT "activityGroup", "activityPeriod", "activityType", "certificate", "createdAt", "evaluation", "id", "idStudent", "name", "placeOfCourse", "updatedAt", "workload" FROM "activities";
DROP TABLE "activities";
ALTER TABLE "new_activities" RENAME TO "activities";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
