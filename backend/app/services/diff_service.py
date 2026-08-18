"""Compares two query result sets row-by-row using a simple set-based diff."""

def diff_results(result_a: dict, result_b: dict) -> dict:
    rows_a = [tuple(sorted(r.items())) for r in result_a["rows"]]
    rows_b = [tuple(sorted(r.items())) for r in result_b["rows"]]

    set_a, set_b = set(rows_a), set(rows_b)
    only_in_a = [dict(r) for r in set_a - set_b]
    only_in_b = [dict(r) for r in set_b - set_a]
    common = [dict(r) for r in set_a & set_b]

    return {
        "only_in_a": only_in_a,
        "only_in_b": only_in_b,
        "common": common,
        "identical": not only_in_a and not only_in_b,
    }
