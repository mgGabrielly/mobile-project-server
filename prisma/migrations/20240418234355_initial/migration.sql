-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "matriculation" TEXT NOT NULL,
    "class" TEXT,
    "telephone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passwordResetToken" TEXT NOT NULL DEFAULT 'a',
    "passwordResetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "idStudent" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "activityGroup" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "workload" INTEGER NOT NULL,
    "activityPeriod" TEXT NOT NULL,
    "placeOfCourse" TEXT NOT NULL,
    "certificate" TEXT NOT NULL,
    "evaluation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupsOfActivities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groupsOfActivities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typesOfActivities" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "activityGroup" TEXT NOT NULL,
    "courseWorkload" INTEGER NOT NULL,
    "semesterWorkload" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typesOfActivities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "groupsOfActivities_name_key" ON "groupsOfActivities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typesOfActivities_description_key" ON "typesOfActivities"("description");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_idStudent_fkey" FOREIGN KEY ("idStudent") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typesOfActivities" ADD CONSTRAINT "typesOfActivities_activityGroup_fkey" FOREIGN KEY ("activityGroup") REFERENCES "groupsOfActivities"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
