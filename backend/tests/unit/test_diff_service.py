from app.services.diff_service import diff_results

def test_identical_results():
    r = {"rows": [{"id": 1}, {"id": 2}]}
    result = diff_results(r, r)
    assert result["identical"] is True

def test_different_results():
    a = {"rows": [{"id": 1}, {"id": 2}]}
    b = {"rows": [{"id": 2}, {"id": 3}]}
    result = diff_results(a, b)
    assert {"id": 1} in result["only_in_a"]
    assert {"id": 3} in result["only_in_b"]
    assert {"id": 2} in result["common"]
