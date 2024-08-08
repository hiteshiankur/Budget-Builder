import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BudgetCategory {
  name: string;
  values: number[];
}

interface Category {
  category: string;
  subcategory: BudgetCategory[];
}

interface ParentCategory {
  parentCategoryName: string;
  parentCategory: Category[];
}

@Component({
  selector: 'app-budget-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})
export class BudgetTableComponent {
  months = ['January 2024', 'February 2024'];
  startMonth: string = '';
  endMonth: string = '';
  budgetData: ParentCategory[] = [
    {
      parentCategoryName: 'Main Income',
      parentCategory: [
        {
          category: 'Income',
          subcategory: [
            { name: 'General Income', values: [100, 120] },
            { name: 'Sales', values: [200, 400] },
            { name: 'Commission', values: [0, 200] },
            // { name: 'sub total', values: [0, 200] }
          ]
        },
        {
          category: 'Other Income',
          subcategory: [
            { name: 'Training', values: [500, 550] },
            { name: 'Consulting', values: [500, 600] },
            // { name: 'sub total', values: [0, 200] }
          ]
        }
      ]
    },
    {
      parentCategoryName: 'expenses',
      parentCategory: [
        {
          category: 'expenseCategories',
          subcategory: [
            { name: 'Operational Expenses', values: [50, 100] },
            { name: 'Management Fees', values: [100, 200] },
            { name: 'Cloud Hosting', values: [200, 400] },
            // { name: 'sub total', values: [0, 200] }
          ]
        },
        {
          category: 'salariesCategories',
          subcategory: [
            { name: 'Full Time Dev Salaries', values: [100, 120] },
            { name: 'Part Time Dev Salaries', values: [80, 80] },
            { name: 'Remote Salaries', values: [20, 0] },
            // { name: 'sub total', values: [0, 200] }
          ]
        }
      ]
    }
  ];

  addMonthsInRange() {
    if (!this.startMonth || !this.endMonth) return;

    const start = new Date(this.startMonth + '-01');
    const end = new Date(this.endMonth + '-01');

    if (start > end) return;

    const newMonths = [];
    while (start <= end) {
      const monthYear = start.toLocaleDateString('default', { month: 'long', year: 'numeric' });
      if (!this.months.includes(monthYear)) {
        newMonths.push(monthYear);
        this.months.push(monthYear);
      }
      start.setMonth(start.getMonth() + 1);
    }

    if (newMonths.length > 0) {
      this.updateBudgetDataForNewMonth(newMonths.length);
    }
  }

  updateBudgetDataForNewMonth(numberOfNewMonths: number) {
    this.budgetData.forEach(parentCategory => {
      parentCategory.parentCategory.forEach(categoryGroup => {
        categoryGroup.subcategory.forEach(subCategory => {
          for (let i = 0; i < numberOfNewMonths; i++) {
            subCategory.values.push(0);
          }
        });
      });
    });
  }


  calculateSubTotal(categories: BudgetCategory[], colIndex: number): number {
    return categories.reduce((total, category) => total + category.values[colIndex], 0);
  }


  handleKeyDown(event: KeyboardEvent, rowIndex: number, colIndex: number, categoryType: string): void {
    // Implement navigation logic
  }

  updateTotals() {}

  addSubCategory(parentCategory: ParentCategory, categoryGroup: Category) {
    const newSubCategory: BudgetCategory = { name: 'New Subcategory', values: Array(this.months.length).fill(0) };
    categoryGroup.subcategory.push(newSubCategory);
    this.updateTotals();
  }

  deleteSubCategory(parentCategory: ParentCategory, categoryGroup: Category, index: number) {
    const subCategories = categoryGroup.subcategory;
    subCategories.splice(index, 1);
    this.updateTotals();
  }

  addCategoryGroup(parentIndex: number) {
    const newCategoryGroup: Category = {
      category: 'New Category Group',
      subcategory: [
        { name: 'New Subcategory', values: Array(this.months.length).fill(0) },
      ]
    };
    this.budgetData[parentIndex].parentCategory.push(newCategoryGroup);
    this.updateTotals();
  }

  deleteCategoryGroup(parentIndex: number, groupIndex: number) {
    const categoryGroups = this.budgetData[parentIndex].parentCategory;
    categoryGroups.splice(groupIndex, 1);
    this.updateTotals();
  }

  getTotalForColumn(parentIndex: number, columnIndex: number): number {
    let total = 0;
    const categoryGroups = this.budgetData[parentIndex].parentCategory;
    categoryGroups.forEach(group => {
      group.subcategory.forEach(sub => {
        if (sub.values[columnIndex] != null) {
          total += sub.values[columnIndex];
        }
      });
    });
    return total;
  }

  calculateProfitLoss(monthIndex: number): number {
    let totalIncome = 0;
    let totalExpenses = 0;
    this.budgetData.forEach(parentCategory => {
      parentCategory.parentCategory.forEach(categoryGroup => {
        categoryGroup.subcategory.forEach(subCategory => {
          const value = subCategory.values[monthIndex];
          if (value != null) {
            if (parentCategory.parentCategoryName === 'Main Income') {
              totalIncome += value;
            } else {
              totalExpenses += value;
            }
          }
        });
      });
    });
    return totalIncome - totalExpenses;
  }

  calculateClosingBalance(monthIndex: number): number {
    let totalIncome = 0;
    let totalExpenses = 0;

    this.budgetData.forEach(parentCategory => {
        parentCategory.parentCategory.forEach(categoryGroup => {
            categoryGroup.subcategory.forEach(subCategory => {
                const value = subCategory.values[monthIndex];
                if (value != null) {
                    if (parentCategory.parentCategoryName === 'Main Income') {
                        totalIncome += value;
                    } else {
                        totalExpenses += value;
                    }
                }
            });
        });
    });

    const closingBalance = totalIncome - totalExpenses;

    if (monthIndex === 0) {
        return closingBalance;
    }

    const previousMonthClosingBalance = this.calculateClosingBalance(monthIndex - 1);

    return previousMonthClosingBalance > 0
        ? closingBalance + previousMonthClosingBalance
        : closingBalance;
}

trackByIndex(index: number, item: any): number {
  return index;
}

}
