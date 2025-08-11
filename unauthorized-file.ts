// This file is deliberately placed in the wrong location to test governance enforcement
// It should fail the path check and be moved to tools/ or cli/

export function unauthorizedFunction() {
  console.log("This function should not exist in the root directory");
  return "violation";
}
