export function insertVariables(pattern: string, variables: Map<string, string>) {
  return pattern.replace(
    /\{\{([^{}]+)\}\}/g,
    (_all, group1) => {
      const value = variables.get(group1);
      if (value === undefined) {
        throw new Error(`Unknown variable name: ${group1} in ${Array.from(variables.keys())}`);
      }
      return value;
    }
  )
}
