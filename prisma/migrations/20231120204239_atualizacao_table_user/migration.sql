-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "matriculation" TEXT NOT NULL,
    "class" TEXT,
    "telephone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "passwordResetToken" TEXT NOT NULL DEFAULT 'a',
    "passwordResetAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("class", "createdAt", "email", "id", "matriculation", "name", "password", "passwordResetAt", "passwordResetToken", "status", "telephone", "updatedAt", "userType") SELECT "class", "createdAt", "email", "id", "matriculation", "name", "password", "passwordResetAt", "passwordResetToken", "status", "telephone", "updatedAt", "userType" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
