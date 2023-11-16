-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_typesOfActivities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "activityGroup" TEXT NOT NULL,
    "courseWorkload" INTEGER NOT NULL,
    "semesterWorkload" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "typesOfActivities_activityGroup_fkey" FOREIGN KEY ("activityGroup") REFERENCES "groupsOfActivities" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_typesOfActivities" ("activityGroup", "courseWorkload", "createdAt", "description", "id", "semesterWorkload", "status", "updatedAt") SELECT "activityGroup", "courseWorkload", "createdAt", "description", "id", "semesterWorkload", "status", "updatedAt" FROM "typesOfActivities";
DROP TABLE "typesOfActivities";
ALTER TABLE "new_typesOfActivities" RENAME TO "typesOfActivities";
CREATE UNIQUE INDEX "typesOfActivities_description_key" ON "typesOfActivities"("description");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
