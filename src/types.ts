/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BudgetData {
  monthlyIncome: number;
  rent: number;
  groceries: number;
  utilities: number;
  debtEmi: number;
  wants: number; // Entertainment, shopping, travel
  existingInvestment: number;
}

export interface DebtItem {
  id: string;
  name: string;
  amount: number;
  interestRate: number; // Annualized e.g. 36% for Credit Cards
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface DataPoint {
  year: number;
  deposits: number;
  bankSavings: number;
  inflationAdjustedSavings: number;
  investments: number;
}
