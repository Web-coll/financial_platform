CREATE TABLE `budget_allocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`financialProfileId` int NOT NULL,
	`fixedExpensesPercentage` decimal(5,2) NOT NULL,
	`fixedExpensesAmount` decimal(12,2) NOT NULL,
	`variableExpensesPercentage` decimal(5,2) NOT NULL,
	`variableExpensesAmount` decimal(12,2) NOT NULL,
	`savingsPercentage` decimal(5,2) NOT NULL,
	`savingsAmount` decimal(12,2) NOT NULL,
	`investmentPercentage` decimal(5,2) NOT NULL,
	`investmentAmount` decimal(12,2) NOT NULL,
	`debtPaymentPercentage` decimal(5,2) NOT NULL,
	`debtPaymentAmount` decimal(12,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budget_allocations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`messages` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`financialProfileId` int NOT NULL,
	`currentSituation` text NOT NULL,
	`problemsIdentified` text NOT NULL,
	`recommendations` text NOT NULL,
	`actionPlan` text NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`monthlyIncome` decimal(12,2) NOT NULL,
	`incomeType` enum('fixed','variable') NOT NULL,
	`hasFixedExpenses` int NOT NULL,
	`fixedExpensesAmount` decimal(12,2),
	`hasDebts` int NOT NULL,
	`totalDebts` decimal(12,2),
	`currentSavings` decimal(12,2),
	`riskProfile` enum('conservative','moderate','aggressive') DEFAULT 'moderate',
	`investmentExperience` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
	`completedOnboarding` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investment_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`goalName` varchar(255) NOT NULL,
	`targetAmount` decimal(12,2) NOT NULL,
	`timelineYears` int NOT NULL,
	`monthlyInvestment` decimal(12,2) NOT NULL,
	`expectedAnnualReturn` decimal(5,2) DEFAULT '7.00',
	`currentAmount` decimal(12,2) DEFAULT '0',
	`status` enum('active','completed','paused') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investment_goals_id` PRIMARY KEY(`id`)
);
