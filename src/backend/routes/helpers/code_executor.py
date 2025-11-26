import sys
from io import StringIO
import traceback

def execute_code(code, test_cases, function_name=None):

    results = []
    namespace = {} #probably want to isolate each execution a bit more, also security risks

    #try to execute the student's code once to catch syntax errors
    try:
        exec(code, namespace)
    except Exception:
        return {
            "success": False,
            "error": "Error executing student code",
            "details": traceback.format_exc(),
            "results": []
        }

    # running each test case
    for i, test in enumerate(test_cases):
        try:
            old_stdout = sys.stdout
            sys.stdout = StringIO()

            # -----------------------------------------
            # RETURN-VALUE TEST (for functions)
            # -----------------------------------------
            if "expected" in test:
                if function_name is None:
                    raise Exception("function_name not provided for return-value tests")

                if function_name not in namespace:
                    raise Exception(f"Function '{function_name}' not found in submitted code")

                func = namespace[function_name]
                got = func(*test.get("input", []))
                expected = test["expected"]
                passed = (got == expected)

            # -----------------------------------------
            # PRINT OUTPUT TEST (for scripts)
            # -----------------------------------------
            else:
                exec(code, namespace)
                got = sys.stdout.getvalue()
                expected = test["expected_output"]
                passed = (got == expected)

            sys.stdout = old_stdout

            results.append({
                "test_number": i + 1,
                "passed": passed,
                "expected": expected,
                "got": got
            })

        except Exception as e:
            sys.stdout = old_stdout
            results.append({
                "test_number": i + 1,
                "passed": False,
                "error": str(e),
                "traceback": traceback.format_exc()
            })

    return {
        "success": all(r["passed"] for r in results),
        "results": results
    }
