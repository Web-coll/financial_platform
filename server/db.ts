import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  financialProfiles,
  budgetAllocations,
  financialPlans,
  investmentGoals,
  chatConversations,
  InsertFinancialProfile,
  InsertBudgetAllocation,
  InsertFinancialPlan,
  InsertInvestmentGoal,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Financial profile queries
export async function getOrCreateFinancialProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db
    .select()
    .from(financialProfiles)
    .where(eq(financialProfiles.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Return undefined if no profile exists (user hasn't completed onboarding)
  return undefined;
}

export async function createFinancialProfile(
  userId: number,
  data: Omit<InsertFinancialProfile, 'userId'>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(financialProfiles).values({
    ...data,
    userId,
  });

  return result;
}

export async function updateFinancialProfile(
  userId: number,
  data: Partial<Omit<InsertFinancialProfile, 'userId'>>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(financialProfiles)
    .set(data)
    .where(eq(financialProfiles.userId, userId));
}

// Budget allocation queries
export async function getOrCreateBudgetAllocation(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db
    .select()
    .from(budgetAllocations)
    .where(eq(budgetAllocations.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  return undefined;
}

export async function createBudgetAllocation(
  userId: number,
  data: Omit<InsertBudgetAllocation, 'userId'>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(budgetAllocations).values({
    ...data,
    userId,
  });

  return result;
}

// Financial plan queries
export async function getLatestFinancialPlan(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(financialPlans)
    .where(eq(financialPlans.userId, userId))
    .orderBy((t) => t.createdAt)
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createFinancialPlan(
  userId: number,
  data: Omit<InsertFinancialPlan, 'userId'>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(financialPlans).values({
    ...data,
    userId,
  });

  return result;
}

// Investment goals queries
export async function getInvestmentGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(investmentGoals)
    .where(eq(investmentGoals.userId, userId));
}

export async function createInvestmentGoal(
  userId: number,
  data: Omit<InsertInvestmentGoal, 'userId'>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(investmentGoals).values({
    ...data,
    userId,
  });

  return result;
}

// Chat conversation queries
export async function getChatConversation(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateChatConversation(
  userId: number,
  messages: unknown[]
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getChatConversation(userId);

  if (existing) {
    await db
      .update(chatConversations)
      .set({ messages: JSON.stringify(messages) })
      .where(eq(chatConversations.userId, userId));
  } else {
    await db.insert(chatConversations).values({
      userId,
      messages: JSON.stringify(messages),
    });
  }
}
