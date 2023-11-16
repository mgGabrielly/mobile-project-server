/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `groupsOfActivities` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "activities_idStudent_key";

-- CreateIndex
CREATE UNIQUE INDEX "groupsOfActivities_name_key" ON "groupsOfActivities"("name");
