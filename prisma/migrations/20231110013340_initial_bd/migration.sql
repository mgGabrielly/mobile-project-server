-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "matriculation" TEXT,
    "class" TEXT,
    "telephone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "passwordResetToken" TEXT NOT NULL DEFAULT 'a',
    "passwordResetAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "activities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idStudent" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "activityGroup" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "workload" INTEGER NOT NULL,
    "activityPeriod" TEXT NOT NULL,
    "placeOfCourse" TEXT NOT NULL,
    "certificate" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "groupsOfActivities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "typesOfActivities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "activityGroup" TEXT NOT NULL,
    "courseWorkload" INTEGER NOT NULL,
    "semesterWorkload" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "activities_idStudent_key" ON "activities"("idStudent");
