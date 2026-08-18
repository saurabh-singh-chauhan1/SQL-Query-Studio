from app.sql_engine.query_analyzer import analyze

def test_analyze_simple_select():
    result = analyze("SELECT id FROM users", dialect="sqlite")
    assert result["tables"] == ["users"]
    assert result["complexity"] == "simple"

def test_analyze_join_marks_moderate():
    result = analyze("SELECT a.id FROM a JOIN b ON a.id = b.a_id", dialect="sqlite")
    assert result["join_count"] == 1
    assert result["complexity"] == "moderate"

def test_analyze_detects_aggregate():
    result = analyze("SELECT COUNT(*) FROM users", dialect="sqlite")
    assert result["has_aggregate"] is True
