function isValidName(name: string): boolean {
  const regex = /^[a-zA-Z\s]+$/;

  return regex.test(name) && name.trim().length > 0;
}

export { isValidName };
