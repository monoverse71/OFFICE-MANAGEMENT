export function validateExpense(values) {
  const errors = {}

  if (!values.title || !values.title.trim()) {
    errors.title = 'Please enter a title for this expense.'
  }

  if (!values.category) {
    errors.category = 'Please select a category.'
  }

  const amount = Number(values.amount)
  if (values.amount === '' || values.amount === null || Number.isNaN(amount)) {
    errors.amount = 'Please enter an amount.'
  } else if (amount <= 0) {
    errors.amount = 'Amount must be greater than zero.'
  }

  if (!values.expense_date) {
    errors.expense_date = 'Please select an expense date.'
  } else {
    const today = new Date().toISOString().slice(0, 10)
    if (values.expense_date > today) {
      errors.expense_date = 'Expense date cannot be in the future.'
    }
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
