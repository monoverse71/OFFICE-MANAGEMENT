export function validateCompanySettings(values) {
  const errors = {}

  if (!values.name || !values.name.trim()) {
    errors.name = 'Company name is required.'
  }

  if (values.email && values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.website && values.website.trim() && !/^https?:\/\/.+\..+/.test(values.website.trim())) {
    errors.website = 'Enter a full URL, e.g. https://example.com'
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
