"use client";

import { useState } from "react";
import "../styles/home.css";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import MonthlyExpensesChart from "../../components/MonthlyExpensesChart";
import CategoryPieChart from "../../components/CategoryPieChart";
import BudgetForm from "../../components/BudgetForm";
import BudgetChart from "../../components/BudgetChart";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <main className="main_container">
      <div className="dashboard_layout">
        {/* 🌟 Sidebar Navigation */}
        <nav className="sidebar">
          <h2 className="sidebar_heading">📊 Finance App</h2>
          <ul className="sidebar_menu">
            <li onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>
              📈 Dashboard
            </li>
            <li onClick={() => setActiveTab("addTransaction")} className={activeTab === "addTransaction" ? "active" : ""}>
              ➕ Add Transaction
            </li>
            <li onClick={() => setActiveTab("budget")} className={activeTab === "budget" ? "active" : ""}>
              🎯 Set Monthly Budget
            </li>
          </ul>
        </nav>

        {/* 🏆 Main Content */}
        <div className="content_area">
          {activeTab === "dashboard" && (
            <div className="dashboard_content">
              <MonthlyExpensesChart />
              <CategoryPieChart />
              <TransactionList />
            </div>
          )}

          {activeTab === "addTransaction" && (
            <div className="transaction_content">
              <TransactionForm />
              <TransactionList />
            </div>
          )}

          {activeTab === "budget" && (
            <div className="budget_content">
              <BudgetForm />
              <BudgetChart />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
