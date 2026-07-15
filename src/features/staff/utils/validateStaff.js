export function validateStaff(values) {
  const errors = {}

  if (!values.full_name || !values.full_name.trim()) {
    errors.full_name = 'Please enter the employee\u2019s full name.'
  }

  if (!values.mobile_number || !values.mobile_number.trim()) {
    errors.mobile_number = 'Please enter a mobile number.'
  }

  if (!values.designation || !values.designation.trim()) {
    errors.designation = 'Please enter a designation.'
  }

  if (!values.department || !values.department.trim()) {
    errors.department = 'Please enter a department.'
  }

  if (!values.joining_date) {
    errors.joining_date = 'Please select a joining date.'
  }

  if (values.email && values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
