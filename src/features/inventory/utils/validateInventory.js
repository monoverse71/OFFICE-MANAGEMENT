export function validateInventoryItem(values) {
  const errors = {}

  if (!values.name || !values.name.trim()) {
    errors.name = 'Please enter the item name.'
  }

  if (!values.category) {
    errors.category = 'Please select a category.'
  }

  if (!values.type) {
    errors.type = 'Please select a type.'
  }

  if (!values.unit) {
    errors.unit = 'Please select a unit.'
  }

  const qty = Number(values.opening_quantity)
  if (values.opening_quantity === '' || Number.isNaN(qty) || qty < 0) {
    errors.opening_quantity = 'Enter a valid opening quantity (0 or more).'
  }

  if (!values.location || !values.location.trim()) {
    errors.location = 'Please enter a store location.'
  }

  if (!values.purchase_date) {
    errors.purchase_date = 'Please select a purchase date.'
  }

  return errors
}

export function validateStockAction(mode, value, currentQuantity) {
  const errors = {}
  const num = Number(value)

  if (value === '' || Number.isNaN(num)) {
    errors.value = 'Enter a valid quantity.'
    return errors
  }

  if (mode === 'adjust') {
    if (num < 0) errors.value = 'Quantity cannot be negative.'
    return errors
  }

  if (num <= 0) {
    errors.value = 'Enter a quantity greater than zero.'
    return errors
  }

  if (mode === 'remove' && num > currentQuantity) {
    errors.value = `Cannot remove more than the current quantity (${currentQuantity}).`
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
