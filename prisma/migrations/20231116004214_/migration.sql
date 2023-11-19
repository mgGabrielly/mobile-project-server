/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `typesOfActivities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "typesOfActivities_description_key" ON "typesOfActivities"("description");
